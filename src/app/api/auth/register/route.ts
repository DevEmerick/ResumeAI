import { prisma } from "@/lib/prisma";
import { createUser } from "@/services/auth/userCrud";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8)
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, confirmPassword } = body;
    const parse = registerSchema.safeParse({ name, email, password, confirmPassword });
    if (!parse.success) {
      return new Response(JSON.stringify({ error: "Dados inválidos" }), { status: 400 });
    }
    if (password !== confirmPassword) {
      return new Response(JSON.stringify({ error: "Senhas não coincidem" }), { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return new Response(JSON.stringify({ error: "Email já cadastrado" }), { status: 409 });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    await createUser({ name, email, passwordHash });
    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (error) {
    console.error('Erro no registro:', error);
    return new Response(JSON.stringify({ error: `Erro interno: ${error instanceof Error ? error.message : String(error)}` }), { status: 500 });
  }
}
