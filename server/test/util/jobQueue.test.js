const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const mockDb = require('../../test/mock/mockDb');
const { nextMockJob } = require('../../test/mock/mockJob');
const { mockProcessJob, mockResult, mockFreezeJob } = require('../mock/mockProcessJob');

const { Job } = require('../../api/models/job');
const Type = require('../../api/models/type');
const Status = require('../../api/models/status');

const { makeRandomJobs, printCountsWithNames, getAwaitingJobs } = require('./queueHelpers');
const jobQueue = require('../../util/jobQueue');
const { options } = require('../../util/queue_options');

const { expect } = chai;

chai.use(chaiAsPromised);

describe('Job Queue', () => {
  before(async () => {
    jobQueue.init(mockProcessJob);
    await mockDb.setup();
  });

  after(async () => {
    jobQueue.uninit();
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
        jobQueue.enqueue(createResult)
          .then((qJobResult) => {
            expect(qJobResult).to.have.all.keys('job', 'process');
            expect(qJobResult.job.status).to.be.string(Status.QUEUED);
            qJobResult.process
              .then((processResult) => {
                expect(processResult.status).to.be.string(Status.FINISHED);
                expect(processResult.result).to.be.eql(mockResult);
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


describe('Scan on Start', () => {
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


  it('Scan Database for already Proccesing and Queued Jobs', (done) => {
    const randomJobs = makeRandomJobs(5);
    const countOfStatus = randomJobs.statusCounter;


    Job.insertMany(randomJobs.jobs)
      .then(() => {
        jobQueue.init(mockFreezeJob)
          .then((queue) => {
            expect(queue.running() + queue.length())
              .to.be.eql(getAwaitingJobs(countOfStatus, options.cores));
            done();
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
  });
});
