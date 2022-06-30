import { Router, Request, Response } from "express";
import { CourseModel } from "../../dataBase/mongoDb";

const route = Router();

// nome dos modulos e aulas
route.get(
 "/moduleandclasstitle/:courseId",
 async (req: Request, res: Response) => {
  try {
   const course: any = await CourseModel.findById(req.params.courseId, [
    "modules",
   ]);
   // MODULOS CRESCENTE
   course.modules.sort((a: any, b: any) =>
    a.title < b.title ? -1 : a.title > b.title ? 1 : 0
   );

   const Data = course?.modules?.map((item: any) => ({
    _id: item._id,
    title: item.title,
    class: item.classes.sort((a: any, b: any) => {
     return a.title < b.title ? -1 : a.title > b.title ? 1 : 0;
    }),
   }));
   return res.status(200).send(Data);
  } catch (e) {
   console.log(e);
   return res.status(400).send("Não foi possivel buscar os dados");
  }
 }
);

export default route;
