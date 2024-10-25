import { Router } from "express";
import categoryRoute from "./category.route.js";

import subCategoryRoutes from './sub-category.route.js';
const route = Router();

route.use("/categories", categoryRoute);
route.use("/subcategories", subCategoryRoutes);



export default route;