
import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/tokens';
import * as tokenService from '@/services/tokenService';
import jwt from 'jsonwebtoken';

describe('/api/tokens', () => {

  const jwtSecret = process.env.JWT_SECRET || 'secret';
  const userId = 'user-123';
  const makeJwt = () => jwt.sign({ userId }, jwtSecret);

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('incrementa tokens do usuário e retorna novo saldo', async () => {
    const mockUpdate = jest.spyOn(tokenService, 'refillTokens').mockResolvedValue({ tokens: 42 });
    const { req, res } = createMocks({
      method: 'POST',
      body: { amount: 10 },
      headers: { cookie: `token=${makeJwt()}` },
    });
    await handler(req, res);
    expect(mockUpdate).toHaveBeenCalledWith(userId, 10);
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ tokens: 42 });
  });


  it('retorna erro se amount for inválido', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { amount: -5 },
      headers: { cookie: `token=${makeJwt()}` },
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
  });

  it('retorna erro se não autenticado', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { amount: 10 },
      headers: { cookie: '' },
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(401);
  });
});
