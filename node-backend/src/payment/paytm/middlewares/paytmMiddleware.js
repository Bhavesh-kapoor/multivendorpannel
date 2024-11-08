import crypto from "crypto";

export const generateSignature = (params, key) => {
  const data = Object.keys(params)
    .sort()
    .map((key) => params[key])
    .join("|");
  return crypto.createHmac("sha256", key).update(data).digest("hex");
};

export const verifySignature = (params, signature, key) => {
  const generatedSignature = generateSignature(params, key);
  return generatedSignature === signature;
};
