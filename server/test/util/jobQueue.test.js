const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const mockDb = require('../../test/mock/mockDb');
const { nextMockJob } = require('../../test/mock/mockJob');
const { mockProcessJob } = require('../mock/mockProcessJob');

const { Job } = require('../../api/models/job');
const Type = require('../../api/models/type');
const Status = require('../../api/models/status');

const jobQueue = require('../../util/jobQueue');

const { expect } = chai;

chai.use(chaiAsPromised);

describe('Job Queue', () => {
  before(async () => {
    jobQueue.init(mockProcessJob);
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

  it('Push Job to Queue', (done) => {
    const job = nextMockJob(Type.ACI);
    Job.create(job)
      .then((createResult) => {
        jobQueue.push(createResult)
          .then((qJobResult) => {
            expect(qJobResult).to.have.all.keys('job', 'process');
            expect(qJobResult.job.status).to.be.string(Status.QUEUED);
            qJobResult.process
              .then((processResult) => {
                console.log(processResult);
                expect(processResult.status).to.be.string(Status.FINISHED);
                done();
              })
              .catch((processedErr) => { done(processedErr); });
          })
          .catch((err) => { console.log(err); });
      })
      .catch((err) => {
        done(err);
      });
  });
});
