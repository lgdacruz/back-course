import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB as string);

const EmailsAdmins = process.env.EMAILS_ADMS;

const user = new mongoose.Schema({
 stripId: { type: String },
 name: { type: String, required: true },
 secondName: { type: String, required: true },
 email: { type: String, required: true },
 photo: { type: String, required: false },
 userType: { type: String, enum: ["Adm", "Default"], default: "Default" },
 classesDone: { type: [String], required: false },
 questions: {
  type: [
   new mongoose.Schema({
    classId: { type: String, required: true },
    ask: { type: String, required: true },
    answer: { type: String, required: false, default: undefined },
    status: {
     type: String,
     enum: ["Pending", "Active"],
     default: "Pending",
    },
   }),
  ],
 },
});
user.pre("save", function (next) {
 // VERIFICA SE É ADMIN OU NAO
 if (EmailsAdmins?.includes(this.email)) this.userType = "Adm";
 next();
});

const Course = new mongoose.Schema({
 title: { type: String, require: true },
 description: { type: Object },
 price: { type: String, require: true },
 imgUrl: { type: String, require: false },
 modules: [
  new mongoose.Schema({
   title: { type: String, required: true },
   classes: [
    new mongoose.Schema({
     title: { type: String, required: true },
     video: { type: String || undefined, required: false, default: undefined },
     pdf: { type: String || undefined, required: false, default: undefined },
    }),
   ],
  }),
 ],
});

export const UserModel = mongoose.model("User", user);
export const CourseModel = mongoose.model("Course", Course);
