import { NextApiRequest, NextApiResponse } from "next";
import { authenticate } from "./middleware";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  authenticate(req, res, () => {
    return res.status(200).json({ message: "Rota protegida acessada com sucesso." });
  });
}
