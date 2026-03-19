# ResumeAI SaaS – Arquitetura Técnica

## Project Overview

ResumeAI é uma plataforma SaaS que permite aos usuários fazer upload de currículos, analisar seu conteúdo com IA, receber feedback personalizado e gerenciar o histórico de análises. O sistema integra frontend moderno, backend robusto, autenticação segura, banco de dados relacional e processamento de IA local.

---

## Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Prisma ORM**
- **PostgreSQL**
- **Ollama** (IA local)
- **Zod** (validação)
- **Jest** (testes)

---

## Frontend Architecture

### App Router
- Estrutura baseada em diretório `/app`, com rotas para páginas principais: upload, dashboard, análise, conta, login, registro, pricing, etc.
- Suporte a rotas dinâmicas (`[slug]`), rotas protegidas e layouts reutilizáveis.

### Componentes
- Localizados em `/components`, organizados por função (ex: `Navbar`, `AuthForm`, `AnalysisCard`).
- Componentes reutilizáveis e desacoplados, facilitando manutenção e testes.

### UI Patterns
- **TailwindCSS** para estilização utilitária e responsiva.
- Padrão de design limpo, com foco em acessibilidade e experiência do usuário.

### Páginas
- `/upload`: Upload de currículos.
- `/dashboard`: Visão geral e histórico de análises.
- `/analysis`: Exibição de resultados de análise.
- `/account`: Gerenciamento de conta.
- Outras: `/login`, `/register`, `/features`, `/how-it-works`, `/pricing`.

---

## Backend & API

### API Routes
- Localizadas em `/src/api` e `/app/api`.
- Rotas RESTful para autenticação (`/auth`), análise de currículos (`/analyze`), tradução, etc.

### Request/Response Flow
- Recebem requisições HTTP, validam dados (Zod), executam lógica de negócio e retornam respostas JSON.

### Validação
- **Zod** é utilizado para validar payloads de entrada, garantindo integridade dos dados.

### Business Logic Separation
- Lógica de negócio centralizada em `/services` e `/lib`.
- Serviços como `resumeService`, `analysisHistoryService` e `openai` encapsulam regras e integrações externas.

---

## Database (Prisma)

### Schema
- Definido em `/prisma/schema.prisma`.
- Principais modelos: `User`, `Resume`, `AnalysisHistory`.

### Relationships
- Usuário possui múltiplos currículos e histórico de análises.
- Relacionamentos definidos via Prisma.

### CRUD Operations
- Prisma gerencia operações como:
  - Criação de usuários (registro)
  - Autenticação (login)
  - Armazenamento de análises
  - Consulta de histórico
  - Exclusão de currículos

---

## Authentication Flow

- **Registro**: Usuário cria conta via `/register`, senha é hasheada e salva no banco.
- **Login**: Usuário autentica via `/login`, sessão é criada.
- **Session Handling**: Sessões gerenciadas via cookies/tokens.
- **Protected Routes**: Middleware em `/auth/middleware.ts` protege rotas sensíveis.

---

## AI Integration

- **Extração de texto**: Função em `/lib/extractText.ts` processa PDF/Docx.
- **Envio para IA**: Texto é enviado para o Ollama via `/services/openai.ts`.
- **Resposta**: IA retorna análise estruturada, que é salva e exibida ao usuário.

---

## Data Flow

Usuário → Upload de currículo → API `/analyze` → Extração de texto → Envio para IA (Ollama) → Resposta da IA → Salva no banco (Prisma) → Exibição no UI (dashboard/análise)

---

## Folder Structure

- `/app`: Páginas, rotas e layouts do Next.js.
- `/components`: Componentes de UI reutilizáveis.
- `/services`: Lógica de negócio e integrações externas (IA, banco, etc).
- `/prisma`: Schema, migrações e configuração do banco.
- `/lib`: Funções utilitárias (auth, extração de texto, helpers).

---

## Best Practices Used

- **Clean code**: Código modular, legível e bem documentado.
- **Separation of concerns**: Lógica de UI, negócio e dados separadas.
- **Reusable components**: Componentes desacoplados e reutilizáveis.
- **Security practices**: Senhas hasheadas, rotas protegidas, validação de entrada.

---

## Possible Improvements

- Implementar caching de respostas de IA e queries frequentes.
- Adicionar rate limiting nas rotas de API para evitar abuso.
- Utilizar background jobs para análises demoradas.
- Otimizar performance do frontend (lazy loading, SSR/ISR).
- Monitoramento e logging centralizado.

---

*Este documento reflete a arquitetura técnica do ResumeAI SaaS conforme o código-fonte atual.*
