import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8)
});

import { NextApiRequest, NextApiResponse } from "next";

export async function registerUser(req: NextApiRequest, res: NextApiResponse) {
  const { email, password, confirmPassword } = req.body;
  const parse = schema.safeParse({ email, password, confirmPassword });
  if (!parse.success) return res.status(400).json({ error: "Dados inválidos" });
  if (password !== confirmPassword) return res.status(400).json({ error: "Senhas não coincidem" });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: "Email já cadastrado" });

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({ data: { email, passwordHash } as any });
  return res.status(201).json({ success: true });
}
