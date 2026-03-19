import { createUser } from '@/services/auth/userCrud';
import bcrypt from 'bcryptjs';

describe('Automated User Registration', () => {
  it('should create a test user and output credentials', async () => {
    const email = `testuser_${Date.now()}@example.com`;
    const password = 'TestPassword123!';
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await createUser({ email, passwordHash });
    console.log('Usuário criado:', { email, password });
    expect(user.email).toBe(email);
  });
});
