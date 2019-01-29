const mongoose = require('mongoose');
const { Mockgoose } = require('mock-mongoose');

const mockgoose = new Mockgoose(mongoose);
const { uri } = require('../../util/db');

const jobQueue = require('../../util/jobQueue');
const { mockProcessJob } = require('./mockProcessJob');

// The asynchronous structure of this code is necessary due to conflict between
// Mocha 4+ and Mockgoose. For more information, see this link:
//   https://github.com/Mockgoose/Mockgoose/issues/71
// Until Mockgoose receives necessary updates, it should remain in place.

async function setup() {
  await mockgoose.prepareStorage();
  await mongoose.connect(uri, { useNewUrlParser: true });
  global.globalQueue = await jobQueue.init(mockProcessJob);
}

async function teardown() {
  await mockgoose.helper.reset();
  await mongoose.disconnect();
  if (global.globalQueue) {
    await global.globalQueue.destroy();
  }
  const retval = new Promise((resolve) => {
    mockgoose.mongodHelper.mongoBin.childProcess.on('exit', resolve);
  });
  mockgoose.mongodHelper.mongoBin.childProcess.kill('SIGTERM');
  return retval;
}

module.exports = { setup, teardown };
