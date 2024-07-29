import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import fs from "fs";
import Category from "../model/categoryModel.js";
import {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} from "../utils/refactorControllers.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import { uploadSingleImage } from "../middleware/imgUpload.middleware.js";
import sharp from "sharp";

// Get the current directory in an ES module environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure the upload directory exists
const uploadDirectory = path.resolve(__dirname, "..", "uploads/categories");
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

//__________IMAGES_HANDLER__________//
// 1) UPLOADING(Multer)
export const uploadCategoryImage = uploadSingleImage("image");

// 2) PROCESSING(Sharp)
export const resizeCategoryImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const filename = `category-${req.user._id}-${Date.now()}.jpeg`;
  const filePath = path.join(uploadDirectory, filename);

  try {
    await sharp(req.file.buffer)
      .resize(400, 400)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(filePath);

    // Put the filename in req.body to access it when creating or updating the category
    req.body.image = filename;
    next();
  } catch (err) {
    next(new Error(`Failed to process and save the image: ${err.message}`));
  }
});

// @desc    CREATE A Category
// @route   POST /api/categories
// @access  Private("ADMIN")
export const createCategory = createOne(Category);

// @desc    GET All Categories
// @route   GET /api/categories
// @access  Public
export const getAllCategories = getAll(Category);

// @desc    GET Single category
// @route   GET /api/categories/:id
// @access  Public
export const getSingleCategory = getOne(Category);

// @desc    UPDATE Single Category
// @route   PATCH /api/categories/:id
// @access  Private("ADMIN")
export const updateSingleCategory = updateOne(Category);

// @desc    DELETE Single Category
// @route   DELETE /api/categories/:id
// @access  Private("ADMIN")
export const deleteSingleCategory = deleteOne(Category);
