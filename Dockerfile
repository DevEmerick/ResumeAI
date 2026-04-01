# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependência
COPY package*.json ./
COPY tsconfig.json ./
COPY next.config.ts ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Instalar dependências
RUN npm ci

# Copy source code
COPY src ./src
COPY public ./public

# Build da aplicação Next.js
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Instalar apenas dependências de produção
COPY package*.json ./

RUN npm ci --only=production

# Copiar prisma files
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Copiar build da stage anterior
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./

# Expor portas
EXPOSE 3000 5555

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

# Comando padrão (será sobrescrito pelo docker-compose em dev)
CMD ["npm", "start"]
