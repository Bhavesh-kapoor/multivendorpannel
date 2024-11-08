import express from "express";
import { initiatePayment } from "../controller/phonePeController.js";

const router = express.Router();

router.post("/initiate", initiatePayment);

export default router;
