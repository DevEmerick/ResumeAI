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
