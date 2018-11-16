const chai = require('chai');
const chaiHttp = require('chai-http');

const mockDb = require('./util/mockDb');
// const { nextMockSpec } = require('./util/mockDbModel');

const app = require('../app');

const { Spec } = require('../api/models/spec');

const { expect } = chai;

chai.use(chaiHttp);

describe('Specs', () => {
  before(async () => {
    await mockDb.setup();
  });

  after(async () => {
    await mockDb.teardown();
  });

  beforeEach((done) => {
    Spec.deleteMany({}, (err) => {
      done();
    });
  });
});
