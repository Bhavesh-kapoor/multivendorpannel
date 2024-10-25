import mongoose from "mongoose";
import winston from "winston";
import { config } from "dotenv";

config();


const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [new winston.transports.Console()],
});

const connectDB = async () => {
  try {
    if (!process.env.DB_URL || !process.env.DB_NAME) {
      throw new Error(
        "Database connection details are missing in environment variables."
      );
    }

    await mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`);
    logger.info("Successfully connected to the database.");

  }
  catch (err) {
    logger.error(`Database connection failed: ${err.message}`);
    process.exit(1); // Exit the process with failure


  }
}

export default connectDB;