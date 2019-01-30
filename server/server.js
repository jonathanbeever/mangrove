const http = require('http');
const config = require('config');

const conn = require('./util/db');
const app = require('./app');

const port = config.get('port') || 3000;
const server = http.createServer(app);

const jobQueue = require('./util/jobQueue');
const { mockProcessJob } = require('./test/mock/mockProcessJob');

conn
  .open()
  .then(() => {
    // TODO: Replace mockProcess with real Process
    jobQueue.init(mockProcessJob)
      .then((initQueue) => {
        global.jobQueue = initQueue;
        server.listen(port, () => {
          // OK!
        });
      });
  })
  .catch((err) => {
    console.log(err);
  });
