import { createUser, getUserById } from "@/services/auth/userCrud";
import { upgradeToPro, buyTokensOrCredits, updateUserSubscription } from "@/services/subscriptionService";
import { prisma } from "@/lib/prisma";

describe("Funcionalidade de upgrade para PRO e créditos de reescrita", () => {
  let userId: string;

  beforeAll(async () => {
    // Limpa usuários de teste antigos
    await prisma.user.deleteMany({ where: { email: { contains: "test-pro-credits@" } } });
    // Cria novo usuário
    const user = await createUser({
      name: "Test User",
      email: `test-pro-credits@${Date.now()}.com`,
      passwordHash: "hash"
    });
    userId = user.id;
  });

  it("deve iniciar com 1 token e 0 créditos", async () => {
    const user = await getUserById(userId);
    expect(user?.tokens).toBe(1);
    expect(user?.resumeRewriteCredits).toBe(0);
    expect(user?.subscriptionType).toBe("FREE");
  });

  it("upgrade para PRO adiciona 5 tokens e 2 créditos", async () => {
    await upgradeToPro(userId);
    const user = await getUserById(userId);
    expect(user?.subscriptionType).toBe("PRO");
    expect(user?.tokens).toBeGreaterThanOrEqual(6); // 1 inicial + 5
    expect(user?.resumeRewriteCredits).toBeGreaterThanOrEqual(2);
  });

  it("compra extra de tokens e créditos funciona", async () => {
    await buyTokensOrCredits(userId, 3, 1);
    const user = await getUserById(userId);
    expect(user?.tokens).toBeGreaterThanOrEqual(9); // 6 + 3
    expect(user?.resumeRewriteCredits).toBeGreaterThanOrEqual(3); // 2 + 1
  });

  it("downgrade para FREE não remove tokens/créditos", async () => {
    await updateUserSubscription(userId, "FREE");
    const user = await getUserById(userId);
    expect(user?.subscriptionType).toBe("FREE");
    expect(user?.tokens).toBeGreaterThanOrEqual(9);
    expect(user?.resumeRewriteCredits).toBeGreaterThanOrEqual(3);
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { id: userId } });
  });
});
