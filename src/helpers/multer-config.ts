import { Request, Response } from "express";
import multer from "multer";

import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "imgs");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

const imageFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedExtensions = [".png", ".jpg", ".jpeg"];
  const fileExtension = path.extname(file.originalname);
  if (allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `File type ${fileExtension} is not allowed. Only ${allowedExtensions.join(
          ", "
        )} are allowed`
      )
    );
  }
};

const upload = multer({ storage, fileFilter: imageFilter });

export default upload.array("archivo");
