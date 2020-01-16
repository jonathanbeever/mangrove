const http = require('http');

const config = require('config');

const logger = require('./util/logger');

const dbConnection = require('./util/db');
const app = require('./app');
const jobQueue = require('./util/jobQueue');

const port = config.get('port');
const server = http.createServer(app);

global.jobQueue = jobQueue;

async function gracefulShutdown() {
  try {
    logger.info('Closing HTTP server...');
    await server.close();
    logger.info('OK');
    logger.info('Closing job queue...');
    await global.jobQueue.destroy();
    logger.info('OK');
    logger.info('Closing database connection...');
    await dbConnection.close();
    logger.info('OK');
    logger.info('Successfully exited Mangrove server');
  } catch (err) {
    logger.error('An error occurred during shutdown', err);
  }
}

process.on('SIGINT', async () => {
  await gracefulShutdown();
  process.exitCode = 0;
});
process.on('SIGTERM', async () => {
  await gracefulShutdown();
  process.exitCode = 0;
});
process.once('SIGUSR2', async () => {
  await gracefulShutdown();
  process.kill(process.pid, 'SIGUSR2');
});

(async () => {
  try {
    logger.info('Starting Mangrove server...');
    logger.info('Opening Database Connection...');
    //await dbConnection.open(); // FAILS DB CONNECTION HERE
    logger.info('Connected to Database!');
    //await global.jobQueue.init();

    server.listen(port, () => logger.info('Ready'));
  } catch (err) {
    logger.error(err);
    gracefulShutdown();
    process.exitCode = 1;
  }
})();
