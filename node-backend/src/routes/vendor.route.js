import { Router } from "express";
import {
  readVendor,
  getUserById,
  createVendor,
  deleteVendor,
  updateVendor,
  readAllVendors,
  vendorValidations,
} from "../controllers/admin/Vendor/vendor.controller.js";
import { multerUpload } from "../middleware/multer.middlewere.js";
import uploadToCloudinary from "../middleware/cloudinary.middlewere.js";

const vendorsRoute = Router();

vendorsRoute.post(
  "/",
  vendorValidations,
  multerUpload.single("profileImage"),
  uploadToCloudinary,
  createVendor
);

vendorsRoute.get("/", readAllVendors);

vendorsRoute.get("/get/:id", getUserById);

vendorsRoute.get("/:email", readVendor);

vendorsRoute.put(
  "/:_id",
  multerUpload.single("profileImage"),
  uploadToCloudinary,
  updateVendor
);

vendorsRoute.delete("/:_id", deleteVendor);

export default vendorsRoute;
