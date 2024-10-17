import { Router } from "express";
import {
  login,
  loginHandler,
} from "../controllers/admin/Auth/auth.controller.js";
let authenticationRoute = Router();

authenticationRoute.get("/login", login);
authenticationRoute.post("/login", loginHandler);

export default authenticationRoute;
