import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import fs from "fs";
import Banner from "../model/bannerModel.js";
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
console.log(__filename, "---------------------");
// Ensure the upload directory exists
const uploadDirectory = path.resolve(__dirname, "..", "uploads/banners");
console.log(uploadDirectory, "---------------------");
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

//__________IMAGES_HANDLER__________//
// 1) UPLOADING(Multer)
export const uploadBannerImage = uploadSingleImage("image");

// 2) PROCESSING(Sharp)
export const resizeBannerImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const fileTypes = ["image/jpeg", "image/png"];
  if (!fileTypes.includes(req.file.mimetype)) {
    return next(new Error("Invalid file type. Only JPEG and PNG are allowed."));
  }

  const filename = `banner-${req.user._id}-${Date.now()}.jpeg`;
  const filePath = path.join(uploadDirectory, filename);

  try {
    await sharp(req.file.buffer)
      .resize(1920, 784)
      .toFormat("jpeg")
      .jpeg({ quality: 80 }) // Adjust quality for optimization
      .toFile(filePath);

    // Put the filename in req.body to access it when creating or updating the banner
    req.body.image = filename;
    next();
  } catch (error) {
    next(new Error(`Failed to process and save the image: ${error.message}`));
  }
});

// @desc    CREATE A Banner
// @route   POST /api/banners
// @access  Private("ADMIN")
export const createBanner = createOne(Banner);

// @desc    GET All Banners
// @route   GET /api/banners
// @access  Public
export const getAllBanners = getAll(Banner);

// @desc    GET Single Banner
// @route   GET /api/banners/:id
// @access  Private("ADMIN")
export const getSingleBanner = getOne(Banner);

// @desc    UPDATE Single Banner
// @route   PATCH /api/banners/:id
// @access  Private("ADMIN")
export const updateSingleBanner = updateOne(Banner);

// @desc    DELETE Single Banner
// @route   DELETE /api/banners/:id
// @access  Private("ADMIN")
export const deleteSingleBanner = deleteOne(Banner);
