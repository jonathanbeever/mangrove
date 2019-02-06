const http = require('http');
const config = require('config');

const conn = require('./util/db');
const app = require('./app');

const port = config.get('port') || 3000;
const server = http.createServer(app);

const jobQueue = require('./util/jobQueue');

conn
  .open()
  .then(async () => {
    try {
      const initQueue = await jobQueue.init();
      global.jobQueue = initQueue;
      server.listen(port, () => {
        // OK
      });
    } catch (err) {
      console.log(err);
    }
  })
  .catch((err) => {
    console.log(err);
  });
