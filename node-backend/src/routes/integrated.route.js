import { Router } from "express";
import categoryRoute from "./category.route.js";
import productRoutes from "./product.route.js";
import vendorRoutes from "./vendor.route.js"
import subCategoryRoutes from './sub-category.route.js';
import authRoute from "./auth.route.js";

const route = Router();

route.use("/categories", categoryRoute);
route.use("/subcategories", subCategoryRoutes);
route.use("/products", productRoutes);
route.use("/vendors", vendorRoutes);
route.use("/auth", authRoute);

export default route;