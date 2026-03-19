import { NextApiRequest, NextApiResponse } from "next";
import { deleteUser } from "@/services/auth/deleteUser";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Método não permitido" });
  }
  await deleteUser(req, res);
}
