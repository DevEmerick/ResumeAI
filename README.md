# ResumeAI — Análise de Currículos com IA

> SaaS moderno para análise e reescrita de currículos usando IA generativa (OpenAI/Ollama), Next.js 16, Prisma 6 e SQLite/PostgreSQL.

---

## 🚀 Quickstart Passo a Passo (Prova de Bobos!)

Siga exatamente OS PASSOS ABAIXO. Não pule nada! 🔥

---

### ✨ Opção 1: Local (Mac + Windows) - Recomendado para Dev

#### 📋 PASSO 1: Instalar Node.js (Gerenciador de Pacotes)

**Se você é no WINDOWS:**
1. Abra qualquer navegador (Chrome, Edge, Firefox)
2. Acesse: https://nodejs.org/
3. Clique no botão verde escrito **"LTS"** (versão mais estável)
4. Depois que terminar de baixar, abra o arquivo e clique **"Next"** em todas as telas
5. Clique **"Install"** quando pedir permissão
6. Quando terminar, vire uma mensagem "Installation Successful" - clique **"Finish"**
7. **Reinicie o computador**

**Se você é no MAC:**
1. Abra o terminal (Command + Spacebar, digite "terminal", Enter)
2. Cole esse comando e aperte Enter:
```bash
brew install node
```
3. Se não tiver "brew" instalado, primeiro instale digitando:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
4. Depois digite novamente: `brew install node`

**Verificar se funcionou:**

Feche o terminal/PowerShell e abra um novo. Digite:
```bash
node --version
```

Se aparecer algo como `v20.11.0`, está pronto! ✅

---

#### 🤖 PASSO 2: Instalar Ollama (IA Local para Análise de Currículo)

**Se você é no WINDOWS:**
1. Abra um navegador
2. Acesse: https://ollama.ai
3. Clique em **"Download"** 
4. Selecione **"Ollama for Windows"**
5. Quando terminar de baixar, abra o arquivo e clique **"Install"**
6. Espere terminar a instalação
7. **Reinicie o computador**

**Se você é no MAC:**
1. Abra o terminal (Command + Spacebar, digite "terminal", Enter)
2. Digite esse comando:
```bash
brew install ollama
```
3. Deixa instalar

**Verificar se funcionou:**

Abra um terminal novo e digite:
```bash
ollama --version
```

Se aparecer algo como `ollama version 0.1.x`, está pronto! ✅

---

#### 📥 PASSO 3: Clonar o Projeto (Baixar os Arquivos)

**Tanto no WINDOWS quanto no MAC:**

Abra um terminal/PowerShell e execute:

```bash
git clone https://github.com/[seu-usuario]/resume-analyser.git
cd resume-analyser
```

> 💡 **Se aparecer erro "git not found":** 
> - Windows: Instale Git de https://git-scm.com/ (clique "Next" em tudo)
> - Mac: Já vem instalado, tente novamente

Agora você está dentro da pasta do projeto! ✅

---

#### 📦 PASSO 4: Instalar Dependências do Projeto

Ainda no terminal, na mesma pasta, digite:

```bash
npm install
```

Isso vai baixar todas as bibliotecas que o projeto precisa. Pode levar 2-5 minutos. Aguarde até ver "added XXX packages". ✅

---

#### 🧠 PASSO 5: Puxar o Modelo de IA (llama3)

Abra **UM TERMINAL NOVO** e execute:

```bash
ollama pull llama3
```

Isso vai baixar o modelo de IA (1.3GB). Vai levar alguns minutos. Deixa rodar! ⏳

**Quando terminar**, deixe esse terminal aberto com:

```bash
ollama serve
```

> Este terminal precisa estar rodando enquanto você usa o app! Não feche! 🔴

---

#### 🚀 PASSO 6: Iniciar o Aplicativo

Abra **OUTRO TERMINAL NOVO** (não o do Ollama!) e execute:

```bash
npm run dev
```

Aguarde aparecer:
```
✓ Ready in 2.8s
➜ Local: http://localhost:3000
```

Quando ver isso, significa que está funcionando! ✅

---

#### 🎉 PRONTO! ACESSE O APP

Abra seu navegador e acesse:

**http://localhost:3000**

Você deve ver a página inicial do ResumeAI!

---

### 📝 Resumo dos 3 Terminais que Precisam Estar Abertos:

| Terminal 1 | Terminal 2 | Terminal 3 |
|-----------|-----------|-----------|
| `ollama serve` | `npm run dev` | (Deixe disponível) |
| Modelo de IA rodando | App web rodando | Para testes/debug |
| Não feche! 🔴 | Não feche! 🔴 | Pode usar |

---

### 🐳 Opção 2: Docker Compose (Tudo Containerizado - Mais Fácil no Windows)

Se quer evitar instalar Node.js, Ollama e Git na mão, use Docker!

#### 📋 PASSO 1: Instalar Docker Desktop

**Se você é no WINDOWS:**
1. Abra um navegador
2. Acesse: https://www.docker.com/products/docker-desktop
3. Clique **"Download for Windows"**
4. Quando terminar, abra o arquivo e clique **"Install"**
5. Deixa instalar (pode pedir permissão do Windows, clique "Sim")
6. **Reinicie o computador**

**Se você é no MAC:**
1. Abra um navegador  
2. Acesse: https://www.docker.com/products/docker-desktop
3. Clique **"Download for Mac"** (escolha a versão certa: Intel ou Apple Silicon)
4. Quando terminar, abra o arquivo e arraste o **Docker.app** para a pasta **Applications**
5. Pronto!

**Verificar se funciona:**

Abra um terminal/PowerShell e execute:

```bash
docker --version
```

Se aparecer algo como `Docker version 25.0.0`, está pronto! ✅

---

#### 📥 PASSO 2: Clonar o Projeto

```bash
git clone https://github.com/[seu-usuario]/resume-analyser.git
cd resume-analyser
```

---

#### 🚀 PASSO 3: Iniciar Tudo com Docker

```bash
docker-compose up
```

Aguarde até ver:
```
✓ Ready in 2.8s
➜ Local: http://localhost:3000
```

Quando aparecer, o app está pronto!

---

#### 🎉 PRONTO! ACESSE O APP

Abra seu navegador:

**http://localhost:3000**

Tudo já está rodando dentro do Docker! ✅

Para parar: Pressione `CTRL+C` no terminal.

**Pronto!** Acesse [http://localhost:3000](http://localhost:3000)

O que rodará automaticamente (em containers):
- ✅ PostgreSQL
- ✅ Ollama + Modelo llama3:latest
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
ollama pull llama3
```

**Verificar se Ollama está rodando:**
```bash
curl http://localhost:11434/api/tags
```

---

### ❌ "Cannot find Ollama" (Setup Local)
- Instale com um dos comandos acima
- Execute em um terminal separado: `ollama serve`
- Em outro terminal: `ollama pull llama3`
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

## ⬇️ Downgrade Prisma 7 → Prisma 6 (Passo a Passo)

### ❓ Quando fazer isso?

Você PRECISA fazer esse passo **SOMENTE SE:**
- ✗ O projeto está com Prisma 7 instalado
- ✗ E você quer mudar para Prisma 6 (mais simples e estável)

Se você **clonou o repositório agora** e fez `npm install`, **NÃO PRECISA FAZER NADA!** O Prisma 6 já está configurado. Pule para a próxima seção. ✅

---

### Se você TEM Prisma 7 no seu projeto local:

#### PASSO 1: Abra o Terminal/PowerShell

**Windows:**
- Clique no ícone do Windows
- Digite: `powershell`
- Clique em "Windows PowerShell"

**Mac:**
- Clique em Cmd + Spacebar
- Digite: `terminal`
- Pressione Enter

#### PASSO 2: Navegue até a Pasta do Projeto

No terminal, digite:

```bash
cd /caminho/para/resume-analyser
```

> 💡 Se não sabe o caminho, no Mac use `pwd` no terminal já aberto na pasta
> No Windows, você pode copiar o caminho direto do Explorer

#### PASSO 3: Remova o Prisma 7 Antigo

```bash
npm uninstall @prisma/client prisma
```

Aguarde aparecer "removed X packages". ✅

#### PASSO 4: Instale o Prisma 6 com os Adapters Corretos

```bash
npm install -D prisma@6.19.3 @prisma/adapter-sqlite @prisma/adapter-pg
```

Aguarde terminar. Você verá "added X packages". ✅

#### PASSO 5: Sincronize o Banco de Dados

```bash
npm run db:sync
```

Você vai ver mensagens sobre Prisma sendo inicializado. Deixa rodar até terminar. ✅

#### PASSO 6: Teste se Funciona

```bash
npm run dev
```

Se ver:
```
✓ Ready in 2.8s
➜ Local: http://localhost:3000
```

**PARABÉNS!** Prisma 6 está funcionando! ✅

---

### ✅ Por que Prisma 6?

| Feature | Prisma 6 | Prisma 7 |
|---------|----------|----------|
| **SQLite** | ✅ Nativa, funciona direto | ❌ Precisa de adapter |
| **PostgreSQL** | ✅ Funciona direto | ✅ Funciona direto |
| **Mac/Windows** | ✅ Compatível 100% | ⚠️ Requer Docker Windows |
| **Simplicidade** | ✅ Schema simples | ❌ Config complexa |
| **Estabilidade** | ✅ Testado | ⚠️ Novo e com bugs |

---

## 📊 Populando Dados de Teste (Passo a Passo)

### ❓ O que é isso?

Esses scripts servem para **pré-popular o banco de dados** com usuários e histórico fictícios, para você testar o app sem criar dados manualmente. É opcional!

---

### 📝 OPÇÃO A: Criar UM Usuário de Teste Rápido

#### PASSO 1: Abra um Terminal/PowerShell

**Windows:**
- Clique com botão direito na pasta do projeto
- Selecione "Open PowerShell here"

**Mac:**
- Abra o terminal (Cmd + Spacebar, digite "terminal")
- Navegue até a pasta: `cd /caminho/para/resume-analyser`

#### PASSO 2: Execute o Script

```bash
npm run ts-node -- scripts/addTestUser.ts
```

Aguarde a mensagem:

```
Usuário inserido: { email: 'testuser@ai.com', password: 'TestPassword123!' }
```

✅ Pronto! O usuário foi inserido no banco.

#### PASSO 3: Use as Credenciais para Fazer Login

Abra http://localhost:3000 e faça login com:
- **Email:** testuser@ai.com
- **Senha:** TestPassword123!

Agora você está logado e pode testar as análises! ✅

---

### 📊 OPÇÃO B: Popular Com MUITOS Usuários de Teste (Dashboard Cheio)

Se quer testar o dashboard com muitos usuários e histórico, execute:

#### PASSO 1: Mesmo Terminal

```bash
npm run ts-node -- scripts/populateAnalysisHistory.ts
```

Aguarde a mensagem:

```
✅ X usuários criados
✅ X análises populadas
```

#### PASSO 2: Veja o Resultado

Abra http://localhost:3000/dashboard - você vai ver muitos usuários com histórico de análises! 📊

---

### ⚙️ Script: Verificar Tokens do Usuário

Se quer ver quantos tokens cada usuário tem (usado para limitar análises):

```bash
npm run ts-node -- scripts/checkLastUserTokens.ts
```

Você vai ver:
```
ID: abc123
Email: testuser@ai.com
Tokens: 10
Créditos de Reescrita: 5
Última Recarga: 2026-04-01
```

---

### 💡 Dica Importante

> Esses scripts funcionam **melhor com PostgreSQL (Docker)**. 
> 
> Se está usando **SQLite local**, execute só o script de usuário de teste (`addTestUser.ts`).
> 
> Para testar análises, faça de forma manual no app.

## 📦 Tecnologias
- **Frontend:** Next.js 16, React 19, TailwindCSS
- **Backend:** Node.js com TypeScript
- **Database:** SQLite (dev local) + PostgreSQL (Docker/Prod) com Prisma 6
- **IA:** OpenAI API ou Ollama (local, modelo llama3:latest)
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
  ├── schema.prisma     # Schema do banco (Prisma 6)
  └── migrations/       # Histórico de migrações
scripts/               # Utilitários (usuário de teste, populate, etc)
docs/                  # Documentação técnica
```

---

## 🗄️ Modelo de Dados (Prisma 6)
```prisma
model User {
  id                    String
  email                 String (único)
  passwordHash          String
  name                  String?
  subscriptionType      FREE | PRO | TEAM
  tokens                Int
  resumeRewriteCredits  Int
  lastTokenRefill       DateTime
  createdAt             DateTime
  updatedAt             DateTime
}

model Resume {
  id       String
  fileName String
  content  String (texto extraído)
  analysis String? (resultado da IA)
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

### Prisma 6 - Suporte Nativo a SQLite e PostgreSQL
- ✅ **SQLite local** (dev) — Arquivo: `prisma/dev.db`
- ✅ **PostgreSQL** (Docker/Prod) — Via postgres://
- ✅ Migrações automáticas funcionam para ambos
- ✉️ DATABASE_URL é lida de `.env.local` ou `.env.test`

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
