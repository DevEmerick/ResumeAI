import { prisma } from '@/lib/prisma';
import type { User } from '@prisma/client';

export async function createUser(data: { name: string; email: string; passwordHash: string }): Promise<User> {
  // Garante que tokens e créditos sejam inicializados corretamente
  return await prisma.user.create({
    data: {
      ...data,
      tokens: 1,
      resumeRewriteCredits: 0,
    },
  });
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return await prisma.user.findUnique({ where: { email } });
}

export async function getUserById(id: string): Promise<User | null> {
  return await prisma.user.findUnique({ where: { id } });
}

export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  return await prisma.user.update({ where: { id }, data });
}

export async function deleteUserById(id: string): Promise<User> {
  return await prisma.user.delete({ where: { id } });
}

export async function listUsers(): Promise<User[]> {
  return await prisma.user.findMany();
}
