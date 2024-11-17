import cloudinary from "cloudinary";

// Function to delete multiple images from Cloudinary
export const deleteImagesFromCloudinary = async (images) => {
  for (const image of images) {
    try {
      await cloudinary.uploader.destroy(image?.public_id);
    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
    }
  }
};
