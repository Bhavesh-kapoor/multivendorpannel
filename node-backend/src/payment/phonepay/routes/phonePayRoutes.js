import express from "express";
import {
  handleOrder,
  initializeOrder,
  verifyPhonePePayment,
  initiatePhonePePayment,
} from "../controller/phonePeController.js";

const router = express.Router();

router.post("/initiate", initializeOrder, initiatePhonePePayment);

router.get("/redirect/:transactionId", verifyPhonePePayment, handleOrder);

export default router;
