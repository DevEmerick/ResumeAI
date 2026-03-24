import { NextRequest } from "next/server";
import type { NextApiRequest } from "next";

/**
 * Verifica se a requisição originou-se do mesmo domínio (Same-Origin).
 * Previne ataques CSRF validando os cabeçalhos HTTP (Origin).
 */
export function verifyCSRF(req: Request | NextRequest | NextApiRequest): boolean {
  let origin = "";
  let host = "";

  // Diferencia App Router (Request) de Pages Router (NextApiRequest)
  if ("headers" in req && typeof (req as any).headers.get === "function") {
    const webReq = req as Request;
    origin = webReq.headers.get("origin") || "";
    host = webReq.headers.get("host") || "";
  } else {
    const apiReq = req as NextApiRequest;
    origin = (apiReq.headers.origin as string) || "";
    host = (apiReq.headers.host as string) || "";
  }

  // Valida a Origem contra o Host
  if (origin) {
    try { return new URL(origin).host === host; } catch { return false; }
  }

  // Permite passar se não houver origin, ou você pode retornar false para ser extremamente estrito
  return true;
}