import pino from 'pino';
import { hostname } from 'os';

// Detect if running under PM2 or in an environment that needs JSON logs
const isProduction = process.env.NODE_ENV === 'production';
const isPM2 = process.env.PM2_HOME !== undefined || process.env.pm_id !== undefined;
const isLogAggregation = process.env.LOKI_ENABLED === 'true' || process.env.LOG_FORMAT === 'json';

// Use pretty printing only in development and not under PM2 or log aggregation
const shouldUsePretty = !isProduction && !isPM2 && !isLogAggregation;

// Create the logger configuration
const loggerConfig = {
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  // Use pino-pretty only in local development
  transport: shouldUsePretty ? {
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
    service: 'VotingTool',
  },
  // Timestamp format
  timestamp: pino.stdTimeFunctions.isoTime,
};

export const logger = pino(loggerConfig);

export default logger; 