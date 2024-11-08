import crypto from "crypto";
import { phonepeConfig } from "../config/phonePayConfig.js";

const { merchantId, saltKey, SALT_INDEX, validateUrl } = phonepeConfig;

export const generateSignature = (payload) => {
  const bufferObj = Buffer.from(JSON.stringify(payload), "utf8");
  const base64EncodedPayload = bufferObj.toString("base64");
  const stringToHash = base64EncodedPayload + "/pg/v1/pay" + saltKey;
  const sha256Hash = crypto
    .createHash("sha256")
    .update(stringToHash)
    .digest("hex");
  const xVerifyChecksum = `${sha256Hash}###${SALT_INDEX}`;
  return { xVerifyChecksum, base64EncodedPayload };
};

export const generateStatusChecksum = (transactionId) => {
  const statusUrl = `${validateUrl}/${merchantId}/${transactionId}`;
  const string = `/pg/v1/status/${merchantId}/${transactionId}/${saltKey}`;
  const sha256Hash = crypto.createHash("sha256").update(string).digest("hex");
  const xVerifyChecksum = `${sha256Hash}###${SALT_INDEX}`;

  return { statusUrl, xVerifyChecksum };
};
