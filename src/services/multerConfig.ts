import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import crypto from "crypto";
import path from "path";

const maxSize = 2 * 1024 * 1024;

const S3 = multerS3({
 s3: new AWS.S3({ apiVersion: "2006-03-01" }),
 bucket: process.env.AWS_S3_BUCKET as string,
 metadata: function (req, file, cb) {
  cb(null, { fieldName: file.fieldname });
 },
 acl: "public-read",
 contentType: multerS3.AUTO_CONTENT_TYPE,
 key: function (req: any, file: any, cb: any) {
  crypto.randomBytes(16, (err, hash) => {
   if (err) cb(err);
   const fileName = `${hash.toString("hex")}-${Date.now()}`;
   cb(null, fileName);
  });
 },
});

const local = multer.diskStorage({
 destination: function (req, file, cb) {
  const pathFile = path.join(__dirname, "..", "/tmp");
  cb(null, pathFile);
 },
 filename: function (req: any, file: any, cb: any) {
  crypto.randomBytes(16, (err, hash) => {
   if (err) cb(err);
   const type = file.mimetype.split("/");
   const fileName = `${hash.toString("hex")}-${Date.now()}.${type[1]}`;
   cb(null, fileName);
  });
 },
});

const upload = multer({
 dest: path.resolve(__dirname, "..", "/tmp"),
 storage: S3,
 limits: {
  fileSize: maxSize,
 },
});

export default upload;
