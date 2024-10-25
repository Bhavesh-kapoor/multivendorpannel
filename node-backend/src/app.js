import express from "express";
import authenticationRoute from "./routes/auth.route.js";
import { index } from "./controllers/admin/dashboard.controller.js";
import usersRoute from "./routes/users.route.js";
import cors from 'cors';        // Use import for external libraries
import categoryRoute from "./routes/category.route.js";
import verifyJWTtoken from "./middleware/auth.middleware.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
import cookieParser from 'cookie-parser';

import './utils/helpers.js';

import globalroutes from "./routes/global.route.js";
import subCategoryRoutes from "./routes/sub-category.route.js";
app.use(cors());
app.use(cookieParser());

// AUTH ROUTES
app.use('/admin/global', globalroutes);
app.use("/auth", authenticationRoute);
app.get("/admin/dashboard", verifyJWTtoken, index);

// users routes
app.use("/admin/users", verifyJWTtoken, usersRoute);

// categories / Sub Cat routes
app.use("/api/categories", categoryRoute);
app.use("/admin/subcategories", verifyJWTtoken, subCategoryRoutes);


export default app;
