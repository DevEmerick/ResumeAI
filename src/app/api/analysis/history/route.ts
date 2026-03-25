import { verifyCSRF } from "@/lib/csrf";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  let response;
  if (userId) {
    // Proteção contra IDOR (Insecure Direct Object Reference) / Quebra de Controle de Acesso
    const cookie = req.headers.get("cookie") || "";
    const tokenMatch = cookie.match(/token=([^;]+)/);
    if (!tokenMatch) {
      response = NextResponse.json({ error: "Acesso negado: Não autenticado." }, { status: 401 });
    } else {
      try {
        const payload = jwt.verify(tokenMatch[1], process.env.JWT_SECRET!) as { userId?: string, id?: string };
        const authenticatedUserId = payload.userId || payload.id;
        if (authenticatedUserId !== userId) {
          response = NextResponse.json({ error: "Acesso negado: Você não tem permissão para visualizar os dados de outro usuário." }, { status: 403 });
        } else {
          // Busca direta pelo Prisma para evitar loop infinito com o fetch do Frontend
          const history = await prisma.analysisHistory.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
          });
          response = NextResponse.json(history);
        }
      } catch {
        response = NextResponse.json({ error: "Token inválido ou expirado." }, { status: 401 });
      }
    }
  } else {
    // Autenticação obrigatória para leaderboard
    const cookie = req.headers.get("cookie") || "";
    const tokenMatch = cookie.match(/token=([^;]+)/);
    if (!tokenMatch) {
      response = NextResponse.json({ error: "Acesso negado: Não autenticado." }, { status: 401 });
    } else {
      let user;
      try {
        const payload = jwt.verify(tokenMatch[1], process.env.JWT_SECRET!) as { userId?: string, id?: string };
        const authenticatedUserId = payload.userId || payload.id;
        user = await prisma.user.findUnique({ where: { id: authenticatedUserId }, select: { subscriptionType: true } });
        if (!user) {
          response = NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
        } else if (user.subscriptionType === "FREE") {
          response = NextResponse.json({ error: "Acesso restrito ao dashboard. Faça upgrade de plano para visualizar o leaderboard." }, { status: 403 });
        } else {
          // LEADERBOARD GLOBAL: Prevenção de Data Leak (PII) limitando os campos selecionados
          const allHistory = await prisma.analysisHistory.findMany({
            orderBy: { createdAt: "desc" },
            take: 50, // Limite para evitar sobrecarga
            select: {
              id: true,
              userId: true,
              fileName: true,
              createdAt: true,
              analysis: true, // Trazemos para extrair apenas o score abaixo
              user: {
                select: { name: true }
              }
            }
          });
          // Higieniza o retorno: NUNCA vaza o feedback completo ou texto do currículo de terceiros
          const sanitizedLeaderboard = allHistory.map(item => {
            let score = null;
            if (item.analysis) {
              try { score = JSON.parse(item.analysis).score; } catch {}
            }
            // "Mockamos" o analysis apenas com o score para não quebrar a tipagem no frontend
            return { ...item, analysis: JSON.stringify({ score }) };
          });
          response = NextResponse.json(sanitizedLeaderboard);
        }
      } catch {
        response = NextResponse.json({ error: "Token inválido ou expirado." }, { status: 401 });
      }
    }
  }
  return response;
}

export async function POST(req: NextRequest) {
  try {
    // Proteção Anti-CSRF
    if (!verifyCSRF(req)) {
      return NextResponse.json({ error: "Acesso negado: CSRF detectado." }, { status: 403 });
    }

    // Autenticação via cookie JWT
    const cookie = req.headers.get("cookie") || "";
    const tokenMatch = cookie.match(/token=([^;]+)/);
    if (!tokenMatch) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    const token = tokenMatch[1];
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json({ error: "Token inválido ou expirado" }, { status: 401 });
    }
    const { userId } = payload as { userId: string };
    if (!userId) {
      return NextResponse.json({ error: "Usuário não identificado" }, { status: 401 });
    }
    const { fileName, content, analysis } = await req.json();
    if (!fileName || !content || !analysis) {
      return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
    }
    const record = await prisma.analysisHistory.create({
      data: {
        userId,
        fileName: fileName.replace(/[<>]/g, ''),
        content: content.replace(/[<>]/g, ''),
        analysis: analysis.replace(/[<>]/g, ''),
      },
    });
    return NextResponse.json({ success: true, record }, { status: 201 });
  } catch (error) {
    console.error("[History POST Error]", error);
    return NextResponse.json({ error: "Erro interno ao salvar o histórico." }, { status: 500 });
  }
}


// DELETE /api/analysis/history?id=ANALYSIS_ID
export async function DELETE(req: NextRequest) {
  try {
    // Proteção Anti-CSRF
    if (!verifyCSRF(req)) {
      return NextResponse.json({ error: "Acesso negado: CSRF detectado." }, { status: 403 });
    }

    // Autenticação via cookie JWT
    const cookie = req.headers.get("cookie") || "";
    const tokenMatch = cookie.match(/token=([^;]+)/);
    if (!tokenMatch) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    const token = tokenMatch[1];
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json({ error: "Token inválido ou expirado" }, { status: 401 });
    }
    const { userId } = payload as { userId: string };
    if (!userId) {
      return NextResponse.json({ error: "Usuário não identificado" }, { status: 401 });
    }
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID da análise não informado." }, { status: 400 });
    }
    // Garante que a análise pertence ao usuário
    const analysis = await prisma.analysisHistory.findUnique({ where: { id } });
    if (!analysis || analysis.userId !== userId) {
      return NextResponse.json({ error: "Análise não encontrada ou não pertence ao usuário." }, { status: 404 });
    }
    await prisma.analysisHistory.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[History DELETE Error]", error);
    return NextResponse.json({ error: "Erro interno ao processar a requisição." }, { status: 500 });
  }
}
