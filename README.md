

# Como rodar este projeto localmente (universal)

## 1. Pré-requisitos
- Node.js 18+ e npm instalados
- PostgreSQL rodando localmente (não é obrigatório Docker)

## 2. Instale as dependências
```bash
npm install
```

## 3. Configure o banco de dados
O projeto espera um banco PostgreSQL local chamado `resumeai` e um usuário com permissão total. O padrão para Mac/Linux é usar o mesmo usuário do sistema, sem senha.

Para criar o banco e garantir funcionamento universal, rode:
```bash
psql -h localhost -U $(whoami) -c "CREATE DATABASE resumeai;"
```
Se já existir, pode ignorar o erro.

## 4. Configure as variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto:
```bash
cp .env.example .env.local
```
Edite `.env.local` e garanta:
```
DATABASE_URL="postgresql://<seu_usuario>@localhost:5432/resumeai"
JWT_SECRET="umsegredoseguroparaautenticacao"
```
Troque `<seu_usuario>` pelo seu usuário do sistema (ex: emerick).

## 5. Rode as migrações e gere o Prisma Client

> **Important:** This project requires Prisma version 6.x. Other versions are not supported.

```bash
npx prisma generate
npx prisma db push
```

## 6. (Opcional) Crie um usuário de teste
```bash
npx ts-node scripts/addTestUser.ts
```
Usuário padrão: `testuser@ai.com` / senha: `TestPassword123!`

## 7. Rode o projeto
```bash
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000)

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/create-next-app).

# ResumeAI

SaaS moderno para análise de currículos com IA.

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Prisma ORM (v6 only)
- PostgreSQL
- OpenAI API

## Estrutura de Pastas
```
src/
  components/         # Componentes React reutilizáveis
  lib/                # Instâncias e utilitários (ex: Prisma)
  services/           # Serviços externos (ex: OpenAI)
  api/                # Rotas API (Next.js App Router)
  hooks/              # React hooks customizados
  types/              # Tipos TypeScript globais
  app/                # Páginas e rotas (Next.js)
```

## Principais Páginas
- `/` Landing page
- `/dashboard` Dashboard do usuário
- `/upload` Upload de currículo
- `/analysis` Resultado da análise

## Componentes de Exemplo
- Navbar
- UploadCard
- AnalysisResultCard

## Banco de Dados (Prisma)
- User: id, email, createdAt
- Resume: id, userId, fileName, content, analysis, createdAt

## Observações
- Para rodar as migrações do Prisma 7, siga a documentação oficial para configuração da URL do banco.
- O upload e análise de currículo já estão prontos para integração com OpenAI.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/route.ts`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## API Routes

This directory contains example API routes for the headless API app.

For more details, see [route.js file convention](https://nextjs.org/docs/app/api-reference/file-conventions/route).
