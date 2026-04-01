# ResumeAI — Análise de Currículos com IA

> SaaS moderno para análise e reescrita de currículos usando IA generativa (OpenAI/Ollama), Next.js 16, Prisma 7 e PostgreSQL.

---

## 🚀 Quickstart (5 minutos)

### 1. Pré-requisitos
- **Node.js 18+** e npm
- **PostgreSQL** rodando localmente

### 2. Clone e instale dependências
```bash
git clone <url-do-repo>
cd resume-analyser
npm install
```

### 3. Configure o banco de dados
```bash
# Crie o banco local
psql -h localhost -U $(whoami) -c "CREATE DATABASE resumeai;"

# Configure variáveis de ambiente
cp .env.example .env.local
```

Edite `.env.local` e ajuste:
```bash
DATABASE_URL="postgresql://<seu_usuario>@localhost:5432/resumeai"
JWT_SECRET="sua_chave_secreta_aqui"
```

### 4. Rode o projeto
```bash
npm run dev
```

Pronto! O servidor inicia em [http://localhost:3000](http://localhost:3000)

**Nota:** `npm run dev` automaticamente:
- ✅ Gera Prisma Client
- ✅ Sincroniza banco de dados
- ✅ Inicia Next.js Dev Server
- ✅ Abre Prisma Studio (gerenciador visual do banco)
- ✅ Inicia Ollama (LLM local para IA)

---

## 📦 Tecnologias
- **Frontend:** Next.js 16, React 19, TailwindCSS
- **Backend:** Node.js com TypeScript
- **Database:** PostgreSQL + Prisma 7
- **IA:** OpenAI API ou Ollama (local)
- **PDF:** pdf-parse, Tesseract.js, Mammoth
- **Testes:** Jest (unit/integration), Playwright (E2E)

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

## 🔬 Testes Automatizados
O projeto tem 90%+ de cobertura com Jest.

```bash
npm test
```

- ✅ Autenticação (login, registro)
- ✅ Upload e análise de PDF
- ✅ Sistema de tokens (FREE/PRO/TEAM)
- ✅ CRUD de curriculum e histórico
- ✅ Integração com AI (OpenAI/Ollama)

---

## 🚀 Fluxo Principal da Aplicação
1. **Usuário faz login** → JWT token gerado
2. **Faz upload de PDF** → Texto extraído com pdf-parse/Tesseract
3. **Sistema analisa** → OpenAI/Ollama gera feedback
4. **Resultado exibido** → Sugestões de melhoria
5. **Histórico salvo** → AnalysisHistory no banco

---

## 📚 Documentação Adicional
- [docs/architecture.md](docs/architecture.md) — Arquitetura detalhada
- [docs/todo.md](docs/todo.md) — Roadmap do projeto
- [prisma/schema.prisma](prisma/schema.prisma) — Schema completo
- [package.json](package.json) — Dependências e scripts

---

## 💡 Dicas Importantes

### Prisma 7 - Configuração Especial
- ⚠️ **NÃO adicione `url` ao schema.prisma** — A URL é lida de `prisma.config.ts`
- ✅ Use `@env("DATABASE_URL")` quando necessário no schema

### Desenvolvimento
- Use `.env.local` para configs locais
- Use `.env.test` para testes (banco separado)
- Prisma Studio (aberto automaticamente em `npm run dev`): http://localhost:5555

### Produção
- Ensure DATABASE_URL está definida
- Execute `npm run build` antes de fazer deploy
- Configure variáveis de ambiente no seu servidor

---

## 🤝 Troubleshooting

**Erro: "Cannot find module './Function.js"**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Erro: "Database resumeai does not exist"**
```bash
psql -h localhost -U $(whoami) -c "CREATE DATABASE resumeai;"
npx prisma db push
```

**Ollama não inicia**
- Se não tem Ollama instalado, edite `package.json` e remova `ollama serve` do script `dev`
- Ou instale: `brew install ollama` (Mac)

---

## 📞 Suporte
- Leia [docs/architecture.md](docs/architecture.md) para detalhes técnicos
- Veja [prisma/schema.prisma](prisma/schema.prisma) para estrutura do banco
- Execute `npm run dev` e use Prisma Studio em http://localhost:5555

---

## 📄 Licença
MIT
