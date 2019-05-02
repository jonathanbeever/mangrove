const winston = require('winston');

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple(),
    winston.format.errors({ stack: true }),
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

module.exports = logger;
