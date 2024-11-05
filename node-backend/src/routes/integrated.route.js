import { Router } from "express";
import categoryRoute from "./category.route.js";
import productRoutes from "./product.route.js";
import vendorRoutes from "./vendor.route.js"
import subCategoryRoutes from './sub-category.route.js';
import authRoute from "./auth.route.js";
import pageBannerRoutes from "./cms/pageBanner.routes.js"
import blogroutes from "./cms/blogs.route.js";
import aboutUsRoutes from "./cms/aboutUs.routes.js";
import usersRoute from "./users.route.js";
import ratingRoutes from "./ratings.routes.js";

const route = Router();
route.use("/auth", authRoute)
route.use("/categories", categoryRoute);
route.use("/subcategories", subCategoryRoutes);
route.use("/products", productRoutes);
route.use("/vendors", vendorRoutes);
route.use("/blogs", blogroutes);
route.use("/page-banner", pageBannerRoutes);
route.use("/about-us", aboutUsRoutes);
route.use("/user", usersRoute)
route.use('/ratings', ratingRoutes);

export default route;