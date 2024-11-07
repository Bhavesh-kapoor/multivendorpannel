import { Router } from "express";
import {
  createVendor,
  deleteVendor,
  readAllVendors,
  readVendor,
  updateVendor,
  vendorValidations,
} from "../controllers/admin/Vendor/vendor.controller.js";
const vendorsRoute = Router();

vendorsRoute.post("/", vendorValidations, createVendor);
vendorsRoute.get("/", readAllVendors);
vendorsRoute.get("/:email", readVendor);
vendorsRoute.put("/:_id", updateVendor);
vendorsRoute.delete("/:_id", deleteVendor);

export default vendorsRoute;
