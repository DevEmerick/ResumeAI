
require('dotenv').config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const users = [
  { name: "Ana Silva", email: "ana1@example.com" },
  { name: "Bruno Costa", email: "bruno2@example.com" },
  { name: "Carla Souza", email: "carla3@example.com" },
  { name: "Diego Lima", email: "diego4@example.com" },
  { name: "Eduarda Alves", email: "eduarda5@example.com" },
  { name: "Felipe Rocha", email: "felipe6@example.com" },
  { name: "Gabriela Dias", email: "gabriela7@example.com" },
  { name: "Henrique Pinto", email: "henrique8@example.com" },
  { name: "Isabela Ramos", email: "isabela9@example.com" },
  { name: "João Pedro", email: "joao10@example.com" },
  { name: "Karen Martins", email: "karen11@example.com" },
  { name: "Lucas Ferreira", email: "lucas12@example.com" },
  { name: "Marina Teixeira", email: "marina13@example.com" },
  { name: "Nicolas Barros", email: "nicolas14@example.com" },
  { name: "Olivia Castro", email: "olivia15@example.com" },
];

function randomScore() {
  return Math.floor(Math.random() * 41) + 60; // 60-100
}

async function main() {
  for (const user of users) {
    // Cria usuário se não existir
    let dbUser = await prisma.user.findUnique({ where: { email: user.email } });
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          passwordHash: "$2a$10$testehashparapopular", // hash fake
        },
      });
    }
    // Cria 1 análise para cada usuário
    await prisma.analysisHistory.create({
      data: {
        userId: dbUser.id,
        fileName: `cv_${user.name.replace(/ /g, "_")}.pdf`,
        content: "Conteúdo fictício do currículo.",
        analysis: JSON.stringify({ score: randomScore() }),
      },
    });
  }
  console.log("População concluída com 15 análises!");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
