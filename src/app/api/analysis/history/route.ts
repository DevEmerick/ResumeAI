import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (userId) {
    // Busca direta pelo Prisma para evitar loop infinito com o fetch do Frontend
    const history = await prisma.analysisHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(history);
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
      try { score = JSON.parse(item.analysis).score; } catch {}
      
      // "Mockamos" o analysis apenas com o score para não quebrar a tipagem no frontend
      return { ...item, analysis: JSON.stringify({ score }) };
    });

    return NextResponse.json(sanitizedLeaderboard);
  }
}

export async function POST(req: NextRequest) {
  try {
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
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Erro inesperado." }, { status: 500 });
  }
}


// DELETE /api/analysis/history?id=ANALYSIS_ID
export async function DELETE(req: NextRequest) {
  try {
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
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Erro inesperado." }, { status: 500 });
  }
}
