import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const email = 'testuser@ai.com';
  const password = 'TestPassword123!';
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, passwordHash } as any
  });
  console.log('Usuário inserido:', { email, password });
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
