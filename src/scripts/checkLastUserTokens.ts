import { prisma } from "../lib/prisma";

async function main() {
  const user = await prisma.user.findFirst({
    orderBy: { createdAt: 'desc' },
    select: { email: true, tokens: true, subscriptionType: true, createdAt: true },
  });
  console.log('Último usuário criado:', user);
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
