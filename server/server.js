const http = require('http');

const config = require('config');

const dbConnection = require('./util/db');
const app = require('./app');
const jobQueue = require('./util/jobQueue');

const port = config.get('port');
const server = http.createServer(app);

global.jobQueue = jobQueue;

async function gracefulShutdown() {
  process.stdout.write('Closing HTTP server...');
  await server.close();
  process.stdout.write('  \tOK\n');
  process.stdout.write('Closing job queue...');
  await global.jobQueue.destroy();
  process.stdout.write('\t\tOK\n');
  process.stdout.write('Closing database connection...');
  await dbConnection.close();
  process.stdout.write('\tOK\n');
  process.stdout.write('Successfully exited Mangrove server\n');
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
    process.stdout.write('Starting Mangrove server...');
    await dbConnection.open();
    await global.jobQueue.init();

    server.listen(port, () => process.stdout.write(' Ready\n'));
  } catch (err) {
    console.error(err);
    gracefulShutdown();
    process.exitCode = 1;
  }
})();
