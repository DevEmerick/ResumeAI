
import { NextApiRequest, NextApiResponse } from "next";
import { createUser } from "@/services/auth/userCrud";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8)
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }
  const { name, email, password, confirmPassword } = req.body;
  const parse = registerSchema.safeParse({ name, email, password, confirmPassword });
  if (!parse.success) {
    return res.status(400).json({ error: "Dados inválidos" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Senhas não coincidem" });
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: "Email já cadastrado" });
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await createUser({ name, email, passwordHash });
  // Autentica automaticamente após registro
  const token = jwt.sign({ userId: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET!, { expiresIn: "7d" });
  res.setHeader("Set-Cookie", `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict; Secure`);
  return res.status(201).json({ success: true });
}
