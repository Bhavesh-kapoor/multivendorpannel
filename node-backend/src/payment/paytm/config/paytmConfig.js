import { config } from "dotenv";

config();

export const paytmConfig = {
  merchantId: process.env.PAYTM_MERCHANT_ID || "YOUR_MERCHANT_ID",
  website: process.env.PAYTM_WEBSITE || "WEBSTAGING",
  industryType: process.env.PAYTM_INDUSTRY_TYPE || "Retail",
  channelId: process.env.PAYTM_CHANNEL_ID || "WEB",
  callbackUrl:
    process.env.PAYTM_CALLBACK_URL || "https://yourdomain.com/paytm/callback",
};
