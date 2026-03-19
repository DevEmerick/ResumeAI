import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export function authenticate(req: NextApiRequest, res: NextApiResponse, next: () => void) {
  const token = req.cookies.token || req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "Não autenticado" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}
