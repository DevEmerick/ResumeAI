import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Método não permitido" });
    return;
  }
  const { id } = req.query;
  if (!id || typeof id !== "string") {
    res.status(400).json({ error: "ID da análise não informado" });
    return;
  }
  const analysis = await prisma.analysisHistory.findUnique({ where: { id } });
  if (!analysis) {
    res.status(404).json({ error: "Análise não encontrada" });
    return;
  }
  res.status(200).json({
    status: analysis.status,
    analysis: analysis.analysis,
    error: analysis.error,
    fileName: analysis.fileName,
    createdAt: analysis.createdAt,
  });
}
