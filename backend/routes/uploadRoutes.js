import path from "path";
import express from "express";
import multer from "multer";
import uploadCloud from "../config/firebaseConfig.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const minetype = filetypes.test(file.minetype);
  if (extname && minetype) {
    return cb(null, true);
  } else {
    cb("Images only!");
  }
}

const upload = multer({
  storage,
});

router.post("/", upload.single("image"), (req, res) => {
  res.send({
    message: "Image Uploaded",
    image: `/${req.file.path}`,
  });
});

router.post("/file", uploadCloud("image"), (req, res) => {
  try {
    res.status(201).json({
      message: "Image Uploaded",
      image: `${req.file.image}`,
    });
  } catch (error) {
    console.log("error.message", error.message)
    res.status(400).json({ message: error.message });
  }
});

export default router;
