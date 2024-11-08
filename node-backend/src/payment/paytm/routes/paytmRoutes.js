import express from "express";
import {
  initiatePayment,
  verifyTransaction,
} from "../controllers/paytmController.js";

const router = express.Router();

router.post("/initiate", initiatePayment);

router.post("/callback", verifyTransaction);

export default router;
