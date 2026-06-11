import * as winston from 'winston';
import 'winston-daily-rotate-file';

// Helper function to get Vietnam Time (ICT - UTC+7) in ISO format
const vietnamTimestamp = () => {
  return new Intl.DateTimeFormat('sv-SE', {
    // 'sv-SE' outputs YYYY-MM-DD HH:mm:ss format natively
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date());
  // Result format: 2026-06-11T17:28:03+07:00
};

export const winstonConfig = {
  transports: [
    // 1. Console transport for local development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: vietnamTimestamp }),
        winston.format.ms(),
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, context, ms }) => {
          return `${timestamp} ${level} [${context || 'App'}] ${message} ${ms}`;
        }),
      ),
    }),

    // 2. Combined logs file transport (for VPS)
    new winston.transports.DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true, // Compresses old log files
      maxSize: '20m', // Rotates file if it exceeds 20MB
      maxFiles: '14d', // Automatically deletes logs older than 14 days
      format: winston.format.combine(
        winston.format.timestamp({ format: vietnamTimestamp }),
        winston.format.json(), // JSON is perfect for parsing in production
      ),
    }),

    // 3. Separate file for errors only (makes troubleshooting faster)
    new winston.transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d', // Keep errors a bit longer
      format: winston.format.combine(
        winston.format.timestamp({ format: vietnamTimestamp }),
        winston.format.json(),
      ),
    }),
  ],
};
