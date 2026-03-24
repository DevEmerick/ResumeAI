import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    const parse = loginSchema.safeParse({ email, password });
    if (!parse.success) {
      return new Response(JSON.stringify({ error: "Dados inválidos" }), { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !('passwordHash' in user)) {
      return new Response(JSON.stringify({ error: "Credenciais inválidas" }), { status: 401 });
    }
    const valid = await bcrypt.compare(password, (user as any).passwordHash);
    if (!valid) {
      return new Response(JSON.stringify({ error: "Credenciais inválidas" }), { status: 401 });
    }
    // Nunca retorna passwordHash
    // Expiração curta: 30min
    const token = jwt.sign({ userId: user.id, email: user.email, name: user.name, createdAt: user.createdAt, subscriptionType: user.subscriptionType }, process.env.JWT_SECRET!, { expiresIn: "30m" });
    return new Response(
      JSON.stringify({ success: true, user: { userId: user.id, email: user.email, name: user.name, createdAt: user.createdAt, subscriptionType: user.subscriptionType } }),
      {
        status: 200,
        headers: {
          "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=1800; SameSite=Strict; Secure`,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.error("[Auth Login Error]", error);
    return new Response(JSON.stringify({ error: "Erro interno no servidor." }), { status: 500 });
  }
}
