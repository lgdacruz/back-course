import { Router, Request, Response } from "express";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { CourseModel } from "../../dataBase/mongoDb";

const route = Router();

//module
route.post("/createModule/:courseId", async (req: Request, res: Response) => {
 const { title } = req.body;
 try {
  const course: any = await CourseModel.findById(req.params.courseId);
  course?.modules?.push({ title });
  await course?.save();

  return res.status(200).send("Módulo criado com sucesso");
 } catch (e) {
  console.log(e);
  return res.status(400).send("Não foi possivel criar o módulo");
 }
});
route.put(
 "/changemodule/:courseId/:moduleId",
 async (req: Request, res: Response) => {
  const { newTitle } = req.body;
  try {
   const course: any = await CourseModel.findById(req.params.courseId);
   const module = course?.modules.id(req.params.moduleId);
   module.title = newTitle;

   await course.save();
   return res.status(200).send("Nome do módulo alterado com sucesso");
  } catch (e) {
   console.log(e);
   return res.status(400).send("Não foi possivel retornar o módulo");
  }
 }
);
route.delete(
 "/deletemodule/:courseId/:moduleId",
 async (req: Request, res: Response) => {
  const S3 = new S3Client({ region: process.env.AWS_DEFAULT_REGION });
  try {
   const course: any = await CourseModel.findById(req.params.courseId);

   const module = course?.modules.id(req.params.moduleId);

   module?.classes?.forEach(async (item: any) => {
    const arrString = item.pdf?.split("/");
    const key = arrString[arrString.length - 1];
    await S3.send(
     new DeleteObjectCommand({ Bucket: process.env.AWS_S3_BUCKET, Key: key })
    );
   });

   module.remove();
   await course.save();

   return res.status(200).send("módulo deletado com sucesso");
  } catch (e) {
   return res.status(400).send("Não foi possivel retornar o módulo");
  }
 }
);

export default route;
