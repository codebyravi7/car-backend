import cloudinary from "cloudinary";

const cloudinaryUploadImage = async (fileToUpload) => {
  try {
    const data = await cloudinary.uploader.upload(fileToUpload, {
      resource_type: "auto",
    });
    return data;
  } catch (error) {
    console.log("error in uploading image in uploader: ",error);
  }
};
export default cloudinaryUploadImage;
