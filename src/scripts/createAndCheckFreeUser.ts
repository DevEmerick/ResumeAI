import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const email = `testfreeuser_${Date.now()}@ai.com`;
  const password = 'TestPassword123!';
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, passwordHash }
  });
  console.log('Usuário criado:', { email, password });
  const fetched = await prisma.user.findUnique({ where: { id: user.id }, select: { tokens: true, subscriptionType: true } });
  console.log('Dados do usuário:', fetched);
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
