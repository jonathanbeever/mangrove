const mongoose = require('mongoose');
const { Mockgoose } = require('mockgoose');

const mockgoose = new Mockgoose(mongoose);
const { uri } = require('../../util/db');

// The asynchronous structure of this code is necessary due to conflict between
// Mocha 4+ and Mockgoose. For more information, see this link:
//   https://github.com/Mockgoose/Mockgoose/issues/71
// Until Mockgoose receives necessary updates, it should remain in place.

async function setup() {
  await mockgoose.prepareStorage();
  await mongoose.connect(uri, { useNewUrlParser: true });
}

async function teardown() {
  await mockgoose.helper.reset();
  await mongoose.disconnect();
  const retval = new Promise((resolve) => {
    mockgoose.mongodHelper.mongoBin.childProcess.on('exit', resolve);
  });
  mockgoose.mongodHelper.mongoBin.childProcess.kill('SIGTERM');
  return retval;
}

module.exports = { setup, teardown };
