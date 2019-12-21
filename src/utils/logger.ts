import { createLogger, format, transports } from "winston";
import { getPath } from "./getPath";

export const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(
          (info) =>
            `[${((info as unknown) as { timestamp: string }).timestamp.replace(
              " ",
              "] ["
            )}] ${info.level}: ${info.message}`
        )
      ),
    }),
    new transports.File({ filename: getPath("logs", "combined.log") }),
    new transports.File({
      filename: getPath("logs", "error.log"),
      level: "error",
    }),
    new transports.File({
      filename: getPath("logs", "info.log"),
      level: "info",
    }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: getPath("logs", "exceptions.log") }),
  ],
  exitOnError: false,
});
