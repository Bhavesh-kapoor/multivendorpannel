import { Router } from "express";
import { createVendor, deleteVendor, readAllVendors, readVendor, updateVendor } from "../controllers/admin/Vendor/vendor.controller.js";
const vendorsRoute = Router();


vendorsRoute.post("/",createVendor)
vendorsRoute.get("/",readAllVendors)
vendorsRoute.get("/:email",readVendor)
vendorsRoute.put("/:email",updateVendor)  
vendorsRoute.delete("/:email",deleteVendor)


export default vendorsRoute