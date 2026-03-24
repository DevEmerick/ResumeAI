const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

/**
 * Utilitário simples de Rate Limiting em memória.
 * @param ip Endereço IP do cliente.
 * @param limit Número máximo de requisições permitidas.
 * @param windowMs Janela de tempo em milissegundos.
 */
export function rateLimit(ip: string, limit: number = 5, windowMs: number = 60000) {
  const now = Date.now();
  const windowStart = now - windowMs;

  const record = rateLimitMap.get(ip) || { count: 0, lastReset: now };

  if (record.lastReset < windowStart) {
    record.count = 1;
    record.lastReset = now;
  } else {
    record.count += 1;
  }

  rateLimitMap.set(ip, record);

  return { success: record.count <= limit };
}