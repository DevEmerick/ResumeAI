import { addMonths, isAfter } from "date-fns";
// Adiciona tokens e créditos ao fazer upgrade para Pro
export async function upgradeToPro(userId: string) {
  // Busca usuário
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Usuário não encontrado");

  // Lógica de renovação mensal segura
  const now = new Date();
  let shouldRefill = false;
  if (!user.lastTokenRefill) {
    shouldRefill = true;
  } else {
    // Só permite refill se já passou 1 mês
    shouldRefill = isAfter(now, addMonths(user.lastTokenRefill, 1));
  }

  let tokensToAdd = 0;
  let creditsToAdd = 0;
  if (shouldRefill) {
    tokensToAdd = 5;
    creditsToAdd = 2;
  }

  // Sempre faz upgrade de plano
  return prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionType: "PRO",
      tokens: { increment: tokensToAdd },
      resumeRewriteCredits: { increment: creditsToAdd },
      lastTokenRefill: shouldRefill ? now : user.lastTokenRefill,
    },
  });
}

// Compra extra de tokens/créditos
export async function buyTokensOrCredits(userId: string, tokens: number, credits: number) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      tokens: { increment: tokens },
      resumeRewriteCredits: { increment: credits },
    },
  });
}
import { prisma } from "../lib/prisma";
import { SubscriptionType } from "@prisma/client";

export async function updateUserSubscription(userId: string, subscriptionType: SubscriptionType) {
  return prisma.user.update({
    where: { id: userId },
    data: { subscriptionType },
  });
}

export async function getUserSubscription(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionType: true },
  });
  return user?.subscriptionType || SubscriptionType.FREE;
}
