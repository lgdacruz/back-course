import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Router, Request, Response } from "express";
import { CourseModel } from "../../dataBase/mongoDb";

import upload from "../../services/multerConfig";

const route = Router();

//class
route.post(
 "/createClass/:courseId/:moduleId",
 async (req: Request, res: Response) => {
  const { title } = req.body;
  try {
   const course: any = await CourseModel.findOne({ _id: req.params.courseId });

   const module = course?.modules?.id(req.params.moduleId);
   module.classes.push({ title });

   await course?.save();
   return res.status(200).send("Aula criada com sucesso");
  } catch (e) {
   console.log(e);
   return res.status(400).send("Não foi possivel criar a class");
  }
 }
);

route.put(
 "/changeclass/:courseId/:moduleId/:classId",
 upload.single("file"),
 async (req: Request | any, res: Response) => {
  const { newTitle, newVideo } = req.body;
  try {
   const course: any = await CourseModel.findById(req.params.courseId);

   const module = course?.modules?.id(req.params.moduleId);
   const theClass = module?.classes?.id(req.params.classId);

   theClass.title = newTitle ? newTitle : theClass.title;
   theClass.video = newVideo ? newVideo : theClass.video;
   theClass.pdf = req.file ? req.file.location : theClass.pdf;

   await course.save();

   return res.status(200).send("Aula alterada com sucesso");
  } catch (e) {
   console.log(e);
   return res.status(400).send("Não foi possivel retornar o módulo");
  }
 }
);

route.delete(
 "/deletepdf/:courseId/:moduleId/:classId",
 async (req: Request, res: Response) => {
  const S3 = new S3Client({ region: process.env.AWS_DEFAULT_REGION });
  try {
   const course: any = await CourseModel.findById(req.params.courseId);

   const module = course?.modules?.id(req.params.moduleId);
   const theClass = module?.classes?.id(req.params.classId);
   const arrString = theClass.pdf.split("/");
   const key = arrString[arrString.length - 1];
   await S3.send(
    new DeleteObjectCommand({ Bucket: process.env.AWS_S3_BUCKET, Key: key })
   );

   theClass.pdf = undefined;

   await course.save();

   return res.status(200).send("PDF deletado com sucesso");
  } catch {
   return res.status(400).send("Não foi possível deletar o PDF");
  }
 }
);

route.delete(
 "/deleteclass/:courseId/:moduleId/:classId",
 async (req: Request, res: Response) => {
  const S3 = new S3Client({ region: process.env.AWS_DEFAULT_REGION });
  try {
   const course: any = await CourseModel.findById(req.params.courseId);

   const module = course?.modules?.id(req.params.moduleId);
   const theClass = module?.classes?.id(req.params.classId);

   const arrString = theClass.pdf?.split("/");
   const key = arrString[arrString.length - 1];
   await S3.send(
    new DeleteObjectCommand({ Bucket: process.env.AWS_S3_BUCKET, Key: key })
   );

   theClass.remove();

   await course.save();
   return res.status(200).send("aula deletado com sucesso");
  } catch (e) {
   return res.status(400).send("Não foi possivel retornar o módulo");
  }
 }
);

export default route;
