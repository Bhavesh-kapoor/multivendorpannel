import { Router } from "express";
import { index, store, validateSubCategory, update, SubcategoryById, deleteSubCategoryById } from "../controllers/admin/Category/Subcategory/subcategory.controller.js";
const subCategoryRoutes = Router();

subCategoryRoutes.get("/all", index);
subCategoryRoutes.post("/store", validateSubCategory, store);
subCategoryRoutes.put("/update/:_id", update);
subCategoryRoutes.get('/get/:_id', SubcategoryById);
subCategoryRoutes.delete('/delete/:_id', deleteSubCategoryById);

export default subCategoryRoutes;
