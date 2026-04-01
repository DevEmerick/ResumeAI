# ResumeAI — Análise de Currículos com IA

> SaaS moderno para análise e reescrita de currículos usando IA generativa (OpenAI/Ollama), Next.js 16, Prisma 7 e PostgreSQL.

---

## 🚀 Quickstart (Funciona em Mac e Windows)

### ✨ Opção 1: Local (Mac + Windows) - Recomendado para Dev

**Pré-requisitos:**
- Node.js 18+
- Ollama instalado

**Instalar Ollama (escolha seu SO):**

**Mac:**
```bash
brew install ollama
```

**Windows (PowerShell como Admin):**
```powershell
winget install ollama.ollama
```

Ou baixe manualmente: https://ollama.ai

**Rode em 3 comandos:**
```bash
git clone <url-do-repo>
cd resume-analyser
npm install && npm run dev
```

**Pronto!** Acesse [http://localhost:3000](http://localhost:3000)

O que rodará automaticamente:
- ✅ SQLite local (ZERO configuração)
- ✅ Prisma Client
- ✅ Migrações automáticas
- ✅ Next.js Dev Server
- ✅ Prisma Studio em http://localhost:5555
- 🤖 Ollama (precisa estar rodando localmente)

**Para que o Ollama funcione:**

Antes de `npm run dev`, abra um novo terminal e rode:
```bash
ollama serve
```

Depois, em outro terminal:
```bash
ollama pull llama2
```

---

### 🐳 Opção 2: Docker Compose (Tudo Containerizado)

**Pré-requisitos:**
- [Docker Desktop](https://www.docker.com/products/docker-desktop) instalado

**Rode em 2 comandos:**
```bash
git clone <url-do-repo>
cd resume-analyser
docker-compose up
```

**Pronto!** Acesse [http://localhost:3000](http://localhost:3000)

O que rodará automaticamente (em containers):
- ✅ PostgreSQL
- ✅ Ollama + Modelo llama2
- ✅ Prisma Client
- ✅ Migrações automáticas
- ✅ Next.js Dev Server
- ✅ Prisma Studio em http://localhost:5555

**Dados do Docker:**
```
Database: resumeai
User: resumeai
Password: resumeai_dev_password
Ollama: http://localhost:11434
```

---

## 📖 Troubleshooting

### 🤖 Configurando Ollama

**Instalar Ollama (se ainda não tiver):**

Mac:
```bash
brew install ollama
```

Windows (PowerShell Admin):
```powershell
winget install ollama.ollama
```

**Depois de instalar, puxar o modelo:**
```bash
ollama pull llama2
```

**Verificar se Ollama está rodando:**
```bash
curl http://localhost:11434/api/tags
```

---

### ❌ "Cannot find Ollama" (Setup Local)
- Instale com um dos comandos acima
- Execute em um terminal separado: `ollama serve`
- Em outro terminal: `ollama pull llama2`
- Depois rode `npm run dev` em um terceiro terminal

### ❌ "Cannot find module" / Erro de dependência
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### ❌ Prisma Studio não abre
```bash
# Tente acessar manualmente
http://localhost:5555
```

### ❌ "Docker command not found"
- Instale [Docker Desktop](https://www.docker.com/products/docker-desktop)
- Reinicie o terminal após instalar

### ❌ Database errors no Docker
```bash
# Reset completo do Docker
docker-compose down -v
docker-compose up
```
```

### ❌ Ollama não inicia (Setup Local)
- Edite `package.json` script `dev` e remova `"ollama serve"`
- Ou instale Ollama: https://ollama.ai

---

## 📦 Tecnologias
- **Frontend:** Next.js 16, React 19, TailwindCSS
- **Backend:** Node.js com TypeScript
- **Database:** PostgreSQL + Prisma 7
- **IA:** OpenAI API ou Ollama (local)
- **PDF:** pdf-parse, Tesseract.js, Mammoth
- **Testes:** Jest (unit/integration), Playwright (E2E)
- **DevOps:** Docker, Docker Compose

---

## 📁 Estrutura do Projeto
```
src/
  ├── app/              # Páginas e rotas (Next.js App Router)
  ├── api/              # Endpoints da API
  ├── components/       # Componentes React reutilizáveis
  ├── services/         # Lógica de negócio (OpenAI, tokens, etc)
  ├── lib/              # Instâncias e utilitários (Prisma, auth)
  ├── hooks/            # React hooks customizados
  └── types/            # Tipos TypeScript
prisma/
  ├── schema.prisma     # Schema do banco (Prisma 7)
  └── migrations/       # Histórico de migrações
scripts/               # Utilitários (usuário de teste, populate, etc)
docs/                  # Documentação técnica
```

---

## 🗄️ Modelo de Dados (Prisma)
```prisma
model User {
  id                    String
  email                 String (único)
  passwordHash          String
  name                  String
  subscriptionType      FREE | PRO | TEAM
  tokens                Int (limite mensal)
  resumeRewriteCredits  Int (limite mensal)
  lastTokenRefill       DateTime
  createdAt             DateTime
}

model Resume {
  id       String
  fileName String
  content  String (texto extraído do PDF)
  analysis String? (resultado da análise com IA)
  userId   String (FK -> User)
  createdAt DateTime
}

model AnalysisHistory {
  id       String
  content  String
  analysis String
  fileName String
  status   PENDING | SUCCESS | FAILED
  error    String?
  userId   String (FK -> User)
  createdAt DateTime
}
```

---

## 🛠️ Scripts Úteis
```bash
# Criar usuário de teste
npx ts-node scripts/addTestUser.ts
# Resultado: testuser@ai.com / TestPassword123!

# Popular banco com histórico de análise
npx ts-node scripts/populateAnalysisHistory.ts

# Verificar/refill de tokens do usuário
npx ts-node scripts/checkLastUserTokens.ts

# Rodar testes
npm test                    # Unit + integration
npm run test:e2e           # E2E com Playwright
npm run test:with-server   # Tests com servidor rodando

# Build para produção
npm run build
npm start
```

---

---

## 💡 Dicas Importantes para Desenvolvimento

### Prisma 7 - Configuração Especial
- ⚠️ **NÃO adicione `url` ao schema.prisma** — A URL é lida de `prisma.config.ts`
- ✅ Use `DATABASE_URL` do `.env.local` ou `.env.test`

### Desenvolvimento Local
- Use `.env.local` para configs locais (setup manual)
- Use `.env.test` para testes (banco separado)
- Prisma Studio: http://localhost:5555 (abre automaticamente)
- Logs: Verifique o terminal para erros de sincronização

### Docker Development
- Dados persistem em volume `postgres_data`
- Para resetar: `docker-compose down -v`
- Para logs: `docker-compose logs -f`

### Produção
- Ensure DATABASE_URL está definida
- Execute `npm run build` antes de deploy
- Configure variáveis de ambiente no seu servidor
- Considere usar um serviço gerenciado (Railway, Render, Vercel)

---

## 🛠️ Scripts Úteis
```bash
# Desenvolvimento
npm run dev                 # Inicia Dev Server (com Prisma Studio)
npm run build              # Build para produção
npm start                  # Roda produção (requer npm run build)

# Testes
npm test                   # Unitários + Integração (Jest)
npm run test:e2e           # End-to-End (Playwright)
npm run test:with-server   # Testes com servidor rodando

# Database
npm run db:sync            # Gera Prisma Client + migra banco
npx prisma studio         # Abre GUI do banco (porta 5555)

# Scripts
npx ts-node scripts/addTestUser.ts
npx ts-node scripts/populateAnalysisHistory.ts
npx ts-node scripts/checkLastUserTokens.ts

# Docker
docker-compose up          # Roda tudo em containers
docker-compose down        # Para containers
docker-compose logs -f     # Visualiza logs em real-time
```

---

## 📚 Documentação Adicional
- [docs/architecture.md](docs/architecture.md) — Arquitetura detalhada
- [docs/todo.md](docs/todo.md) — Roadmap do projeto
- [prisma/schema.prisma](prisma/schema.prisma) — Schema completo
- [docker-compose.yml](docker-compose.yml) — Config Docker
- [Dockerfile](Dockerfile) — Build image

---

## 🤝 Suporte
- Leia [docs/architecture.md](docs/architecture.md) para detalhes técnicos
- Veja [prisma/schema.prisma](prisma/schema.prisma) para estrutura do banco
- Use Prisma Studio: http://localhost:5555 (quando rodando)
- Verifique este README frequentemente para atualizações

---

## 📄 Licença
MIT
