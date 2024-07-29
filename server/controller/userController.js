import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import fs from "fs";
import User from "../model/userModel.js";
import {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} from "../utils/refactorControllers.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import APIError from "../utils/apiError.utils.js";
import { generateSendToken } from "../utils/tokenHandler.utils.js";
import { uploadSingleImage } from "../middleware/imgUpload.middleware.js";
import sharp from "sharp";

// Get the current directory in an ES module environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure the upload directory exists
const uploadDirectory = path.resolve(__dirname, "..", "uploads/users");
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

//__________IMAGES_HANDLER__________//
// 1) UPLOADING (Multer)
export const uploadUserImage = uploadSingleImage("image");

// 2) PROCESSING (Sharp)
export const resizeUserImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const filename = `user-${req.user._id}-${Date.now()}.jpeg`;
  const filePath = path.join(uploadDirectory, filename);

  try {
    await sharp(req.file.buffer)
      .resize(400, 400)
      .toFormat("jpeg")
      .jpeg({ quality: 80 })
      .toFile(filePath);

    // Store the filename in req.body for later access
    req.body.image = filename;
    next();
  } catch (error) {
    next(new Error(`Failed to process user image: ${error.message}`));
  }
});

//_________________________________________________________//
//____________________ADMIN_CONTROLLERS____________________//
//_________________________________________________________//

// @desc    CREATE A User
// @route   POST /api/users
// @access  Private("ADMIN")
// We need to create a new user by registering only
export const createUser = createOne(User);

// @desc    GET All Users
// @route   GET /api/users
// @access  Private("ADMIN")
export const getAllUsers = getAll(User);

// @desc    GET Single User
// @route   GET /api/users/:id
// @access  Private("ADMIN")
export const getSingleUser = getOne(User);

// @desc    UPDATE Single User
// @route   PATCH /api/users/:id
// @access  Private("ADMIN")
export const updateSingleUser = updateOne(User);

// @desc    DELETE Single User
// @route   DELETE /api/users/:id
// @access  Private("ADMIN")
export const deleteSingleUser = deleteOne(User);

//_______________________________________________________________//
//____________________LOGGED_USER_CONTROLLERS____________________//
//_______________________________________________________________//

// @desc    GET logged user profile
// @route   GET /api/user/my-profile
// @access  Protected
export const getMyProfile = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc    UPDATE logged user profile
// @route   PATCH /api/user/my-profile
// @access  Protected
export const updateMyProfile = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      email: req.body.email,
      username: req.body.username,
      image: req.body.image,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({ data: updatedUser });
});

// @desc    DELETE (Deactivate) logged user
// @route   DELETE /api/users/my-profile
// @access  Protected
export const deleteMyProfile = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({ status: "success" });
});

// @desc    UPDATE logged user password
// @route   PATCH /api/user/my-password
// @access  Protected
export const updateMyPassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  const user = await User.findById(req.user._id).select("+password");

  // 1) Check if the current password entered matches the user password
  if (!(await user.isCorrectPassword(currentPassword, user.password))) {
    return next(new APIError("Current password entered is incorrect!"));
  }

  // 2) Check if newPassword matches confirmNewPassword
  if (newPassword !== confirmNewPassword) {
    return next(
      new APIError("New password does not match with the confirmation field!")
    );
  }

  // 3) If okay, then update password
  user.password = newPassword;
  user.passwordConfirm = confirmNewPassword;
  await user.save();

  // 4) Password changed? Generate a new token
  generateSendToken(res, user, 200);
});
