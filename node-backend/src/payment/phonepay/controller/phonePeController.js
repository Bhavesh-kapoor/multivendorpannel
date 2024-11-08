import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { phonepeConfig } from "../config/phonePayConfig.js";
import {
  generateSignature,
  generateStatusChecksum,
} from "../middlewares/phonePayMiddleware.js";

const { merchantId, redirectUrl, phonepeUrl } = phonepeConfig;

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
 *
 * @returns {void}
 */
export const initializeOrder = async (req, res, next) => {
  try {
    const transactionId = "TXN_" + uuidv4().replace(/-/g, "").slice(0, 30);
    const paymentOptions = { amount: 100, merchantUserId: 10, transactionId };
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

export const initiatePhonePePayment = async (req, res) => {
  try {
    const { amount, merchantUserId, transactionId: txnID } = req.paymentOptions;
    if (!amount || !merchantUserId || !txnID)
      return res.status(400).json({ error: "Missing required parameters." });

    const txnAmount = amount * 100;
    const payload = {
      amount: txnAmount,
      payMode: "PAY_PAGE",
      merchantId: merchantId,
      redirectMode: "REDIRECT",
      merchantTransactionId: txnID,
      merchantUserId: merchantUserId,
      redirectUrl: `${redirectUrl}${txnID}`,
      callbackUrl: `${redirectUrl}/${txnID}`,
      paymentInstrument: { type: "PAY_PAGE" },
    };

    const { xVerifyChecksum, base64EncodedPayload } =
      generateSignature(payload);

    const options = {
      method: "post",
      url: `${phonepeUrl}`,
      data: { request: base64EncodedPayload },
      headers: {
        accept: "application/json",
        "X-VERIFY": xVerifyChecksum,
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.request(options);
    if (data?.success) {
      const paymentUrl = data?.data?.instrumentResponse?.redirectInfo?.url;
      if (paymentUrl) {
        return res
          .status(200)
          .json({ success: true, url: paymentUrl, message: "Success" });
      } else {
        return res
          .status(400)
          .json({ error: "Payment URL not found in response." });
      }
    } else {
      return res
        .status(400)
        .json({ error: "Payment initiation failed, try again." });
    }
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({
        error: `PhonePe API error: ${
          error.response.data.message || "Unknown error."
        }`,
      });
    } else if (error.request) {
      return res.status(500).json({ error: "No response from PhonePe API." });
    } else {
      return res
        .status(500)
        .json({ error: `Internal server error: ${error.message}` });
    }
  }
};

export const verifyPhonePePayment = async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    if (!transactionId) {
      return res
        .status()
        .send(new ApiError(400, "", "merchantTransactionId is required"));
    }
    const { statusUrl, xVerifyChecksum } =
      generateStatusChecksum(transactionId);
    const response = await axios.get(statusUrl, {
      headers: {
        accept: "application/json",
        "X-VERIFY": xVerifyChecksum,
        "X-MERCHANT-ID": `${merchantId}`,
        "Content-Type": "application/json",
      },
    });
    req.paymentResponse = response.data;
    next();
  } catch (error) {
    const data = {
      error_code: error?.code,
      ...error?.response?.data,
      url: error?.response?.config?.url,
      data: error?.response?.config?.data,
      method: error?.response?.config?.method,
    };
    console.log("PHONE PAY ERROR: ", data);
    req.paymentResponse = data;
    next();
  }
};
