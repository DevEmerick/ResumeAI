import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const dbUrl = process.env.DATABASE_URL || '';
const isPostgres = dbUrl.startsWith('postgresql://');

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient(
    isPostgres
      ? {
          adapter: new PrismaPg({ connectionString: dbUrl }),
        }
      : undefined
  );

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
