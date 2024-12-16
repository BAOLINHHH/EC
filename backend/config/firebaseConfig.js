import admin from "firebase-admin";
import multer from "multer";
import fs from "fs";
import serviceAccount from "../serviceAccountKey.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "singhsaigondemo.firebasestorage.app",
});

const bucket = admin.storage().bucket();

// Cấu hình Multer để lưu file tạm thời
const upload = multer({ dest: "uploads/" });

// Middleware xử lý upload lên Firebase Storage cho cả file đơn lẻ và nhiều file
const uploadCloud = (fileField = "image", isMultiple = false) => {
  return (req, res, next) => {
    const uploadMethod = isMultiple ? upload.array(fileField) : upload.single(fileField);

    uploadMethod(req, res, async (err) => {
      if (err) return res.status(400).json({ error: "File upload error" });

      // Kiểm tra nếu không có file nào được gửi
      if ((isMultiple && !req.files) || (!isMultiple && !req.file)) {
        return res.status(400).json({ error: "No files provided" });
      }

      try {
        const uploadedFiles = [];

        // Nếu upload nhiều file
        if (isMultiple) {
          for (const file of req.files) {
            const localFilePath = file.path;
            const destination = `uploads/${file.originalname}`;

            // Upload file lên Firebase Storage
            await bucket.upload(localFilePath, { destination });

            // Xóa file tạm
            fs.unlinkSync(localFilePath);

            // Lấy URL công khai
            const storageFile = bucket.file(destination);
            const [url] = await storageFile.getSignedUrl({
              action: "read",
              expires: "03-01-2030",
            });

            uploadedFiles.push({ originalName: file.originalname, url });
          }
          req.files = uploadedFiles;  // Gắn URL vào req.files
        } else {
          // Nếu upload một file
          const localFilePath = req.file.path;
          const destination = `uploads/${req.file.originalname}`;

          // Upload file lên Firebase Storage
          await bucket.upload(localFilePath, { destination });

          // Xóa file tạm
          fs.unlinkSync(localFilePath);

          // Lấy URL công khai
          const storageFile = bucket.file(destination);
          const [url] = await storageFile.getSignedUrl({
            action: "read",
            expires: "03-01-2030",
          });

          req.file[fileField] = url; // Gắn URL vào req.file
        }

        next();
      } catch (error) {
        console.error("Error uploading to Firebase:", error);
        res.status(500).json({ error: "Failed to upload file to Firebase" });
      }
    });
  };
};

export default uploadCloud;
