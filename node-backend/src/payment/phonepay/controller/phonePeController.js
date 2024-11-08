import https from "https";
import { v4 as uuidv4 } from "uuid";
import { phonepeConfig } from "../config/phonePayConfig.js";
import { generateSignature } from "../middlewares/phonePayMiddleware.js";

export const initiatePayment = async (req, res) => {
  try {
    const { amount = 100, userId = 10 } = req.body;
    const orderId = "ORDER_" + uuidv4();
    const txnAmount = amount * 100;

    const payload = JSON.stringify({
      amount: txnAmount,
      payMode: "PAY_PAGE",
      merchantUserId: userId,
      redirectMode: "REDIRECT",
      merchantTransactionId: orderId,
      merchantId: phonepeConfig.merchantId,
      redirectUrl: phonepeConfig.redirectUrl,
      paymentInstrument: { type: "PAY_PAGE" },
      redirectUrl: `${process.env.FRONTEND_URL}/verifying_payment/${orderId}`,
      callbackUrl: `${process.env.BACKEND_URL}/api/payment/callback/${orderId}`,
    });

    const signature = generateSignature(payload);

    const options = {
      hostname: "api-preprod.phonepe.com", // Use the staging environment URL for testing
      port: 443,
      path: "/apis/pg-sandbox/pg/v1/pay",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": `${signature}###${phonepeConfig.saltKey}`,
      },
    };

    // Send request to PhonePe
    const response = [];
    const request = https.request(options, (result) => {
      result.on("data", (chunk) => response.push(chunk));
      result.on("end", () => {
        const parsedResponse = JSON.parse(Buffer.concat(response).toString());

        if (parsedResponse.success) {
          const paymentUrl = `${phonepeConfig.phonepeUrl}?merchantId=${phonepeConfig.merchantId}&transactionId=${orderId}`;
          res.status(200).json({ paymentUrl });
        } else {
          res
            .status(500)
            .json({ error: "Failed to initiate PhonePe transaction" });
        }
      });
    });

    request.write(payload);
    request.end();

    request.on("error", (err) => {
      res
        .status(500)
        .json({ error: "Transaction initiation failed", details: err });
    });
  } catch (error) {
    res.status(500).json({ error: "PhonePe transaction initiation failed." });
  }
};
