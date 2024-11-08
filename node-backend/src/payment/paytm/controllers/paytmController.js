import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { paytmConfig } from "../config/paytmConfig.js";
import {
  verifySignature,
  generateSignature,
} from "../middlewares/paytmMiddleware.js";

const {
  website,
  hostname,
  channelId,
  merchantId,
  callbackUrl,
  merchantKey,
  industryType,
} = paytmConfig;

/**
 * Middleware to initialize payment order.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 *
 * @property {Object} paymentOptions - The payment options for the transaction.
 * @property {number} paymentOptions.amount - The amount for the payment (required).
 * @property {number} paymentOptions.merchantUserId - The user ID associated with the payment (required).
 * @property {number} paymentOptions.orderId - The order ID associated with the payment (required).
 *
 * @returns {void}
 */
export const initializeOrder = async (req, res, next) => {
  try {
    const orderId = "ORDER_" + uuidv4().replace(/-/g, "").slice(0, 30);
    const paymentOptions = { amount: 100, merchantUserId: 10, orderId };
    req.paymentOptions = paymentOptions;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error initializing payment order",
      error,
    });
  }
};

/**
 * Middleware to handle the payment order initialization.
 *
 * @param {Object} req - The request object containing the payment details.
 * @param {Object} res - The response object to send the response to the client.
 * @param {Function} next - The next middleware function to be executed after this one.
 * @returns {void} { req.paymentResponse } `next` to continue processing or sends an error response.
 */
export const handleOrder = async (req, res, next) => {
  try {
    const data = req.paymentResponse;
    if (!data || !data.orderId || !data.amount) {
      return res.status(400).json({ error: "Invalid payment order data." });
    }
    next();
  } catch (error) {
    console.error("Error in handleOrder middleware:", error);
    res.status(500).json({
      error: "An error occurred while processing the payment order.",
      message: error.message,
    });
  }
};

export const initiatePaytmPayment = async (req, res) => {
  try {
    const { amount, merchantUserId, orderId } = req.paymentOptions;
    if (!amount || !merchantUserId || !orderId)
      return res.status(400).json({ error: "Missing required parameters." });

    const txnAmount = amount.toString();
    const paytmParams = {
      MID: merchantId,
      WEBSITE: website,
      ORDER_ID: orderId,
      CHANNEL_ID: channelId,
      TXN_AMOUNT: txnAmount,
      CUST_ID: merchantUserId,
      CALLBACK_URL: callbackUrl,
      INDUSTRY_TYPE_ID: industryType,
    };

    const checksum = generateSignature(paytmParams, merchantKey);
    paytmParams.CHECKSUMHASH = checksum;

    const post_data = JSON.stringify(paytmParams);

    const response = await axios.post(
      `${hostname}?mid=${merchantId}&orderId=${orderId}`,
      post_data,
      {
        headers: {
          "Content-Type": "application/json",
          "Content-Length": post_data.length,
        },
      }
    );
    console.log(response?.data?.body);
  } catch (error) {
    res.status(500).json({ error: "Transaction initiation failed." });
  }
};

export const verifyPaytmTransaction = async (req, res) => {
  const receivedData = req.paymentResponse;

  const paytmChecksum = receivedData.CHECKSUMHASH;
  delete receivedData.CHECKSUMHASH;

  const isVerified = verifySignature(receivedData, paytmChecksum, merchantKey);

  if (isVerified) {
    const paytmParams = {
      MID: merchantId,
      ORDERID: receivedData.ORDERID,
    };

    const statusChecksum = generateSignature(paytmParams, merchantKey);
    paytmParams.CHECKSUMHASH = statusChecksum;

    const post_data = JSON.stringify(paytmParams);

    try {
      const response = await axios.post(`${hostname}/order/status`, post_data, {
        headers: {
          "Content-Type": "application/json",
          "Content-Length": post_data.length,
        },
      });

      const statusResponse = response.data;
      if (statusResponse.STATUS === "TXN_SUCCESS") {
        res.status(200).json({ success: true, data: statusResponse });
      } else {
        res.status(400).json({
          success: false,
          message: "Transaction failed.",
          data: statusResponse,
        });
      }
    } catch (err) {
      res.status(500).json({
        error: "Transaction verification failed.",
        details: err.message,
      });
    }
  } else {
    res.status(400).json({ error: "Checksum verification failed." });
  }
};
