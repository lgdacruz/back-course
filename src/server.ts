import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import AWS from "aws-sdk";
import adminVerify from "./routes/admin/adminVerify";
import adminCourses from "./routes/admin/courseRoutes";
import adminClass from "./routes/admin/classRoutes";
import adminQuestions from "./routes/admin/questionsRoutes";
import adminModule from "./routes/admin/moduleRoutes";
import classContent from "./routes/premium/classContent";
import premiumComments from "./routes/premium/questionsRoutes";
import premiumTitles from "./routes/premium/courseTitles";
import userComments from "./routes/user/commentsRoute";
import user from "./routes/user/userRoutes";
import auth from "./routes/noAuthentication/authRoute";
import courses from "./routes/noAuthentication/courses";
import { CheckAuth } from "./middlware/checkAuth";
import { CheckAdmin } from "./middlware/checkAdmin";

const app = express();

app.use(cors());
AWS.config.update({
 secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
 accessKeyId: process.env.AWS_ACCESS_KEY_ID,
 region: process.env.AWS_DEFAULT_REGION,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(auth, courses);
app.use(
 "/adm",
 CheckAdmin,
 adminCourses,
 adminClass,
 adminModule,
 adminVerify,
 adminQuestions
);
app.use(
 "/auth",
 CheckAuth,
 classContent,
 premiumComments,
 premiumTitles,
 userComments,
 user
);

app.listen(process.env.PORT, () => console.log(process.env.PORT));
