#!/bin/bash

# Setup script para ResumeAI (Mac/Linux)
# Uso: bash setup.sh

set -e

echo "🚀 Setup ResumeAI - Mac/Linux"
echo "=============================="

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale em: https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js: $(node --version)"

# Verificar PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL não encontrado."
    echo "   Mac: brew install postgresql"
    echo "   Ubuntu: sudo apt-get install postgresql"
    exit 1
fi
echo "✅ PostgreSQL: $(psql --version)"

# Criar banco de dados
echo ""
echo "📦 Criando banco de dados..."
psql -h localhost -U $(whoami) -c "CREATE DATABASE resumeai;" 2>/dev/null || echo "   (banco pode já existir, continuando...)"

# Instalar dependências Node
echo ""
echo "📦 Instalando dependências Node..."
npm install

# Configurar .env.local
echo ""
echo "🔐 Configurando variáveis de ambiente..."
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    # Substituir placeholder de usuário
    sed -i '' "s/<seu_usuario>/$(whoami)/g" .env.local
    echo "✅ .env.local criado"
else
    echo "✅ .env.local já existe"
fi

# Sincronizar banco
echo ""
echo "🔄 Sincronizando banco de dados..."
npm run db:sync

# Opcional: Popular com dados de teste
read -p "Deseja popular o banco com dados de teste? (s/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    npx ts-node scripts/populateAnalysisHistory.ts
    npx ts-node scripts/addTestUser.ts
    echo "✅ Dados de teste adicionados"
fi

echo ""
echo "✅ Setup concluído!"
echo ""
echo "Para rodar o projeto:"
echo "  npm run dev"
echo ""
echo "Acesse: http://localhost:3000"
