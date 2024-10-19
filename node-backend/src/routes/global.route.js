import { Router } from "express";
import { globalDe } from "../controllers/admin/Global/global.controller.js";
const globalroutes = Router();


globalroutes.post('/delete',globalDe);

export default globalroutes;




