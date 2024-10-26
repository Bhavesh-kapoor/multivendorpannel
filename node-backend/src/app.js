import express from "express";
import authenticationRoute from "./routes/auth.route.js";
import { index } from "./controllers/admin/dashboard.controller.js";
import usersRoute from "./routes/users.route.js";
import cors from 'cors';        // Use import for external libraries
import categoryRoute from "./routes/category.route.js";
import verifyJWTtoken from "./middleware/auth.middleware.js";
import './utils/helpers.js';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
import cookieParser from 'cookie-parser';

import './utils/helpers.js';
import integratedroutes from "./routes/integrated.route.js";
app.use(cors());
app.use(cookieParser());

// integrated routes
app.use('/api', integratedroutes)


//vendor api
app.use("/api/vendor",vendorsRoute)

export default app;
