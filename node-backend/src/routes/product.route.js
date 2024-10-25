import { Router } from "express";
import { addProduct, deleteProduct, updateProduct, getProduct, getAllProducts, productValidationRules } from "../controllers/admin/product/product.controller.js";

const router = new Router();
router.post("/add", productValidationRules, addProduct)
router.put("/edit/:productId", updateProduct)
router.get("/get/:productId", getProduct)
router.delete("/delete/:productId", deleteProduct)
router.get("/get-all", getAllProducts)


export default router;