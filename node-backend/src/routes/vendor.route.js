import { Router } from "express";
import {
  readVendor,
  getUserById,
  createVendor,
  deleteVendor,
  updateVendor,
  sendOTPToMail,
  resetPassword,
  readAllVendors,
  forgetPassword,
  vendorValidations,
} from "../controllers/admin/Vendor/vendor.controller.js";
import { multerUpload } from "../middleware/multer.middlewere.js";
import uploadToCloudinary from "../middleware/cloudinary.middlewere.js";
import verifyJwtToken from "../middleware/auth.middleware.js";

const vendorsRoute = Router();

vendorsRoute.post(
  "/",
  verifyJwtToken,
  multerUpload.single("profileImage"),
  uploadToCloudinary,
  vendorValidations,
  createVendor
);

vendorsRoute.get("/:email", readVendor);

vendorsRoute.get("/", verifyJwtToken, readAllVendors);

vendorsRoute.get("/get/:id", verifyJwtToken, getUserById);

vendorsRoute.post("/reset-password", verifyJwtToken, resetPassword);

vendorsRoute.post("/forget-password", forgetPassword);

vendorsRoute.post("/send-otp", sendOTPToMail);

vendorsRoute.put(
  "/:_id",
  verifyJwtToken,
  multerUpload.single("profileImage"),
  uploadToCloudinary,
  updateVendor
);

vendorsRoute.delete("/:_id", verifyJwtToken, deleteVendor);

export default vendorsRoute;
