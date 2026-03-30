
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  try {
    const cookie = request.headers.get("cookie");
    if (!cookie) {
      return new Response(JSON.stringify({ error: "Não autenticado" }), { status: 401 });
    }
    const tokenMatch = cookie.match(/token=([^;]+)/);
    if (!tokenMatch) {
      return new Response(JSON.stringify({ error: "Token não encontrado" }), { status: 401 });
    }
    const token = tokenMatch[1];
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!);
      // Garante que payload é JwtPayload
      if (typeof payload !== "object" || payload === null) {
        return new Response(JSON.stringify({ error: "Token inválido" }), { status: 401 });
      }
      // Buscar usuário atualizado no banco
      const userId = payload.userId || payload.id;
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, name: true, createdAt: true, subscriptionType: true, tokens: true, resumeRewriteCredits: true } });
      if (!user) {
        return new Response(JSON.stringify({ error: "Usuário não encontrado" }), { status: 404 });
      }
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && now > payload.exp) {
        return new Response(JSON.stringify({ error: "Sessão expirada. Faça login novamente." }), { status: 401 });
      }
      // Atualiza o token se estiver perto de expirar
      if (payload.exp && payload.exp - now < 600) {
        const newToken = jwt.sign({ userId: user.id, email: user.email, name: user.name, createdAt: user.createdAt, subscriptionType: user.subscriptionType }, process.env.JWT_SECRET!, { expiresIn: "30m" });
        return new Response(
          JSON.stringify({ success: true, user: { userId: user.id, email: user.email, name: user.name, createdAt: user.createdAt, subscriptionType: user.subscriptionType, tokens: user.tokens, resumeRewriteCredits: user.resumeRewriteCredits } }),
          {
            status: 200,
            headers: {
              "Set-Cookie": `token=${newToken}; HttpOnly; Path=/; Max-Age=1800; SameSite=Strict; Secure`,
              "Content-Type": "application/json"
            }
          }
        );
      }
      // Retorna sempre os dados atualizados do banco
      return new Response(
        JSON.stringify({ success: true, user: { userId: user.id, email: user.email, name: user.name, createdAt: user.createdAt, subscriptionType: user.subscriptionType, tokens: user.tokens, resumeRewriteCredits: user.resumeRewriteCredits } }),
        { status: 200 }
      );
    } catch (err) {
      return new Response(JSON.stringify({ error: "Token inválido" }), { status: 401 });
    }
  } catch (error) {
    console.error("[Auth Protected Error]", error);
    return new Response(JSON.stringify({ error: "Erro interno no servidor." }), { status: 500 });
  }
}
