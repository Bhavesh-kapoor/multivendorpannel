import { Router } from "express";
import { index ,create, store, validateCategory, edit} from "../controllers/admin/Category/category.controller.js";
const categoryRoute = Router();

categoryRoute.get("/all", index);
categoryRoute.get("/add", create);
categoryRoute.post("/store",validateCategory, store);
categoryRoute.get("/edit/:id", edit);
export default categoryRoute;
