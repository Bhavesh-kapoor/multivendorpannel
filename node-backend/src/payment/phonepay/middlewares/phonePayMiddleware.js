import crypto from "crypto";
import { phonepeConfig } from "../config/phonePayConfig.js";

export const generateSignature = (payload) => {
  const hash = crypto
    .createHmac("sha256", phonepeConfig.saltKey)
    .update(payload)
    .digest("hex");
  return hash;
};
