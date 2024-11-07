import "colors";
import figlet from "figlet";
import { config } from "dotenv";
import mongoose from "mongoose";
import { logger } from "../config/logger.js";

config();

const connectDB = async () => {
  try {
    if (!process.env.DB_URL || !process.env.DB_NAME) {
      throw new Error(
        "Database connection details are missing in environment variables."
      );
    }
    await mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`);
    figlet("DB Connected!", (err, data) => {
      if (err) {
        logger.error("Something went wrong with figlet...");
        return;
      }
      logger.info(`\n${data.yellow}`);
    });
  } catch (err) {
    logger.error(`Database connection failed: ${err.message}`);
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;
