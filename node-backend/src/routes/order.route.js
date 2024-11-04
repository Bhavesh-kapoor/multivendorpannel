import { Router } from "express";
import { createOrder } from "../controllers/Order/order";

const orderRoutes = new Router();

orderRoutes.post("/", createOrder);

export default orderRoutes;
