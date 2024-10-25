import { Router } from "express";
import { create } from "../controllers/admin/Vendor/vendor.controller.js";
const vendorsRoute = Router();


vendorsRoute.post("/",create)


export default vendorsRoute