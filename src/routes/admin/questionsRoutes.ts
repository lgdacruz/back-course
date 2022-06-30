import { Router, Request, Response } from "express";
import { UserModel } from "../../dataBase/mongoDb";

const route = Router();

route.get("/allquestions", async (req: Request, res: Response) => {
 try {
  const asks = await UserModel.find({ questions: { status: "Pending" } });
  return res.status(200).send(asks);
 } catch (e) {
  return res.status(400).send("Não foi possível retornar as perguntas");
 }
});

route.post(
 "/questionResponse/:userId/:questionId",
 async (req: Request, res: Response) => {
  const { answer } = req.body;

  if (!answer) return res.status(400).send("Não inseriu a resposta");
  try {
   const asks: any = await UserModel.findById(req.params.userId);
   const askDone = asks?.questions.id(req.params.questionId);
   askDone.answer = answer;
   askDone.status = "Active";

   await asks.save();

   return res.status(200).send("ok");
  } catch (e) {
   return res.status(400).send("Não foi possivel alterar a resposta");
  }
 }
);

route.delete(
 "/deleteQuestion/:userId/:questionId",
 async (req: Request, res: Response) => {
  const { classId, questionId } = req.params;
  try {
   const asks: any = await UserModel.findById(req.params.userId);
   asks?.questions.id(req.params.questionId).remove();

   await asks.save();

   return res.status(200).send("ok");
  } catch (e) {
   return res.status(400).send("Não foi possivel alterar a resposta");
  }
 }
);

export default route;
