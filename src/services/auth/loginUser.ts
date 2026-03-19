import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

import { NextApiRequest, NextApiResponse } from "next";

export async function loginUser(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;
  const parse = schema.safeParse({ email, password });
  if (!parse.success) return res.status(400).json({ error: "Dados inválidos" });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Usuário não encontrado" });

  const valid = await bcrypt.compare(password, (user as any).passwordHash);
  if (!valid) return res.status(401).json({ error: "Senha incorreta" });

  // Aqui você pode gerar o JWT ou cookie
  return res.status(200).json({ success: true, userId: user.id });
}
