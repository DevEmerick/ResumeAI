require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function main() {
  const prisma = new PrismaClient();
  const email = 'testuser@ai.com';
  const password = 'TestPassword123!';
  const passwordHash = await bcrypt.hash(password, 12);
  
  try {
    const user = await prisma.user.create({
      data: { 
        email, 
        passwordHash,
        name: 'Test User',
        subscriptionType: 'FREE',
        tokens: 10,
        resumeRewriteCredits: 2,
        lastTokenRefill: new Date()
      }
    });
    console.log('✅ Usuário inserido:', { email, password });
    console.log('   ID:', user.id);
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️  Usuário já existe:', email);
    } else {
      throw error;
    }
  }
  
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
