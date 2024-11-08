import { config } from "dotenv";

config();

export const phonepeConfig = {
  saltKey: process.env.PHONE_PE_SALT_KEY,
  SALT_INDEX: process.env.PHONE_PE_SALT_INDEX,
  merchantId: process.env.PHONE_PE_MERCHANT_ID,
  phonepeUrl: process.env.PHONE_PE_PHONEPE_URL,
  validateUrl: process.env.PHONE_PE_VALIDATE_URL,
  redirectUrl: `${process.env.BACKEND_URL}${process.env.PHONE_PE_REDIRECT_URL}`,
};
