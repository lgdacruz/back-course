import { Router, Request, Response } from "express";

const route = Router();
//class
route.get("/verifyAdmin", (req: Request, res: Response) => {
 return res.status(200).send("É Admin!");
});

export default route;
