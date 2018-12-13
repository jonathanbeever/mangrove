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

  describe('/GET specs', () => {
    it('It should GET all the Specs (none)', (done) => {
      chai.request(app)
        .get('/specs')
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.count).to.be.eql(0);
          expect(res.body.specs).to.be.an('array');
          expect(res.body.specs).to.be.empty;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
