import type { NextApiRequest, NextApiResponse } from "next";

import { refillTokens } from "@/services/tokenService";
import jwt from "jsonwebtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }
  try {
    // Extrai token do cookie
    const cookie = req.headers.cookie || "";
    const match = cookie.match(/token=([^;]+)/);
    const token = match ? match[1] : null;
    if (!token) return res.status(401).json({ error: "Não autenticado" });
    let userId = null;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as any;
      userId = decoded.userId || decoded.id;
    } catch {
      return res.status(401).json({ error: "Token inválido ou expirado" });
    }
    if (!userId) return res.status(401).json({ error: "Não autenticado" });
    const { amount } = req.body;
    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ error: "Quantidade inválida" });
    }
    const user = await refillTokens(userId, amount);
    return res.status(200).json({ tokens: user.tokens });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || "Erro ao recarregar tokens" });
  }
}
