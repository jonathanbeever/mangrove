const http = require('http');
const config = require('config');

const conn = require('./util/db');
const app = require('./app');

const port = config.get('port') || 3000;
const server = http.createServer(app);

const jobQueue = require('./util/jobQueue');
const jobProcessor = require('./util/jobProcessor');

conn
  .open()
  .then(() => {
    jobQueue.init(jobProcessor.process)
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
