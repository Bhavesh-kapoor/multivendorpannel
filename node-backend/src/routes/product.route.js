import { Router } from "express";
import { addProduct, deleteProduct, updateProduct, getProduct, getAllProducts, productValidationRules } from "../controllers/admin/product/product.controller.js";

const router = new Router();
router.post("/add", productValidationRules, addProduct)
router.post("/edit/:productId", updateProduct)
router.post("/get/:productId", getProduct)
router.post("/delete/:productId", deleteProduct)
router.post("/get-all", getAllProducts)


export default router;