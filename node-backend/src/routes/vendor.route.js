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
const vendorsRoute = Router();

vendorsRoute.post("/", vendorValidations, createVendor);

vendorsRoute.get("/", readAllVendors);

vendorsRoute.get("/get/:id", getUserById);

vendorsRoute.get("/:email", readVendor);

vendorsRoute.put("/:_id", updateVendor);

vendorsRoute.delete("/:_id", deleteVendor);

export default vendorsRoute;
