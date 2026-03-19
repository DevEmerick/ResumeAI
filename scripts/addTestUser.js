require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });
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
