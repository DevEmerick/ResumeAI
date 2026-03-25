import { NextRequest, NextResponse } from "next/server";
import { updateUserSubscription } from "@/services/subscriptionService";
import { SubscriptionType } from "@prisma/client";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const cookie = req.headers.get("cookie");
    if (!cookie) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    const tokenMatch = cookie.match(/token=([^;]+)/);
    if (!tokenMatch) {
      return NextResponse.json({ error: "Token não encontrado" }, { status: 401 });
    }
    const token = tokenMatch[1];
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }
    if (typeof payload !== "object" || payload === null) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }
    const userId = payload.userId || payload.id;
    if (!userId) {
      return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
    }
    const { subscriptionType } = await req.json();
    if (!Object.values(SubscriptionType).includes(subscriptionType)) {
      return NextResponse.json({ error: "Invalid subscription type" }, { status: 400 });
    }
    await updateUserSubscription(userId, subscriptionType);
    return NextResponse.json({ success: true, subscriptionType });
  } catch (error) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
