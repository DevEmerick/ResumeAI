import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function DELETE(req: NextRequest) {
  try {
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
    await prisma.analysisHistory.deleteMany({ where: { userId } });
    await prisma.resume.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
    const response = NextResponse.json({ success: true });
    response.cookies.set("token", "", { maxAge: 0, path: "/" });
    return response;
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Erro inesperado ao excluir conta." }, { status: 500 });
  }
}