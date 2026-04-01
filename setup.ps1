# Setup script para ResumeAI (Windows)
# Uso: powershell -ExecutionPolicy Bypass -File setup.ps1

Write-Host "🚀 Setup ResumeAI - Windows" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

# Verificar Node.js
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Host "❌ Node.js não encontrado." -ForegroundColor Red
    Write-Host "   Instale em: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Node.js: $($node.Version)" -ForegroundColor Green

# Verificar psql
$psql = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psql) {
    Write-Host "❌ PostgreSQL não encontrado." -ForegroundColor Red
    Write-Host "   Instale em: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    Write-Host "   OU use Docker Compose: docker-compose up" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ PostgreSQL encontrado" -ForegroundColor Green

# Criar banco de dados
Write-Host ""
Write-Host "📦 Criando banco de dados..." -ForegroundColor Cyan
& psql -h localhost -U postgres -c "CREATE DATABASE resumeai;" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "   (banco pode já existir, continuando...)" -ForegroundColor Yellow
}

# Instalar dependências Node
Write-Host ""
Write-Host "📦 Instalando dependências Node..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao instalar dependências" -ForegroundColor Red
    exit 1
}

# Configurar .env.local
Write-Host ""
Write-Host "🔐 Configurando variáveis de ambiente..." -ForegroundColor Cyan
if (!(Test-Path .env.local)) {
    Copy-Item .env.example .env.local
    Write-Host "✅ .env.local criado" -ForegroundColor Green
    Write-Host "   Edite .env.local se precisar ajustar DATABASE_URL" -ForegroundColor Yellow
} else {
    Write-Host "✅ .env.local já existe" -ForegroundColor Green
}

# Sincronizar banco
Write-Host ""
Write-Host "🔄 Sincronizando banco de dados..." -ForegroundColor Cyan
npm run db:sync
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao sincronizar banco" -ForegroundColor Red
    exit 1
}

# Opcional: Popular com dados de teste
Write-Host ""
$response = Read-Host "Deseja popular o banco com dados de teste? (s/n)"
if ($response -eq "s" -or $response -eq "S") {
    npx ts-node scripts/populateAnalysisHistory.ts
    npx ts-node scripts/addTestUser.ts
    Write-Host "✅ Dados de teste adicionados" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Setup concluído!" -ForegroundColor Green
Write-Host ""
Write-Host "Para rodar o projeto:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "Acesse: http://localhost:3000" -ForegroundColor Cyan
