import { prisma } from '@/lib/prisma';

type CreateResumeInput = {
  fileName: string;
  content: string;
  analysis?: string;
  userId: string;
};

export async function createResume(data: CreateResumeInput) {
  // Sanitização básica dos campos
  const sanitizedData = {
    ...data,
    fileName: data.fileName.replace(/[<>]/g, ""),
    content: data.content.replace(/[<>]/g, ""),
    analysis: data.analysis ? data.analysis.replace(/[<>]/g, "") : undefined,
  };
  return prisma.resume.create({
    data: sanitizedData,
  });
}