import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Router, Request, Response } from "express";
import Stripe from "stripe";
import { CourseModel } from "../../dataBase/mongoDb";

const route = Router();

route.post("/createCourse", async (req: Request, res: Response) => {
 const { title, price } = req.body;
 try {
  await CourseModel.create({ title, price });
  return res.status(200).send("Criado com sucesso");
 } catch {
  return res.status(400).send("Error");
 }
});
route.post("/changeCourse", async (req: Request, res: Response) => {
 const { title, price, description, imgUrl } = req.body;
 try {
  const course: any = await CourseModel.findById(req.params.courseId);
  course.title = title ? title : course.title;
  course.description = description ? description : course.description;
  course.price = price ? price : course.price;
  course.imgUrl = imgUrl ? imgUrl : course.imgUrl;

  await course.save();
  return res.status(200).send("Alterado com sucesso");
 } catch {
  return res.status(400).send("Error");
 }
});
route.delete("/deleteCourse/:courseId", async (req: Request, res: Response) => {
 const S3 = new S3Client({ region: process.env.AWS_DEFAULT_REGION });
 try {
  const course: any = await CourseModel.findById(req.params.courseId);

  course?.modules.forEach(async (element: any) => {
   element.classes.forEach(async (item: any) => {
    //   DELETANDO PDF SE TIVER
    if (element.pdf) {
     const arrString = element.pdf.split("/");
     const key = arrString[arrString.length - 1];
     await S3.send(
      new DeleteObjectCommand({ Bucket: process.env.AWS_S3_BUCKET, Key: key })
     );
    }
   });
  });

  await course?.delete();

  return res.status(200).send("Módulos, PDF e aulas deletas");
 } catch (e) {
  console.log(e);
  return res.status(400).send("Não foi possivel retornar o módulo");
 }
});

export default route;
