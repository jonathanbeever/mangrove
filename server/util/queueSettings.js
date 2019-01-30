const os = require('os');
const settings = require('./settings');

const setCores = async (numCores, queue = null) => {
  if (queue !== null) {
    await queue.pause();
  }
  if (numCores > os.cpus().length) {
    settings.setValue('cores', os.cpus().length);
  } else if (numCores <= 0) {
    settings.setValue('cores', 1);
  } else {
    settings.setValue('cores', numCores);
  }
  if (queue !== null) {
    await queue.pause();
  }
};


module.exports = { setCores };
