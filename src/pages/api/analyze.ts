import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import formidable, { Fields, Files } from "formidable";
import { analyzeResume } from "@/services/ai/resumeAnalyzer";
import { extractTextFromFile } from "@/lib/extractText";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { consumeToken } from "@/services/tokenService";
import { rateLimit } from "@/lib/rateLimit";
import { verifyCSRF } from "@/lib/csrf";

export const config = {
  api: {
    bodyParser: false,
  },
};

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

function getTokenFromCookie(cookie: string) {
  const match = cookie.match(/token=([^;]+)/);
  return match ? match[1] : null;
}

async function requireAuth(req: NextApiRequest, res: NextApiResponse) {
  const cookie = req.headers.cookie || "";
  const token = getTokenFromCookie(cookie);
  if (!token) {
    res.status(401).json({ error: "Usuário não autenticado." });
    return null;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    // Retorna o ID do usuário que está dentro do Token de Autenticação
    return decoded.id || decoded.userId || decoded.sub || null;
  } catch {
    res.status(401).json({ error: "Token inválido ou expirado." });
    return null;
  }
}

/**
 * Analisa a assinatura (Magic Bytes) real do arquivo lendo seu Buffer para evitar 
 * que executáveis (.exe, .sh) sejam enviados forjando o cabeçalho Content-Type.
 */
function isValidFileSignature(buffer: Buffer, mimetype: string): boolean {
  const hex = buffer.subarray(0, 8).toString("hex").toLowerCase();
  if (mimetype === "application/pdf") {
    // Assinatura de arquivo PDF: %PDF (25 50 44 46)
    return hex.startsWith("25504446");
  }
  if (mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    // Assinatura de arquivo DOCX (que na verdade é um ZIP): PK (50 4b 03 04)
    return hex.startsWith("504b0304");
  }
  if (mimetype === "application/msword") {
    // Assinatura de documento DOC antigo: D0 CF 11 E0 A1 B1 1A E1
    return hex.startsWith("d0cf11e0a1b11ae1");
  }
  return false;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método não permitido" });
    return;
  }
  
  // Validação CSRF
  if (!verifyCSRF(req)) {
    res.status(403).json({ error: "Acesso negado: CSRF detectado (Origem inválida)." });
    return;
  }


  // Exige que o usuário esteja logado e resgata o ID do perfil
  const userId = await requireAuth(req, res);
  if (!userId) return;

  // Consome token antes de processar análise
  const tokenOk = await consumeToken(userId);
  if (!tokenOk) {
    res.status(403).json({ error: "Você não possui tokens suficientes para realizar uma nova análise. Faça upgrade de plano ou recarregue seus tokens." });
    return;
  }

  // Limita a 3 requisições (uploads) por minuto por IP para prevenir ataques de DOS/Spam
  const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1") as string;
  const { success: rateLimitSuccess } = rateLimit(ip, 3, 60000);
  if (!rateLimitSuccess) {
    res.status(429).json({ error: "Muitos uploads simultâneos. Aguarde 1 minuto." });
    return;
  }

  return new Promise<void>((resolve) => {
      const form = formidable({
        maxFileSize: 5 * 1024 * 1024, // 5MB
        filter: (part) => {
          return ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"].includes(part.mimetype || "");
        },
      });

      form.parse(req, async (err, fields: Fields, files: Files) => {
        try {
          if (err) {
            res.status(400).json({ error: "Erro ao processar arquivo." });
            return resolve();
          }
          const fileArray = files.file;
          if (!fileArray || fileArray.length === 0) {
            res.status(400).json({ error: "Arquivo não enviado." });
            return resolve();
          }
          const f = Array.isArray(fileArray) ? fileArray[0] : (fileArray as any);
          if (!["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"].includes(f.mimetype || "")) {
            res.status(400).json({ error: "Tipo de arquivo não permitido. Apenas PDF ou DOCX." });
            return resolve();
          }
          if (f.size > 5 * 1024 * 1024) {
            res.status(400).json({ error: "Arquivo excede o limite de 5MB." });
            return resolve();
          }
          const buffer = await fs.promises.readFile(f.filepath);
          const mime = f.mimetype || "";

          // Validação de Segurança Estrita: Verifica os "Magic Bytes"
          // Se um hacker mandar um .exe renomeado para .pdf pelo Postman, isso vai bloquear.
          if (!isValidFileSignature(buffer, mime)) {
            console.warn(`[Security] Tentativa de upload malicioso detectada de IP: ${ip}`);
            res.status(400).json({ error: "Formato de arquivo inválido ou conteúdo forjado detectado." });
            return resolve();
          }

          let text = "";
          try {
            text = await extractTextFromFile({ buffer, mime });
            text = text.replace(/[<>]/g, "").replace(/\0/g, ""); // Remove null bytes para o Postgres não recusar
          } catch (error) {
            console.error("Erro ao extrair texto:", error);
            res.status(400).json({ error: "Falha ao ler o conteúdo do arquivo." });
            return resolve();
          }

          let analysis;
          try {
            analysis = await analyzeResume(text);
          } catch (error) {
            const e = error as Error;
            if (e.message && e.message.includes("Expected")) {
              res.status(500).json({ error: "Erro ao processar resposta da IA. Tente novamente ou ajuste o currículo." });
              return resolve();
            }
            let errorMessage = e.message || "Erro ao analisar currículo com IA local.";
            if (errorMessage.includes("fetch failed") || errorMessage.includes("ECONNREFUSED")) {
              errorMessage = "Não foi possível conectar à IA. Certifique-se de que o aplicativo Ollama está rodando.";
            }
            res.status(500).json({ error: errorMessage });
            return resolve();
          }

          // 💾 Salva o currículo e a análise no perfil do usuário no banco
          try {
            const analysisString = typeof analysis === "string" 
              ? analysis.replace(/[<>]/g, "") 
              : JSON.stringify(analysis);
            
            // Prevenção extra contra injeção no nome do arquivo
            const safeFileName = (f.originalFilename || f.newFilename || "curriculo").replace(/[<>]/g, "").substring(0, 255);

            // Salva na tabela Resume
            await prisma.resume.create({
              data: {
                fileName: safeFileName,
                content: text,
                analysis: analysisString.replace(/\0/g, ""),
                user: { connect: { id: userId } }
              }
            });

            // Salva também na tabela AnalysisHistory para o histórico do usuário
            await prisma.analysisHistory.create({
              data: {
                userId,
                fileName: safeFileName,
                content: text,
                analysis: analysisString.replace(/\0/g, ""),
              }
            });
          } catch (dbError) {
            console.error("🚨 Erro Crítico ao salvar no banco:", dbError);
          }

          if (typeof analysis === "string") {
            res.status(200).json({ analysis: analysis.replace(/[<>]/g, ""), content: text });
            return resolve();
          }
          res.status(200).json({ analysis, content: text });
          return resolve();
        } catch (error) {
          console.error("Erro inesperado no analyze:", error);
          res.status(500).json({ error: "Erro interno no servidor ao processar o arquivo." });
          return resolve();
        }
      });
  });
}
