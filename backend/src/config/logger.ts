import pino from 'pino';
import { hostname } from 'os';

// Create the logger configuration
const loggerConfig = {
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  // In development, use pino-pretty for human-readable logs
  transport: process.env.NODE_ENV !== 'production' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
      ignore: 'pid,hostname',
    }
  } : undefined,
  // Base fields to include in all logs
  base: {
    pid: process.pid,
    hostname: hostname(),
  },
  // Timestamp format
  timestamp: pino.stdTimeFunctions.isoTime,
};

export const logger = pino(loggerConfig);

export default logger; 