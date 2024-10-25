import { Router } from "express";
import { index, store, validateCategory, categoryById, deleteCategoryById, update } from "../controllers/admin/Category/category.controller.js";
const categoryRoute = Router();

categoryRoute.get("/all", index);
categoryRoute.post("/store", validateCategory, store);
categoryRoute.put("/update/:_id",validateCategory, update);
categoryRoute.get('/get/:_id', categoryById);
categoryRoute.delete('/delete/:_id', deleteCategoryById);

export default categoryRoute;
