import { Router } from "express";
import {
  login,getuserinfo
} from "../controllers/admin/Auth/auth.controller.js";
import verifyJwtToken from "../middleware/auth.middleware.js";
let authRoute = Router();

authRoute.post("/login", login);
authRoute.get("/currentuser",verifyJwtToken,getuserinfo);
// authenticationRoute.post("/login", loginHandler);

export default authRoute;
