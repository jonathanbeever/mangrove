const mongoose = require('mongoose');
const { Mockgoose } = require('mockgoose');

const mockgoose = new Mockgoose(mongoose);
const { uri } = require('../../util/db');

const setup = async () => {
  await mockgoose.prepareStorage();
  await mongoose.connect(uri, { useNewUrlParser: true });
};

const teardown = async () => {
  await mockgoose.shutdown();
};

module.exports = { setup, teardown };
