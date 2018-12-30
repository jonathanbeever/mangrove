const http = require('http');
const config = require('config');

const conn = require('./util/db');
const app = require('./app');

const port = config.get('port') || 3000;
const server = http.createServer(app);

conn
  .open()
  .then(() => {
    server.listen(port, () => {
      // OK!
    });
  })
  .catch((err) => {
    console.log(err);
  });
