import crypto from "crypto";

/**
 * Generates a checksum signature for Paytm request/response
 * @param {Object} params - The parameters for the Paytm transaction.
 * @param {String} key - The merchant's secret key (merchantKey).
 * @returns {String} - The checksum (signature) generated.
 */
export const generateSignature = (params, key) => {
  // Sort the parameters by key
  const data = Object.keys(params)
    .sort()
    .map((key) => params[key]) // Get the parameter values
    .join("|"); // Join the values with pipe ('|') separator

  // Create the HMAC using SHA-256 and the merchant secret key
  return crypto.createHmac("sha256", key).update(data).digest("hex");
};

/**
 * Verifies the checksum signature for Paytm request/response
 * @param {Object} params - The parameters for the Paytm transaction.
 * @param {String} signature - The signature to verify (usually the CHECKSUMHASH parameter).
 * @param {String} key - The merchant's secret key (merchantKey).
 * @returns {Boolean} - Returns true if the signature is valid, false otherwise.
 */
export const verifySignature = (params, signature, key) => {
  // Generate the checksum from the received parameters
  const generatedSignature = generateSignature(params, key);

  // Compare the generated signature with the received signature (checksum)
  return generatedSignature === signature;
};
