jest.mock('../../src/lib/prisma', () => ({
  analysisHistory: {
    create: jest.fn(),
    update: jest.fn(),
  },
}), { virtual: true });
import { createMocks } from 'node-mocks-http';
const handler = require('../../src/pages/api/analysis-async').default;
import * as tokenService from '@/services/tokenService';
jest.mock('@/lib/extractText', () => ({
  extractTextFromFile: jest.fn().mockResolvedValue('texto extraído')
}));
import * as resumeAnalyzer from '@/services/ai/resumeAnalyzer';
import jwt from 'jsonwebtoken';

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn().mockResolvedValue(Buffer.from('pdf-content')),
  },
}));
const fs = require('fs');

jest.mock('formidable', () => {
  return {
    IncomingForm: jest.fn().mockImplementation(() => ({
      parse: jest.fn(),
    })),
    default: {
      IncomingForm: jest.fn().mockImplementation(() => ({
        parse: jest.fn(),
      })),
    },
  };
});
const formidable = require('formidable');


const jwtSecret = process.env.JWT_SECRET || 'supersecret';
const userId = 'user-async';
const makeJwt = () => jwt.sign({ userId }, jwtSecret);

describe('/api/analysis-async', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar análise e retornar analysisId', async () => {
    // Mock tokenService
    jest.spyOn(tokenService, 'consumeToken').mockResolvedValue(true);
    // Mock formidable
    const parseMock = jest.fn((req, cb) => {
      cb(null, {}, { file: { filepath: '/tmp/file', mimetype: 'application/pdf', originalFilename: 'cv.pdf' } });
    });
    formidable.IncomingForm.mockImplementation(() => ({ parse: parseMock }));
    formidable.default.IncomingForm.mockImplementation(() => ({ parse: parseMock }));
    // extractText já mockado globalmente
    // Mock prisma
    const analysisId = 'analysis-123';
    const prisma = require('../../src/lib/prisma');
    prisma.analysisHistory.create.mockResolvedValue({ id: analysisId });
    prisma.analysisHistory.update.mockResolvedValue({});
    // Mock resumeAnalyzer
    jest.spyOn(resumeAnalyzer, 'analyzeResume').mockResolvedValue({ score: 90 });

    const { req, res } = createMocks({
      method: 'POST',
      headers: { cookie: `token=${makeJwt()}` },
    });
    // @ts-ignore
    await handler(req, res, prisma);
    // Aguarda o próximo tick para o setTimeout do background
    await new Promise(r => setTimeout(r, 0));
    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.analysisId).toBe(analysisId);
  });

  it('retorna erro se não autenticado', async () => {
    const { req, res } = createMocks({ method: 'POST', headers: { cookie: '' } });
    // @ts-ignore
    await handler(req, res);
    expect(res._getStatusCode()).toBe(401);
  });

  it('retorna erro se não houver arquivo', async () => {
    jest.spyOn(tokenService, 'consumeToken').mockResolvedValue(true);
    const parseMock = jest.fn((req, cb) => { cb(null, {}, {}); });
    formidable.IncomingForm.mockImplementation(() => ({ parse: parseMock }));
    formidable.default.IncomingForm.mockImplementation(() => ({ parse: parseMock }));
    const { req, res } = createMocks({ method: 'POST', headers: { cookie: `token=${makeJwt()}` } });
    // @ts-ignore
    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
    expect(res._getData()).toContain('Arquivo não enviado');
  });
});
