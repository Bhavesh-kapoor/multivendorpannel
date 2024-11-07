import "colors";
import winston from "winston";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: () => {
        const now = new Date();
        return now.toLocaleString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });
      },
    }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp.grey} ${level.yellow}: ${message}`;
    })
  ),
  transports: [new winston.transports.Console()],
});
