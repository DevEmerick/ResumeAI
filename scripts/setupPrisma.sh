#!/bin/bash

# Script para configurar Prisma baseado no banco disponível
# Se DATABASE_URL é PostgreSQL, muda schema para usar provider postgresql

SCHEMA_FILE="prisma/schema.prisma"

echo "🔧 Configurando Prisma..."

# Se DATABASE_URL começa com postgresql://, usar PostgreSQL
if [[ "$DATABASE_URL" == postgresql://* ]]; then
    echo "🐘 Detectado PostgreSQL - mudando para provider postgresql"
    # Backup
    cp "$SCHEMA_FILE" "$SCHEMA_FILE.bak"
    # Muda provider
    sed -i '' 's/provider = "sqlite"/provider = "postgresql"/' "$SCHEMA_FILE"
else
    echo "📁 SQLite padrão"
    # Se backup existe, restaura para SQLite
    if [ -f "$SCHEMA_FILE.bak" ]; then
        rm "$SCHEMA_FILE.bak"
    fi
fi

echo "✅ Pronto!"
