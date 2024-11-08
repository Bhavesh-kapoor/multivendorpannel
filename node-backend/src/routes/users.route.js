import { Router } from "express";
import {
  Index,
  create,
  logout,
  rating,
  getAllRating,
  permissions,
} from "../controllers/admin/Users/user.controller.js";

const usersRoute = Router();

usersRoute.get("/add", create);

usersRoute.get("/all", Index);

usersRoute.get("/logout", logout);

// usersRoute.post("/rating",verifyJwtToken, rating)

// usersRoute.get("/rating",verifyJwtToken,getAllRating);

usersRoute.put("/permission/:_id", permissions);

export default usersRoute;
