import { Router, Request, Response } from "express";
import { UserModel } from "../../dataBase/mongoDb";

const route = Router();

route.post("/createQuestions/:userId", async (req: Request, res: Response) => {
 const { classId, ask } = req.body;
 try {
  const user = await UserModel.findById(req.params.userId);
  user?.questions?.push({ classId, ask });

  await user?.save();

  return res.status(200).send("Questions criado com sucesso");
 } catch (e) {
  console.log(e);
  return res.status(400).send("Não foi possivel criar a Questions");
 }
});

export default route;
