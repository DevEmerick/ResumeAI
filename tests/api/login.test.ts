// @jest-environment node
import { POST } from "@/app/api/auth/login/route";
import { createUser } from '@/services/auth/userCrud';
import bcrypt from 'bcryptjs';

function mockRequest(body: any) {
  return {
    json: async () => body
  } as Request;
}

describe('POST /api/auth/login', () => {
  let email = '';
  let password = '';

  beforeAll(async () => {
    email = `testuser_${Date.now()}@example.com`;
    password = 'TestPassword123!';
    const passwordHash = await bcrypt.hash(password, 12);
    await createUser({ name: 'TestUser', email, passwordHash });
  });

  it('deve retornar sucesso para login válido', async () => {
    const req = mockRequest({ email, password });
    const res = await POST(req);
    const data = JSON.parse(await res.text());
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('deve retornar erro para senha inválida', async () => {
    const req = mockRequest({ email, password: 'senhaerrada' });
    const res = await POST(req);
    const data = JSON.parse(await res.text());
    expect(res.status).toBe(401);
    expect(data.error).toBeDefined();
  });

  it('deve retornar erro para email inexistente', async () => {
    const req = mockRequest({ email: 'naoexiste@ai.com', password });
    const res = await POST(req);
    const data = JSON.parse(await res.text());
    expect(res.status).toBe(401);
    expect(data.error).toBeDefined();
  });
});
