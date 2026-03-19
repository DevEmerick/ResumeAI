import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }
  const { email, password } = req.body;
  const parse = loginSchema.safeParse({ email, password });
  if (!parse.success) {
    return res.status(400).json({ error: "Dados inválidos" });
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !('passwordHash' in user)) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }
  const valid = await bcrypt.compare(password, (user as any).passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }
  // Nunca retorna passwordHash
  const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: "7d" });
  res.setHeader("Set-Cookie", `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict; Secure`);
  return res.status(200).json({ success: true });
}
