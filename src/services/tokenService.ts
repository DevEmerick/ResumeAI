import { prisma } from "../lib/prisma";
import { SubscriptionType } from "@prisma/client";

export async function consumeToken(userId: string): Promise<boolean> {
  // Busca usuário
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return false;
  // Team não consome token
  if (user.subscriptionType === "TEAM") return true;
  // Free e Pro: precisa ter token
  if ((user.subscriptionType === "FREE" && user.tokens > 0) || (user.subscriptionType === "PRO" && user.tokens > 0)) {
    await prisma.user.update({ where: { id: userId }, data: { tokens: { decrement: 1 } } });
    return true;
  }
  return false;
}

export async function refillTokens(userId: string, amount: number) {
  return prisma.user.update({ where: { id: userId }, data: { tokens: { increment: amount } } });
}

export async function resetProTokensIfNeeded(userId: string) {
  // Reseta tokens do Pro se passou 30 dias do lastTokenRefill
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.subscriptionType !== "PRO") return;
  const now = new Date();
  const last = user.lastTokenRefill ? new Date(user.lastTokenRefill) : null;
  if (!last || (now.getTime() - last.getTime()) > 1000 * 60 * 60 * 24 * 30) {
    await prisma.user.update({ where: { id: userId }, data: { tokens: 10, lastTokenRefill: now } });
  }
}
