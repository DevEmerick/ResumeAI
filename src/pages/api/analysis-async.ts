import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { IncomingForm } from "formidable";
import fs from "fs";
import { extractTextFromFile } from "@/lib/extractText";
import { prisma as defaultPrisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { consumeToken } from "@/services/tokenService";
import { analyzeResume } from "@/services/ai/resumeAnalyzer";

export const config = {
  api: {
    bodyParser: false,
  },
};

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

function getUserIdFromRequest(req: NextApiRequest): string | null {
  const cookie = req.headers.cookie || "";
  const match = cookie.match(/token=([^;]+)/);
  const token = match ? match[1] : null;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded.id || decoded.userId || decoded.sub || null;
  } catch {
    return null;
  }
}

// Permite injeção de dependência do prisma para testes
export default async function handler(req: NextApiRequest, res: NextApiResponse, prisma = defaultPrisma) {
  try {
    if (req.method !== "POST") {
      console.error("Método não permitido");
      res.status(405).json({ error: "Método não permitido" });
      return;
    }
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      console.error("Não autenticado");
      res.status(401).json({ error: "Não autenticado" });
      return;
    }
    // Não consome token aqui! Só verifica se está autenticado.
    // Parse do arquivo
    // Compatível com ESM (formidable 3.x) e Next.js 16+
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      try {
        if (err || !files.file) {
          console.error("Arquivo não enviado", err);
          res.status(400).json({ error: "Arquivo não enviado." });
          return;
        }
        const file = Array.isArray(files.file) ? files.file[0] : files.file;
        const buffer = file && file.filepath ? await fs.promises.readFile(file.filepath) : null;
        if (!buffer) {
          console.error("Falha ao ler arquivo");
          res.status(400).json({ error: "Falha ao ler arquivo." });
          return;
        }
        let text = "";
        try {
          text = await extractTextFromFile({ buffer, mime: file.mimetype || "" });
        } catch (e: any) {
          console.error("Falha ao extrair texto do arquivo", e);
          res.status(400).json({ error: "Falha ao extrair texto do arquivo: " + (e.message || e) });
          return;
        }
        // Cria registro de análise pendente
        let analysis;
        try {
          analysis = await prisma.analysisHistory.create({
            data: {
              userId,
              content: text,
              fileName: file.originalFilename || "curriculo.pdf",
              status: "pending" as any, // forçar tipo string
            } as any,
          });
        } catch (e: any) {
          console.error("Erro ao criar registro de análise", e);
          res.status(500).json({ error: "Erro ao criar registro de análise: " + (e.message || e) });
          return;
        }
        // Processa análise em background
        setTimeout(async () => {
          try {
            await prisma.analysisHistory.update({
              where: { id: analysis.id },
              data: { status: "processing" as any },
            } as any);
            const result = await analyzeResume(text);
            // Só consome token se a análise for bem-sucedida
            const tokenOk = await consumeToken(userId);
            if (!tokenOk) {
              await prisma.analysisHistory.update({
                where: { id: analysis.id },
                data: { status: "error" as any, error: "Você não possui tokens suficientes." },
              } as any);
              return;
            }
            await prisma.analysisHistory.update({
              where: { id: analysis.id },
              data: { status: "done" as any, analysis: typeof result === "string" ? result : JSON.stringify(result) },
            } as any);
          } catch (e: any) {
            console.error("Erro ao processar análise em background", e);
            await prisma.analysisHistory.update({
              where: { id: analysis.id },
              data: { status: "error" as any, error: e.message || "Erro ao analisar currículo" },
            } as any);
          }
        }, 0);
        // Retorna o ID da análise para o frontend
        res.status(200).json({ analysisId: analysis.id });
      } catch (e: any) {
        console.error("Erro inesperado no processamento do arquivo", e);
        res.status(500).json({ error: "Erro inesperado no processamento do arquivo: " + (e.message || e) });
      }
    });
  } catch (e: any) {
    console.error("Erro inesperado no handler do endpoint", e);
    res.status(500).json({ error: "Erro inesperado no servidor: " + (e.message || e) });
  }
}
