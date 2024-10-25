import { Router } from "express";
import categoryRoute from "./category.route.js";
import productRoutes from "./product.route.js"

import subCategoryRoutes from './sub-category.route.js';
const route = Router();

route.use("/categories", categoryRoute);
route.use("/subcategories", subCategoryRoutes);
route.use("/products", productRoutes);



export default route;