import mysql from "mysql2/promise";
import {
  MYSQL_DB_NAME,
  MYSQL_HOST,
  MYSQL_PASSWORD,
  MYSQL_USER,
} from "../constants.js";
import ApiError from "../utils/apiErrors.js";

let connection; // Global connection variable

const connectToDatabase = async (req, res) => {
  try {
    // If there is already a connection, use it
    if (!connection) {
      connection = await mysql.createConnection({
        host: MYSQL_HOST,
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DB_NAME,
        port: 8889,
      });

      console.log("DATABASE CONNECTED!");
    }
  } catch (err) {
    // Call next with an error to use your error handling middleware
    throw new ApiError(501, "Database connection failed", err);
  }
};

export { connectToDatabase, connection };
