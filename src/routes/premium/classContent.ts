import { Router, Request, Response } from "express";
import { CourseModel, UserModel } from "../../dataBase/mongoDb";

const router = Router();

router.get(
 "/getClass/:courseId/:moduleId/:classId",
 async (req: Request, res: Response) => {
  try {
   const course: any = await CourseModel.findById(req.params.courseId);
   const module = course.modules.id(req.params.moduleId);
   const theClass = module.classes.id(req.params.classId);

   if (!theClass || !module || !course)
    return res.status(400).send("Não existe");

   const questions = await UserModel.find({
    questions: { classId: req.params.classId, status: "Active" },
   });

   return res.status(200).send({ theClass, questions });
  } catch (e) {
   return res.status(400).send("Não foi possível encontrar essa aula");
  }
 }
);

export default router;
