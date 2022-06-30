import { Router, Request, Response } from "express";
import Stripe from "stripe";
import axios from "axios";

import { client } from "../../services/googleOauth";
import { UserModel } from "../../dataBase/mongoDb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
 apiVersion: "2020-08-27",
});
const route = Router();

route.post("/login", async (req: Request, res: Response) => {
 const { code } = req.body;
 try {
  const { tokens } = await client.getToken(code);

  const response = await axios.get(
   `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokens.access_token}`
  );

  if (response.status === 200) {
   // VERIFICA SE JÁ EXISTE NO BANCO
   const user = await UserModel.findOne({ email: response?.data?.email });
   if (user) {
    return res.status(200).send({
     user,
     access_token: tokens.access_token,
     refresh_token: tokens.refresh_token,
    });
   }

   //    CRIA USUÁRIO NA STRIPE
   const customer = await stripe.customers.create({
    email: response?.data?.email,
    name: response?.data?.given_name,
   });

   //    CRIA SE NÃO EXISTE NO BANCO
   const newUser = await UserModel.create({
    stripId: customer.id,
    name: response?.data?.given_name,
    secondName: response?.data?.family_name,
    email: response?.data?.email,
    photo: response?.data?.picture,
   });

   return res.status(200).send({
    user: newUser,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
   });
  }

  return res.status(400).send("Não foi possível efetuar o login");
 } catch (e) {
  return res.status(400).send("Não foi possível efetuar o login");
 }
});

route.post("/refresh", async (req: Request, res: Response) => {
 const { refresh_token } = req.body;
 try {
  client.setCredentials({ refresh_token });
  client.refreshAccessToken((e, token) => {
   if (e) {
    return res.status(400).send("Refresh Token inválido");
   }
   return res.status(200).send(token?.access_token);
  });
 } catch (e) {
  return res.status(400).send("Refresh token");
 }
});

export default route;
