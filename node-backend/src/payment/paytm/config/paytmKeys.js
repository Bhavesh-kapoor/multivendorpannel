import { config } from "dotenv";

config();

export const paytmKeys = {
  MERCHANT_KEY: process.env.PAYTM_MERCHANT_KEY || "",
  MERCHANT_ID: process.env.PAYTM_MID || "",
};
