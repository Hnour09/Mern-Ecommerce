import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import fs from "fs";
import Product from "../model/productModel.js";
import {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} from "../utils/refactorControllers.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import { uploadMixOfImages } from "../middleware/imgUpload.middleware.js";
import sharp from "sharp";

// Get the current directory in an ES module environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure the upload directory exists
const uploadDirectory = path.resolve(__dirname, "..", "uploads/products");
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

//__________IMAGES_HANDLER__________//
// 1) UPLOADING (Multer)
export const uploadProductImages = uploadMixOfImages([
  { name: "image", maxCount: 1 },
  { name: "sliderImages", maxCount: 4 },
]);

// 2) PROCESSING (Sharp)
export const resizeProductImages = asyncHandler(async (req, res, next) => {
  if (!req.files) return next();

  // a) Process main image field
  if (req.files.image && req.files.image.length > 0) {
    const mainImageFilename = `product-${req.user._id}-${Date.now()}-main.jpeg`;
    const mainImagePath = path.join(uploadDirectory, mainImageFilename);

    try {
      await sharp(req.files.image[0].buffer)
        .resize(800, 800)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(mainImagePath);

      // Store the main image filename in req.body for later access
      req.body.image = mainImageFilename;
    } catch (error) {
      return next(new Error(`Failed to process main image: ${error.message}`));
    }
  }

  // b) Process slider images field
  if (req.files.sliderImages && req.files.sliderImages.length > 0) {
    req.body.sliderImages = await Promise.all(
      req.files.sliderImages.map(async (img, idx) => {
        const sliderImageName = `product-${req.user._id}-${Date.now()}-slide-${
          idx + 1
        }.jpeg`;
        const sliderImagePath = path.join(uploadDirectory, sliderImageName);

        try {
          await sharp(img.buffer)
            .resize(800, 800)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(sliderImagePath);

          // Return the slider image name to be stored in req.body
          return sliderImageName;
        } catch (error) {
          throw new Error(
            `Failed to process slider image ${idx + 1}: ${error.message}`
          );
        }
      })
    );
  }

  next();
});

// @desc    CREATE A Product
// @route   POST /api/products
// @access  Private("ADMIN")
export const createProduct = createOne(Product);

// @desc    GET All Products
// @route   GET /api/products
// @access  Public
export const getAllProducts = getAll(Product);

// @desc    GET Single Product
// @route   GET /api/products/:id
// @access  Public
export const getSingleProduct = getOne(Product, "reviews");

// @desc    UPDATE Single Product
// @route   PATCH /api/products/:id
// @access  Private("ADMIN")
export const updateSingleProduct = updateOne(Product);

// @desc    DELETE Single Product
// @route   DELETE /api/products/:id
// @access  Private("ADMIN")
export const deleteSingleProduct = deleteOne(Product);

// @desc    GET Top Aliases (Rated-Sold-Sales) Product
// @route   ex: GET /api/products?sort=-ratingAverage&limit=7 or GET /api/products/top-rated
// @access  Public
export const getTopAliases = (sortOption) => {
  return (req, res, next) => {
    req.query.limit = "7";
    req.query.sort = `${sortOption}`;
    req.query.fields =
      "name price image discount ratingAverage reviewsNumber quantityInStock";
    next();
  };
};
