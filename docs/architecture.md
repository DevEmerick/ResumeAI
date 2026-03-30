- **Dashboard:**
  - Exibe saldo de tokens/créditos, histórico de análises, gerenciamento de plano
  - Componentes reutilizáveis e responsivos

## 7. Automated Testing
- **Unit/Integration:**
  - Testes Jest para todos os serviços críticos (CRUD, subscription, tokens, análise)
  - Mocks para Prisma, JWT, e dependências externas
- **E2E:**
  - Playwright cobre fluxos de usuário (login, upload, upgrade, compra)
- **Test Coverage:**
  - Testes garantem upgrade PRO, compra de créditos, downgrade, consumo de tokens, e CRUD de usuário

## 8. Scripts Utilitários
- **addTestUser.ts/js:** Cria usuários de teste rapidamente
- **populateAnalysisHistory.ts:** Popula histórico para testes/UX
- **checkLastUserTokens.ts:** Verifica/refill de tokens para usuários

## 9. Configurações Relevantes
- **Next.js:** next.config.ts (default, App Router)
- **TailwindCSS:** tailwind.config.js (purge em src/, custom theme)
- **PostCSS:** postcss.config.js (autoprefixer, tailwind)
- **TypeScript:** tsconfig.json (strict, paths, incremental)
- **Prisma:** schema.prisma, migrations, scripts de sync/build

## 10. Security & Best Practices
- **Senhas:** bcryptjs, nunca armazenadas em texto puro
- **JWT:** Segredo via env, expiração, renovação automática
- **Validação:** Inputs sanitizados, parsing seguro de JSON da IA
- **Env Vars:** `.env.local` para segredos (DB, JWT, OpenAI)
- **Permissões mínimas:** Banco e scripts usam usuários restritos
- **Testes regulares:** CI/CD recomendado para rodar todos os testes

## 11. Extensibility & Future-Proofing
- **Service Layer:** Fácil adicionar novos provedores de IA, regras de negócio, integrações
- **DB Schema:** Pronto para Teams, histórico de versões, aprovações, edição de PDF
- **Componentização:** UI pronta para expansão (modais, cards, flows)

## 12. Onboarding & Contribution
- Leia o README.md para setup local, variáveis de ambiente e comandos
- Use scripts em `/scripts` para seed e manutenção
- Rode `npm run test` para garantir integridade antes de PRs
- Documentação e TODOs em `/docs`

---
Para dúvidas técnicas, consulte este arquivo, o README.md e o schema.prisma. Para onboarding de novos devs ou agentes, basta ler este architecture.md para entender toda a stack, práticas e fluxos do ResumeAI.

# ResumeAI — Complete Architecture & Onboarding Guide

## 1. Project Overview
ResumeAI is a SaaS platform for AI-powered resume analysis and rewriting. It is designed for extensibility, security, and developer productivity, using a modern, modular stack.

> **Important:** This project requires Prisma version 6.x. Other versions are not supported.

## 2. Tech Stack & Tooling
- **Frontend:** Next.js 16 (App Router), React 19, TypeScript 5, TailwindCSS 3
- **Backend:** Next.js API routes (Node.js), TypeScript
- **Database:** PostgreSQL (managed via Prisma ORM v6)
- **ORM:** Prisma v6 (strictly required)
- **AI Integration:** OpenAI API (cloud) e Ollama (local LLM, compatível com OpenAI SDK)
- **Authentication:** JWT (stateless, custom logic)
- **Testing:** Jest (unit/integration), Playwright (e2e)
- **Other:** Tesseract.js (OCR), Mammoth (DOCX parsing), pdf-parse (PDF parsing), bcryptjs (passwords)


## 4. Folder Structure & Responsibilities
```
root/
  src/
    app/            # Next.js App Router (pages, layouts, API endpoints)
    components/      # React components (UI, dashboard, cards, modals)
    contexts/        # React context providers (Auth, I18N, Analysis)
    hooks/           # Custom React hooks
    lib/             # Utilities (Prisma instance, CSRF, helpers)
    services/        # Business logic (AI, tokens, subscription, CRUD, OpenAI)
    types/           # Global TypeScript types
    pages/           # (Legacy) Next.js pages API (alguns endpoints)
  prisma/
    schema.prisma    # Database schema (User, Resume, AnalysisHistory, enums)
    migrations/      # DB migrations (auto versioned)
  scripts/           # Utility scripts (addTestUser, populateAnalysisHistory, etc.)
  tests/             # Jest/Playwright tests (api, components, e2e)
  docs/              # Documentation (architecture, todos)
  public/            # Static assets
  package.json       # Dependencies, scripts
  next.config.ts     # Next.js config
  tailwind.config.js # TailwindCSS config
  postcss.config.js  # PostCSS config
  tsconfig.json      # TypeScript config
```

## 5. Database Schema (Prisma v6)
### Models
- **User:** id, email, passwordHash, createdAt, updatedAt, name, subscriptionType (FREE/PRO/TEAM), tokens, resumeRewriteCredits, lastTokenRefill
- **Resume:** id, fileName, content, analysis, createdAt, userId
- **AnalysisHistory:** id, createdAt, userId, analysis, content, fileName, status, error
### Enums
- **SubscriptionType:** FREE, PRO, TEAM

## 6. Core Features & Logic
- **Authentication:** Stateless JWT, custom login/register, protected API endpoints
- **Resume Upload & Analysis:**
  - Upload de PDF/DOCX
  - Extração de texto (Tesseract/Mammoth/pdf-parse)
  - Análise via OpenAI API ou Ollama (LLM local)
  - Parsing seguro do JSON retornado pela IA
- **Token/Credit System:**
  - Usuários possuem tokens (análise) e resumeRewriteCredits (reescrita)
  - Upgrade para PRO concede 5 tokens e 2 créditos (refill mensal seguro)
  - Compra extra de tokens/créditos via API
  - Consumo de tokens controlado por serviço dedicado
- **Subscription Management:**
  - Planos: FREE, PRO, TEAM
  - Lógica de upgrade/downgrade/refill centralizada em `subscriptionService.ts`
  - UI reflete status e saldo em tempo real
- **Dashboard:**
  - Exibe saldo de tokens/créditos, histórico de análises, gerenciamento de plano
  - Componentes reutilizáveis e responsivos

## 3. Folder Structure
```
src/
  components/         # Reusable React components
  lib/                # Utilities (e.g., Prisma instance)
  services/           # Business logic, OpenAI integration
  api/                # API routes (Next.js App Router)
  hooks/              # Custom React hooks
  types/              # Global TypeScript types
  app/                # Pages and routes (Next.js)
prisma/
  schema.prisma       # Database schema
  migrations/         # DB migrations
scripts/              # Utility scripts (e.g., addTestUser)
docs/                 # Documentation (architecture, todos)
```

## 4. Database Schema (Prisma)
- **User:** id, email, passwordHash, createdAt, updatedAt, name, subscriptionType (FREE/PRO/TEAM), tokens, resumeRewriteCredits, lastTokenRefill
- **Resume:** id, fileName, content, analysis, createdAt, userId
- **AnalysisHistory:** id, createdAt, userId, analysis, content, fileName, status, error

## 5. Core Features & Logic
- **Authentication:** JWT-based, stateless, with protected API routes
- **Resume Upload & Analysis:** Users upload resumes (PDF/DOCX), text is extracted (Tesseract/Mammoth), sent to OpenAI for analysis
- **Token/Credit System:**
  - Users have tokens (for analysis) and resumeRewriteCredits (for rewriting)
  - Upgrading to PRO grants 5 tokens and 2 rewrite credits (monthly refill logic)
  - Extra tokens/credits can be purchased
- **Subscription Management:**
  - FREE, PRO, TEAM plans
  - Plan logic enforced in backend and reflected in UI
- **Dashboard:**
  - Shows token/credit balance, analysis history, and plan management

## 6. Automated Testing
- **Unit/Integration:** Jest tests for services (CRUD, subscription logic, credits)
- **E2E:** Playwright for user flows (login, upload, upgrade)

## 7. Extensibility
- Modular service layer for easy integration of new AI providers or business rules
- Database schema ready for future features (Teams, PDF rewriting, approval workflows)

## 8. Security & Best Practices
- Environment variables for secrets (JWT, DB)
- Secure password storage (bcryptjs)
- API routes protected by JWT
- Regular automated tests

---
For more details, see README.md and the Prisma schema.
