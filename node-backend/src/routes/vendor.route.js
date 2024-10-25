import { Router } from "express";
import { createVendor, deleteVendor, readVendor, updateVendor } from "../controllers/admin/Vendor/vendor.controller.js";
const vendorsRoute = Router();


vendorsRoute.post("/",createVendor)
vendorsRoute.get("/:email",readVendor)
vendorsRoute.put("/:email",updateVendor)  
vendorsRoute.delete("/:email",deleteVendor)


export default vendorsRoute