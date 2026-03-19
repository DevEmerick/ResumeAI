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
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método não permitido' });
    return;
  }
  const userId = await requireAuth(req, res);
  if (!userId) return;

  const { fileName, content, analysis } = req.body;
  if (!fileName || !content || !analysis) {
    res.status(400).json({ error: 'Dados incompletos.' });
    return;
  }
  try {
    const record = await prisma.analysisHistory.create({
      data: {
        userId,
        fileName: fileName.replace(/[<>]/g, ''),
        content: content.replace(/[<>]/g, ''),
        analysis: analysis.replace(/[<>]/g, ''),
      },
    });
    res.status(201).json({ success: true, record });
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'Erro ao salvar histórico.' });
  }
}
