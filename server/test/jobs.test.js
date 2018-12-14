const chai = require('chai');
const chaiHttp = require('chai-http');

const mockDb = require('./util/mockDb');
const { nextMockJob } = require('./util/mockDbModel');

const app = require('../app');

const { Job } = require('../api/models/job');
const Type = require('../api/models/type');

const { expect } = chai;

chai.use(chaiHttp);

describe('Jobs', () => {
  before(async () => {
    await mockDb.setup();
  });

  after(async () => {
    await mockDb.teardown();
  });

  beforeEach((done) => {
    Job.deleteMany({}, (err) => {
      done();
    });
  });

  describe('/GET jobs', () => {
    it('It should GET all the Jobs (none)', (done) => {
      chai.request(app)
        .get('/jobs')
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.count).to.be.eql(0);
          expect(res.body.jobs).to.be.an('array');
          expect(res.body.jobs).to.be.empty;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('It should GET all the Jobs (many)', (done) => {
      const jobs = [];
      jobs.push(nextMockJob(Type.ACI));
      jobs.push(nextMockJob(Type.ADI));
      jobs.push(nextMockJob(Type.AEI));
      jobs.push(nextMockJob(Type.BI));
      jobs.push(nextMockJob(Type.NDSI));
      jobs.push(nextMockJob(Type.RMS));

      Job.insertMany(jobs)
        .then(() => {
          chai.request(app)
            .get('/jobs')
            .then((res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.be.an('object');
              expect(res.body.count).to.be.eql(jobs.length);
              expect(res.body.jobs).to.be.an('array');
              expect(res.body.jobs).to.have.lengthOf(jobs.length);
              // TODO: Test the content of each member of res.body.jobs
              done();
            })
            .catch((err) => {
              done(err);
            });
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
