import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";

const logDir = path.join(process.cwd(), "logs");
//consoleInfo("logDir: ", logDir);

const fileTransport = new DailyRotateFile({
  dirname: logDir,
  filename: "client-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxSize: "5m",
  maxFiles: "10",
});

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(
      ({ timestamp, level, message }) =>
        `${timestamp} [${level.toUpperCase()}] ${message}`
    )
  ),
  transports: [
    fileTransport,
    new winston.transports.Console(),
  ],
});