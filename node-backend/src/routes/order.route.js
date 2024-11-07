import { Router } from "express";
import { createOrder } from "../controllers/Order/order.js";

const orderRoutes = new Router();

orderRoutes.post("/", createOrder);

export default orderRoutes;
