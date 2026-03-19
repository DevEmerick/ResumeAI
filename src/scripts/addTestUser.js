const { prisma } = require('../../lib/prisma');
const bcrypt = require('bcryptjs');

async function main() {
  const email = 'testuser@ai.com';
  const password = 'TestPassword123!';
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, passwordHash }
  });
  console.log('Usuário inserido:', { email, password });
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
