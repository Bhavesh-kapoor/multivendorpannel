export const phonepeConfig = {
  SALT_INDEX: "1",
  merchantId: "PGTESTPAYUAT86",
  saltKey: "96434309-7796-489d-8924-ab56988a6076",
  phonepeUrl: "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
  validateUrl: "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status",
  redirectUrl: `${process.env.BACKEND_URL}/api/payments/phonepe/callback/`,
};
