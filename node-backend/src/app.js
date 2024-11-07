import "colors";
import cors from "cors";
import colors from "colors";
import helmet from "helmet";
import express from "express";
import { logger } from "./config/logger.js";
import integratedroutes from "./routes/integrated.route.js";
import { corsOptions } from "./middleware/corsMiddleware.js";

const app = express();

// Middleware
app.use(helmet());
app.use(cors(corsOptions));

// Middleware for parsing JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging Middleware
app.use((req, res, next) => {
  const startTime = process.hrtime();
  res.on("finish", () => {
    const fetchStatus = () => {
      if (res.statusCode >= 500) return colors.red(`${res.statusCode}`);
      else if (res.statusCode >= 400) return colors.yellow(`${res.statusCode}`);
      else if (res.statusCode >= 300) return colors.cyan(`${res.statusCode}`);
      else if (res.statusCode >= 200) return colors.green(`${res.statusCode}`);
      else return colors.white(`${res.statusCode}`);
    };
    const diff = process.hrtime(startTime);
    const responseTime = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
    logger.info(
      `${"METHOD:".blue} ${req.method.yellow} - ${"URL:".blue} ${
        req.originalUrl.yellow
      } - ${"STATUS:".blue} ${fetchStatus()} - ${"Response Time:".blue} ${
        responseTime.magenta
      } ${"ms".magenta}`
    );
  });
  next();
});

// Handle API Routes
app.use("/api", integratedroutes);

export default app;
