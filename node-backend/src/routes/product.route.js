import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  updateProduct,
  getProduct,
  getAllProducts,
  productValidationRules,
} from "../controllers/admin/product/product.controller.js";
// import { multerUpload } from "../middleware/multer.middlewere.js";
// import { uploadToCloudinary } from "../middleware/cloudinary.middlewere.js";

const router = new Router();
// router.post("/add", multerUpload.array("imageFiles", 10), uploadToCloudinary(), productValidationRules, addProduct)
// router.put("/edit/:productId", multerUpload.array("imageFiles", 10), uploadToCloudinary(), productValidationRules, updateProduct)

// router.get("/get-all", getAllProducts)

router.post("/product", addProduct);
router.get("/product", getAllProducts);
router.delete("/product/:productId", deleteProduct);
router.get("/product/:productId", getProduct);
export default router;
