import { Router } from "express";
import {
  login,
} from "../controllers/admin/Auth/auth.controller.js";
let authRoute = Router();

authRoute.post("/login", login);
// authenticationRoute.post("/login", loginHandler);

export default authRoute;
