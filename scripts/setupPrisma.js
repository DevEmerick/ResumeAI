#!/usr/bin/env node

/**
 * Setup Prisma - Cross-platform script (Mac, Linux, Windows)
 * Detecta automaticamente SQLite (dev) ou PostgreSQL (Docker/Produção)
 */

const fs = require('fs');
const path = require('path');

const SCHEMA_FILE = path.join(__dirname, '../prisma/schema.prisma');

console.log('🔧 Configurando Prisma...');

// Detectar se DATABASE_URL é PostgreSQL
const dbUrl = process.env.DATABASE_URL || '';
const isPostgres = dbUrl.startsWith('postgresql://');

if (isPostgres) {
  console.log('🐘 Detectado PostgreSQL - mudando para provider postgresql');
  
  try {
    // Ler arquivo schema
    let schema = fs.readFileSync(SCHEMA_FILE, 'utf-8');
    
    // Se já tem postgresql, não faz nada
    if (schema.includes('provider = "postgresql"')) {
      console.log('ℹ️  Já configurado para PostgreSQL');
    } else {
      // Mudar para PostgreSQL
      schema = schema.replace(
        'provider = "sqlite"',
        'provider = "postgresql"'
      );
      fs.writeFileSync(SCHEMA_FILE, schema, 'utf-8');
      console.log('✅ Schema atualizado para PostgreSQL');
    }
  } catch (error) {
    console.error('❌ Erro ao configurar schema:', error.message);
    process.exit(1);
  }
} else {
  console.log('📁 SQLite padrão');
  
  try {
    // Assegurar que schema está com sqlite
    let schema = fs.readFileSync(SCHEMA_FILE, 'utf-8');
    
    if (schema.includes('provider = "sqlite"')) {
      console.log('ℹ️  Já configurado para SQLite');
    } else {
      // Mudar para SQLite
      schema = schema.replace(
        'provider = "postgresql"',
        'provider = "sqlite"'
      );
      fs.writeFileSync(SCHEMA_FILE, schema, 'utf-8');
      console.log('✅ Schema atualizado para SQLite');
    }
  } catch (error) {
    console.error('❌ Erro ao configurar schema:', error.message);
    process.exit(1);
  }
}

console.log('✅ Pronto!');
