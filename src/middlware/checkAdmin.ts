import axios from "axios";
import { Request, Response } from "express";
import { UserModel } from "../dataBase/mongoDb";

import { client } from "../services/googleOauth";

export const CheckAdmin = async (
 req: Request | any,
 res: Response,
 next: any
) => {
 const access_token = req.headers.authorization;

 if (!access_token) return res.status(400).send("Sessão não autenticada - 1");

 try {
  const tokenInfo = await client.getTokenInfo(access_token as string);

  if (!tokenInfo) {
   return res.status(401).send("Sessão expirada - 1");
  }

  if (new Date(tokenInfo.expiry_date) < new Date()) {
   return res.status(401).send("Sessão expirada - 2");
  }

  const responseUser = await axios.get(
   `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
  );
  const user = await UserModel.findOne({ email: responseUser.data.email });

  if (user?.userType !== "Adm") {
   return res.status(400).send("Not Adm");
  }
  next();
 } catch (e) {
  return res.status(400).send("Algo deu errado");
 }
};
