import express from "express";
import {
  handleOrder,
  initializeOrder,
  initiatePaytmPayment,
  verifyPaytmTransaction,
} from "../controllers/paytmController.js";

const router = express.Router();

router.post("/initiate", initializeOrder, initiatePaytmPayment);

router.post("/callback", verifyPaytmTransaction, handleOrder);

export default router;
