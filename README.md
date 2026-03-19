This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/create-next-app).

# ResumeAI

SaaS moderno para análise de currículos com IA.

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Prisma ORM
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
