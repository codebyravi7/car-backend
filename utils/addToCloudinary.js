import fs from "fs";
import  cloudinaryUploadImage  from "./imageUploader.js";
import { cloudinaryConnect } from ".././config/cloudinary.js";
cloudinaryConnect();
export const handleFileUploads = async (files) => {
  const images = [];

  for (const file of files) {
    try {

      // Upload to Cloudinary
      const uploadResult = await cloudinaryUploadImage(file.path);
      images.push({
        url: uploadResult?.url,
        public_id: uploadResult?.public_id,
      });

      // Delete the local file
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error("Error deleting local file:", err);
        }
      });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }

  return images;
};
