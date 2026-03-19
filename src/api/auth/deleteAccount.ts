import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Método não permitido" });
  }
  const token = req.cookies.token || req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "Não autenticado" });
  }
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;
    await prisma.resume.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
    res.setHeader("Set-Cookie", "token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict; Secure");
    return res.status(200).json({ success: true });
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}
