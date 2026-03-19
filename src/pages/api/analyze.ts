import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import formidable, { Fields, Files } from "formidable";
import { analyzeResume } from "@/services/ai/resumeAnalyzer";
import { extractTextFromFile } from "@/lib/extractText";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método não permitido" });
    return;
  }
  
  // Exige que o usuário esteja logado e resgata o ID do perfil
  const userId = await requireAuth(req, res);
  if (!userId) return;

  try {
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
          return;
        }
        const fileArray = files.file;
        if (!fileArray || fileArray.length === 0) {
          res.status(400).json({ error: "Arquivo não enviado." });
          return;
        }
        const f = Array.isArray(fileArray) ? fileArray[0] : (fileArray as any);
        if (!["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"].includes(f.mimetype || "")) {
          res.status(400).json({ error: "Tipo de arquivo não permitido. Apenas PDF ou DOCX." });
          return;
        }
        if (f.size > 5 * 1024 * 1024) {
          res.status(400).json({ error: "Arquivo excede o limite de 5MB." });
          return;
        }
        const buffer = await fs.promises.readFile(f.filepath);
        const mime = f.mimetype || "";
        let text = "";
        try {
          text = await extractTextFromFile({ buffer, mime });
          text = text.replace(/[<>]/g, "").replace(/\0/g, ""); // Remove null bytes para o Postgres não recusar
        } catch (error) {
          const e = error as Error;
          console.error("Erro ao extrair texto:", e);
          res.status(400).json({ error: e.message || "Falha ao extrair texto do arquivo." });
          return;
        }
        try {
          let analysis;
          try {
            analysis = await analyzeResume(text);
          } catch (error) {
            const e = error as Error;
            // Se erro de JSON, retorna mensagem amigável
            if (e.message && e.message.includes("Expected")) {
              res.status(500).json({ error: "Erro ao processar resposta da IA. Tente novamente ou ajuste o currículo." });
              return;
            }
            throw e;
          }

          // 💾 Salva o currículo e a análise no perfil do usuário no banco
          try {
            const analysisString = typeof analysis === "string" 
              ? analysis.replace(/[<>]/g, "") 
              : JSON.stringify(analysis);

            // Salva na tabela Resume
            await prisma.resume.create({
              data: {
                fileName: f.originalFilename || f.newFilename || "curriculo",
                content: text,
                analysis: analysisString.replace(/\0/g, ""),
                user: { connect: { id: userId } }
              }
            });

            // Salva também na tabela AnalysisHistory para o histórico do usuário
            await prisma.analysisHistory.create({
              data: {
                userId,
                fileName: f.originalFilename || f.newFilename || "curriculo",
                content: text,
                analysis: analysisString.replace(/\0/g, ""),
              }
            });
          } catch (dbError) {
            console.error("🚨 Erro Crítico ao salvar no banco:", dbError);
          }

          if (typeof analysis === "string") {
            res.status(200).json({ analysis: analysis.replace(/[<>]/g, ""), content: text });
            return;
          }
          res.status(200).json({ analysis, content: text });
        } catch (error) {
          const e = error as Error;
          console.error("Erro IA:", e);
          
          let errorMessage = e.message || "Erro ao analisar currículo com IA local.";
          if (errorMessage.includes("fetch failed") || errorMessage.includes("ECONNREFUSED")) {
            errorMessage = "Não foi possível conectar à IA. Certifique-se de que o aplicativo Ollama está aberto e rodando no seu computador.";
          }
          
          res.status(500).json({ error: errorMessage });
        }
      } catch (error) {
        const e = error as Error;
        console.error("Erro inesperado:", e);
        res.status(500).json({ error: e.message || "Erro inesperado." });
      }
    });
  } catch (error) {
    const e = error as Error;
    console.error("Erro inesperado:", e);
    res.status(500).json({ error: e.message || "Erro inesperado." });
  }
}
