export const phonepeConfig = {
  merchantId: "PGTESTPAYUAT86",
  saltKey: "96434309-7796-489d-8924-ab56988a6076",
  phonepeUrl: "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
  redirectUrl: `${process.env.FRONTEND_URL}/verifying_payment/`,
};
