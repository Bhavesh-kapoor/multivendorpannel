import { Router } from "express";
import { login } from "../controllers/admin/Auth/auth.controller.js";
let authenticationRoute = Router();

authenticationRoute.get('/login', login);



export default authenticationRoute;


