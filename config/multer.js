import multer from "multer";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_FOLDER || "uploads/"); // Default to "uploads/" if env variable is not set
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${file.originalname}${path.extname(file.originalname)}`); // Timestamp + file extension
  },
});

// File type filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG are allowed."), false);
  }
};

// Multer instance
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5 MB
});
