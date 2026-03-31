# ResumeAI — Análise de Currículos com IA

> SaaS moderno para análise e reescrita de currículos usando IA generativa (OpenAI/Ollama), Next.js 16, Prisma 7 e PostgreSQL.

---

## 🚀 Passo a Passo para Rodar Localmente

### 1. Pré-requisitos
- Node.js 18+ e npm
- PostgreSQL rodando localmente (ou Docker)

### 2. Clone o repositório e instale as dependências
```bash
# Clone o projeto
git clone <url-do-repo>
cd resume-analyser
# Instale as dependências
npm install
```

### 3. Configure o banco de dados
- Crie um banco local chamado `resumeai`:
```bash
psql -h localhost -U $(whoami) -c "CREATE DATABASE resumeai;"
```
- Crie o arquivo `.env.local` na raiz:
```bash
cp .env.example .env.local
```
- Edite `.env.local` e ajuste:
```
DATABASE_URL="postgresql://<seu_usuario>@localhost:5432/resumeai"
JWT_SECRET="umsegredoseguroparaautenticacao"
```

### 4. Gere o Prisma Client e sincronize o banco
```bash
npm install prisma@latest @prisma/client@latest @prisma/adapter-pg@latest
npx prisma generate
npx prisma db push
```

### 5. (Opcional) Popule o banco com dados de teste
```bash
npx ts-node scripts/populateAnalysisHistory.ts
```

### 6. (Opcional) Crie um usuário de teste
```bash
npx ts-node scripts/addTestUser.ts
```
Usuário: `testuser@ai.com` / Senha: `TestPassword123!`

### 7. Rode o projeto
```bash
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000)

---

## 🧩 Estrutura de Pastas
```
src/
  components/         # Componentes React reutilizáveis
  lib/                # Instâncias e utilitários (ex: Prisma)
  services/           # Serviços externos (OpenAI, Ollama, tokens)
  api/                # Rotas API (Next.js App Router)
  hooks/              # React hooks customizados
  types/              # Tipos TypeScript globais
  app/                # Páginas e rotas (Next.js)
prisma/
  schema.prisma       # Schema do banco (Prisma 7, sem url)
  migrations/         # Migrações automáticas
scripts/              # Scripts utilitários (addTestUser, populateAnalysisHistory)
docs/                 # Documentação (architecture, todos)
```

## 🗄️ Modelos do Banco (Prisma)
- **User:** id, email, passwordHash, createdAt, updatedAt, name, subscriptionType (FREE/PRO/TEAM), tokens, resumeRewriteCredits, lastTokenRefill
- **Resume:** id, fileName, content, analysis, createdAt, userId
- **AnalysisHistory:** id, createdAt, userId, analysis, content, fileName, status, error

## 🔬 Testes Automatizados
- **Unitários/Integração:** Jest cobre serviços, lógica de tokens, subscription, CRUD
- **E2E:** Playwright cobre fluxos de usuário (login, upload, upgrade)

## 🛠️ Scripts Úteis
- `addTestUser.ts`: Cria usuário de teste
- `populateAnalysisHistory.ts`: Popula histórico de análise
- `checkLastUserTokens.ts`: Verifica/refill de tokens

## 📚 Dúvidas e Onboarding
- Leia este README e o `docs/architecture.md` para onboarding completo
- Para dúvidas técnicas, consulte também o `prisma/schema.prisma`

---

## 💡 Sobre o Projeto
ResumeAI é um SaaS para análise e reescrita de currículos com IA, pronto para produção, onboarding rápido e arquitetura moderna. Ideal para devs, RH e quem busca automação de feedback em currículos.

---


# Como rodar este projeto localmente (universal)

## 1. Pré-requisitos
- Node.js 18+ e npm instalados
- PostgreSQL rodando localmente (não é obrigatório Docker)

## 2. Instale as dependências
```bash
npm install
 Next.js 16 (App Router)
 React 19
 TypeScript 5
 TailwindCSS
 Prisma ORM (v7)
 PostgreSQL
 OpenAI API / Ollama (LLM local)
```bash
psql -h localhost -U $(whoami) -c "CREATE DATABASE resumeai;"
```
 src/
   components/         # Componentes React reutilizáveis
   lib/                # Instâncias e utilitários (ex: Prisma)
   services/           # Serviços externos (ex: OpenAI, Ollama, tokens)
   api/                # Rotas API (Next.js App Router)
   hooks/              # React hooks customizados
   types/              # Tipos TypeScript globais
   app/                # Páginas e rotas (Next.js)
 prisma/
   schema.prisma       # Schema do banco (Prisma 7, sem url)
   migrations/         # Migrações automáticas
 scripts/              # Scripts utilitários (addTestUser, populateAnalysisHistory)
 docs/                 # Documentação (architecture, todos)
 ```
DATABASE_URL="postgresql://<seu_usuario>@localhost:5432/resumeai"
JWT_SECRET="umsegredoseguroparaautenticacao"
 User: id, email, passwordHash, createdAt, updatedAt, name, subscriptionType (FREE/PRO/TEAM), tokens, resumeRewriteCredits, lastTokenRefill
 Resume: id, fileName, content, analysis, createdAt, userId
 AnalysisHistory: id, createdAt, userId, analysis, content, fileName, status, error

## 5. Rode as migrações e gere o Prisma Client
 O projeto já está pronto para rodar com **Prisma 7**. Não edite o campo `url` no `schema.prisma` — a URL é lida do `prisma.config.ts`.
 O upload e análise de currículo já estão prontos para integração com OpenAI ou Ollama.

```bash
npx prisma generate
npx prisma db push
```

 ## Testes Automatizados
 - **Unitários/Integração:** Jest cobre serviços, lógica de tokens, subscription, CRUD
 - **E2E:** Playwright cobre fluxos de usuário (login, upload, upgrade)

 ## Scripts Utilitários
 - `addTestUser.ts`: Cria usuário de teste
 - `populateAnalysisHistory.ts`: Popula histórico de análise
 - `checkLastUserTokens.ts`: Verifica/refill de tokens

 ## Dúvidas e Onboarding
 - Leia este README e o `docs/architecture.md` para onboarding completo
 - Para dúvidas técnicas, consulte também o `prisma/schema.prisma`
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
