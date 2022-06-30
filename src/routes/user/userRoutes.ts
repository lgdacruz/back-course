import { Router, Request, Response } from "express";
import axios from "axios";
import xml2json from "xml2json";

import { CourseModel, UserModel } from "../../dataBase/mongoDb";
import { client } from "../../services/googleOauth";
import { PaymentInterface } from "../../types";

const route = Router();

route.get("/isauth", async (req: Request, res: Response) => {
 return res.status(200).send("Is Auth");
});

route.post("/logout", (req: Request, res: Response) => {
 const access_token = req.headers.authorization;
 const { refresh_token } = req.body;

 client.revokeToken(access_token as string);
 client.revokeToken(refresh_token as string);

 return res.status(200).send("Token revogado com sucesso!");
});

route.get("/getuser", async (req: Request | any, res: Response) => {
 const email = req.email;
 try {
  const user = await UserModel.findOne({ email });

  return res.status(200).send(user);
 } catch (e) {
  return res.status(400).send("Não foi possivel retornar o usuario");
 }
});

route.delete("/deleteuser", async (req: Request | any, res: Response) => {
 const email = req.email;
 try {
  await UserModel.findOneAndDelete(email);
  return res.status(200).send("usuário deletado com sucesso");
 } catch (e) {
  return res.status(400).send("Não foi possivel retornar o módulo");
 }
});

route.post(
 "/checkoutEnd/:productId",
 async (req: Request | any, res: Response) => {
  try {
   const User = await UserModel.findOne({ email: req.email });
   const Product = await CourseModel.findById(req.params._id);

   const optionsCode = {
    method: "POST",
    url: `${process.env.PAGSEGURO_AMBIENT}/checkout?email=${process.env.PAGSEGURO_LOGIN}&token=${process.env.PAGSEGURO_TOKEN}`,
    headers: { Accept: "application/xml", "Content-Type": "application/json" },
    data: {
     currency: "BRL",
     "item: id": req.params.productId,
     "item: description": Product?.description,
     "item: amount": Product?.price,
     "item: quantity": "1",
     "item: weight": "0",
     "shipping: addressRequired": "False",
     "sender: name": User?.name,
     "sender: email": User?.email,
     redirectURL: `${process.env.REDIRECT_URI}/myCourses`,

     // reference?: string
     // notificationURL?: string
    },
   };
   const response: any = await axios.request(optionsCode);
   const checkoutCode = response?.checkout?.code;

   const optionsUrl = {
    method: "GET",
    url: `${process.env.PAGSEGURO_AMBIENT}/checkout/payment.html?code=${checkoutCode}`,
    headers: { Accept: "application/json" },
   };
   const Url = await axios.request(optionsUrl);

   return res.status(200).send(Url.data);
  } catch {
   return res.status(400).send("Error");
  }
 }
);

export default route;
