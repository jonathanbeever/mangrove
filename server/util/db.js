const mongoose = require('mongoose');
const config = require('config');

const dbConfig = config.get('dbConfig');

const uri = () => {
  if (process.env.DOCKER_MANGROVE === 'yes') {
    return `mongodb://${dbConfig.host.docker}:${dbConfig.port}/${dbConfig.dbName}`;
  }
  return `mongodb://${dbConfig.host.local}:${dbConfig.port}/${dbConfig.dbName}`;
};

mongoose.Promise = global.Promise;
// FIXME: This setting is used to remove a deprecation warning. We *should* be
// able to be removed upon upgrade to Mongoose 6.0.0 For more info, see
// https://github.com/Automattic/mongoose/issues/6880
mongoose.set('useFindAndModify', false);

const open = async () => {
  await mongoose.connect(uri(), { useNewUrlParser: true });
};

const close = () => mongoose.disconnect();

module.exports = { uri, open, close };
