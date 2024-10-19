import { Router } from "express";
import { index ,create, store, validateSubCategory, edit} from "../controllers/admin/Category/Subcategory/subcategory.controller.js";
const subCategoryRoutes = Router();

subCategoryRoutes.get("/all", index);
subCategoryRoutes.get("/add", create);
subCategoryRoutes.post("/store",validateSubCategory, store);
subCategoryRoutes.get("/edit/:id", edit);
export default subCategoryRoutes;
