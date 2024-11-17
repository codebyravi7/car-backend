import express from "express";
import {
  createCar,
  getCars,
  searchCars,
  updateCar,
  deleteCar,
  getCar,
} from "../controllers/carController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../config/multer.js";
import multer from "multer";

const router = express.Router();

// Create car with image upload
router.post(
  "/",
  protect,
  (req, res, next) => {
    upload.array("images", 10)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res
          .status(400)
          .json({ message: `Upload Error: ${err.message}` });
      } else if (err) {
        return res.status(400).json({ message: `Error: ${err.message}` });
      }
      next();
    });
  },
  createCar
);

// Get all cars
router.get("/", protect, getCars);

// Search cars
router.get("/search", protect, searchCars);

// Get a single car by ID
router.get("/:id", protect, getCar);

// Update car with image upload
router.put(
  "/:id",
  protect,
  (req, res, next) => {
    upload.array("images", 10)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res
          .status(400)
          .json({ message: `Upload Error: ${err.message}` });
      } else if (err) {
        return res.status(400).json({ message: `Error: ${err.message}` });
      }
      next();
    });
  },
  updateCar
);

// Delete a car
router.delete("/:id", protect, deleteCar);

export default router;
