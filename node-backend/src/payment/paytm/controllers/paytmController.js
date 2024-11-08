import https from "https";
import { v4 as uuidv4 } from "uuid";
import { paytmKeys } from "../config/paytmKeys.js";
import { paytmConfig } from "../config/paytmConfig.js";
import {
  verifySignature,
  generateSignature,
} from "../middlewares/paytmMiddleware.js";

export const initiatePayment = async (req, res) => {
  try {
    const { amount, userId } = req.body;

    const orderId = "ORDER_" + uuidv4();
    const txnAmount = amount.toString();

    const paytmParams = {
      CUST_ID: userId,
      ORDER_ID: orderId,
      TXN_AMOUNT: txnAmount,
      MID: paytmKeys.MERCHANT_ID,
      WEBSITE: paytmConfig.website,
      CHANNEL_ID: paytmConfig.channelId,
      CALLBACK_URL: paytmConfig.callbackUrl,
      INDUSTRY_TYPE_ID: paytmConfig.industryType,
    };

    const checksum = await generateSignature(
      paytmParams,
      paytmKeys.MERCHANT_KEY
    );
    paytmParams.CHECKSUMHASH = checksum;

    const post_data = JSON.stringify(paytmParams);

    const options = {
      hostname: "securegw-stage.paytm.in",
      port: 443,
      path: `/theia/api/v1/initiateTransaction?mid=${paytmKeys.MERCHANT_ID}&orderId=${orderId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": post_data.length,
      },
    };

    const response = [];
    const request = https.request(options, (result) => {
      result.on("data", (chunk) => response.push(chunk));
      result.on("end", () => {
        const parsedResponse = JSON.parse(Buffer.concat(response).toString());

        if (parsedResponse.body && parsedResponse.body.txnToken) {
          const txnToken = parsedResponse.body.txnToken;
          const paytmUrl = `https://securegw-stage.paytm.in/theia/api/v1/showPaymentPage?mid=${paytmKeys.MERCHANT_ID}&orderId=${orderId}&txnToken=${txnToken}`;
          res.status(200).json({ paytmUrl });
        } else {
          res
            .status(500)
            .json({ error: "Failed to generate transaction token" });
        }
      });
    });

    request.write(post_data);
    request.end();

    request.on("error", (err) => {
      res
        .status(500)
        .json({ error: "Transaction token generation failed", details: err });
    });
  } catch (error) {
    res.status(500).json({ error: "Transaction initiation failed." });
  }
};

export const verifyTransaction = async (req, res) => {
  const receivedData = req.body;

  const paytmChecksum = receivedData.CHECKSUMHASH;
  delete receivedData.CHECKSUMHASH;

  const isVerified = verifySignature(
    receivedData,
    paytmChecksum,
    paytmKeys.MERCHANT_KEY
  );

  if (isVerified) {
    const paytmParams = {
      MID: paytmKeys.MERCHANT_ID,
      ORDERID: receivedData.ORDERID,
    };
    const statusChecksum = generateSignature(
      paytmParams,
      paytmKeys.MERCHANT_KEY
    );
    paytmParams.CHECKSUMHASH = statusChecksum;

    const post_data = JSON.stringify(paytmParams);

    const options = {
      hostname: "securegw-stage.paytm.in",
      port: 443,
      path: "/order/status",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": post_data.length,
      },
    };

    const response = [];
    const request = https.request(options, (result) => {
      result.on("data", (chunk) => response.push(chunk));
      result.on("end", () => {
        const statusResponse = JSON.parse(Buffer.concat(response).toString());
        if (statusResponse.STATUS === "TXN_SUCCESS") {
          res.status(200).json({ success: true, data: statusResponse });
        } else {
          res.status(400).json({
            success: false,
            message: "Transaction failed.",
            data: statusResponse,
          });
        }
      });
    });

    request.write(post_data);
    request.end();

    request.on("error", (err) => {
      res
        .status(500)
        .json({ error: "Transaction verification failed.", details: err });
    });
  } else {
    res.status(400).json({ error: "Checksum verification failed." });
  }
};
