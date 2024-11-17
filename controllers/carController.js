import { Car } from "../models/Car.js";
import { handleFileUploads } from "../utils/addToCloudinary.js";
import { deleteImagesFromCloudinary } from "../utils/deleteFromCloudinary.js";

export const createCar = async (req, res) => {
 
  try {

    const images =
      req.files && req.files.length > 0
        ? await handleFileUploads(req.files)
        : [];

    const car = await Car.create({
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags.split(",").map((tag) => tag.trim()),
      images,
      userId: req.user._id,
    });

    res.status(201).json({
      message: "Car created successfully!",
      success: true,
      car,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating car", error });
  }
};

export const getCars = async (req, res) => {
  const cars = await Car.find({ userId: req.user.id });
  res.json(cars);
};
export const getCar = async (req, res) => {
 
  const { id } = req.params;
  const cars = await Car.findById(id);
  res.json(cars);
};

export const searchCars = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? { title: { $regex: req.query.keyword, $options: "i" } }
      : {}; // Search only in the title field

    const cars = await Car.find({ userId: req.user.id, ...keyword });
    res.json({ message: "cars", cars });
  } catch (err) {
    console.log("err", err);
  }
};


export const updateCar = async (req, res) => {
  try {
    const { id } = req.params;

    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Parse remaining images from req.body
    const remainingImages = JSON.parse(req.body.remainingImages || "[]");

    // Filter images to find ones to delete
    const imagesToDelete = car.images.filter(
      (img) =>
        !remainingImages.some(
          (remaining) => remaining._id === img._id.toString()
        )
    );

    // Delete unnecessary images from Cloudinary
    if (imagesToDelete.length > 0) {
      await deleteImagesFromCloudinary(imagesToDelete);
    }

    // Update car images with remaining and newly uploaded images
    const newImages =
      req.files && req.files.length > 0
        ? await handleFileUploads(req.files)
        : [];

    const updatedImages = [
      ...remainingImages.map((img) => ({
        url: img.url,
        public_id: img.public_id,
      })),
      ...newImages,
    ];

    // Update car document with new data
    const updates = {
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags.split(",").map((tag) => tag.trim()), // Assuming tags are comma-separated
      images: updatedImages,
      updatedAt: new Date(),
    };

    const updatedCar = await Car.findByIdAndUpdate(id, updates, { new: true });

    res.status(200).json({ message: "Car updated successfully", updatedCar });
  } catch (error) {
    console.error("Error updating car:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the car
    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Delete images from Cloudinary
    await deleteImagesFromCloudinary(car.images);

    // Delete car from database
    await Car.findByIdAndDelete(id);

    // Respond with success message
    res.json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting car", error });
  }
};
