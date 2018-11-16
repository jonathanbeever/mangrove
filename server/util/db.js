const mongoose = require('mongoose');
const config = require('config');

const dbConfig = config.get('dbConfig');
const uri = `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.dbName}`;

mongoose.Promise = global.Promise;

function open() {
  return new Promise((resolve, reject) => {
    mongoose.connect(uri, { useNewUrlParser: true }, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

function close() {
  return mongoose.disconnect();
}

module.exports = { uri, open, close };
