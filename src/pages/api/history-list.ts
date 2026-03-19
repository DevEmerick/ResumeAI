import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

function getTokenFromCookie(cookie: string) {
  const match = cookie.match(/token=([^;]+)/);
  return match ? match[1] : null;
}

async function requireAuth(req: NextApiRequest, res: NextApiResponse) {
  const cookie = req.headers.cookie || '';
  const token = getTokenFromCookie(cookie);
  if (!token) {
    res.status(401).json({ error: 'Usuário não autenticado.' });
    return null;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch {
    res.status(401).json({ error: 'Token inválido ou expirado.' });
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Método não permitido' });
    return;
  }
  const userId = await requireAuth(req, res);
  if (!userId) return;

  try {
    const history = await prisma.analysisHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    res.status(200).json({ history });
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'Erro ao buscar histórico.' });
  }
}
