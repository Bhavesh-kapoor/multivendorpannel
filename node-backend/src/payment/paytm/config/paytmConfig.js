import { config } from "dotenv";

config();

export const paytmConfig = {
  website: process.env.PAYTM_WEBSITE,
  merchantId: process.env.PAYTM_MID,
  channelId: process.env.PAYTM_CHANNEL_ID,
  merchantKey: process.env.PAYTM_MERCHANT_KEY,
  industryType: process.env.PAYTM_INDUSTRY_TYPE,
  callbackUrl: `${process.env.BACKEND_URL}${process.env.PAYTM_CALLBACK_URL}`,
  hostname:
    process.env.PAYTM_WEBSITE === "WEBSTAGING"
      ? "https://securegw-stage.paytm.in/theia/api/v1/initiateTransaction"
      : "https://securegw.paytm.in/theia/api/v1/initiateTransaction",
};
