import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  email: z.string().email()
});

import { NextApiRequest, NextApiResponse } from "next";

export async function deleteUser(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body;
  const parse = schema.safeParse({ email });
  if (!parse.success) return res.status(400).json({ error: "Dados inválidos" });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

  await prisma.user.delete({ where: { email } });
  return res.status(200).json({ success: true });
}
