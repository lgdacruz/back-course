import axios from "axios";
import { Router, Request, Response } from "express";
import Stripe from "stripe";
import { CourseModel } from "../../dataBase/mongoDb";
import xml2json from "xml2json";

const Axios = axios.create({ baseURL: process.env.PAGSEGURO_AMBIENT });
const route = Router();

route.get("/allCourses", async (req: Request, res: Response) => {
 try {
  const courses = await CourseModel.find({}, [
   "_id",
   "title",
   "description",
   "price",
   "imgUrl",
  ]);

  return res.status(200).send(courses);
 } catch (e) {
  console.log(e);
  return res.status(400).send("Não foi possível carregar os cursos");
 }
});

route.get("/course/:courseId", async (req: Request, res: Response) => {
 try {
  const course: any = await CourseModel.findById(req.params.courseId, [
   "-modules.classes.video",
   "-modules.classes.pdf",
  ]);

  // MODULOS CRESCENTE
  course.modules.sort((a: any, b: any) => {
   return a.title < b.title ? -1 : a.title > b.title ? 1 : 0;
  });

  const Data = course.modules.map((item: any) => {
   return {
    title: item.title,
    class: item.classes
     .sort((a: any, b: any) => {
      return a.classTitle < b.classTitle
       ? -1
       : a.classTitle > b.classTitle
       ? 1
       : 0;
     })
     .map((value: any) => value.title),
   };
  });

  return res.status(200).send(course);
 } catch (e) {
  return res.status(400).send("Não foi possível carregar o curso");
 }
});

route.get("/titles/:courseId", async (req: Request, res: Response) => {
 try {
  const course: any = await CourseModel.findById(req.params.courseId);

  // MODULOS CRESCENTE
  course.modules.sort((a: any, b: any) => {
   return a.title < b.title ? -1 : a.title > b.title ? 1 : 0;
  });

  const Data = course.modules.map((item: any) => {
   return {
    title: item.title,
    class: item.classes
     .sort((a: any, b: any) => {
      return a.classTitle < b.classTitle
       ? -1
       : a.classTitle > b.classTitle
       ? 1
       : 0;
     })
     .map((value: any) => value.title),
   };
  });
  return res.status(200).send(Data);
 } catch (e) {
  return res.status(400).send("Não foi possível carregar o curso");
 }
});

route.get("/checkoutPag", async (req: Request, res: Response) => {
 try {
  const checkoutXml = await Axios.post(
   `/sessions?email=${process.env.PAGSEGURO_LOGIN}&token=${process.env.PAGSEGURO_TOKEN}`
  );
  const jsonCheckout = JSON.parse(xml2json.toJson(checkoutXml.data));

  return res.status(200).send(jsonCheckout.session.id);
 } catch {
  return res.status(400).send("Error");
 }
});

export default route;
