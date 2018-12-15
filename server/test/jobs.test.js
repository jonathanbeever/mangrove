const chai = require('chai');
const chaiHttp = require('chai-http');

const { ObjectId } = require('mongoose').Types;

const mockDb = require('./util/mockDb');
const { nextMockJob, nextMockJobCreateJson } = require('./util/mockJob');
const { nextMockObjectId } = require('./util/mockObjectId');

const app = require('../app');

const { Job } = require('../api/models/job');
const Type = require('../api/models/type');
const Status = require('../api/models/status');

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

  describe('/GET all Jobs', () => {
    it('It should GET all Jobs (none)', (done) => {
      chai.request(app)
        .get('/jobs')
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.all.keys('count', 'jobs');
          expect(res.body.count).to.be.eql(0);
          expect(res.body.jobs).to.be.an('array');
          expect(res.body.jobs).to.be.empty;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('It should GET all Jobs (many)', (done) => {
      const jobs = [];
      jobs.push(nextMockJob(Type.ACI, Status.CANCELLED));
      jobs.push(nextMockJob(Type.ADI, Status.FAILED));
      jobs.push(nextMockJob(Type.AEI, Status.FINISHED));
      jobs.push(nextMockJob(Type.BI, Status.PROCESSING));
      jobs.push(nextMockJob(Type.NDSI, Status.QUEUED));
      jobs.push(nextMockJob(Type.RMS, Status.QUEUED));

      Job.insertMany(jobs)
        .then(() => {
          chai.request(app)
            .get('/jobs')
            .then((res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.be.an('object');
              expect(res.body).to.have.all.keys('count', 'jobs');
              expect(res.body.count).to.be.eql(jobs.length);
              expect(res.body.jobs).to.be.an('array');
              expect(res.body.jobs).to.have.lengthOf(jobs.length);
              res.body.jobs.forEach((job) => {
                expect(job).to.have.any.keys('status');
                expect(job.status).to.be.a('string');
                expect(job.status).to.be.oneOf(Object.values(Status));
                if (job.status !== Status.FINISHED) {
                  expect(job).to.have.all.keys(
                    'jobId',
                    'type',
                    'input',
                    'spec',
                    'author',
                    'creationTimeMs',
                    'status',
                  );
                } else {
                  expect(job).to.have.all.keys(
                    'jobId',
                    'type',
                    'input',
                    'spec',
                    'author',
                    'creationTimeMs',
                    'status',
                    'result',
                  );
                  expect(job.result).to.be.an('null'); // TODO: 'object'
                }
                expect(job.jobId).to.be.a('string');
                expect(ObjectId(job.jobId).toString()).to.equal(job.jobId);
                expect(job.type).to.be.a('string');
                expect(job.type).to.be.oneOf(Object.values(Type));
                expect(job.input).to.be.a('string');
                expect(ObjectId(job.input).toString()).to.equal(job.input);
                expect(job.spec).to.be.a('string');
                expect(ObjectId(job.spec).toString()).to.equal(job.spec);
                expect(job.author).to.be.a('string');
                expect(job.creationTimeMs).to.be.a('number');
              });
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
