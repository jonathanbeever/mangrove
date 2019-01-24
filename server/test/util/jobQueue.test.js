const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const mockDb = require('../../test/mock/mockDb');
const { nextMockJob } = require('../../test/mock/mockJob');
const { mockProcessJob, mockResult, mockFreezeJob } = require('../mock/mockProcessJob');

const { Job } = require('../../api/models/job');
const Type = require('../../api/models/type');
const Status = require('../../api/models/status');

const { updateJob } = require('../../api/models/job/utils');
const { makeRandomJobs, getCountOfPendingJobs, testJobs } = require('./queueHelpers');
const jobQueue = require('../../util/jobQueue');
const { options } = require('../../util/queue_options');

const { expect, assert } = chai;

chai.use(chaiAsPromised);

describe('Job Queue', () => {
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

  it('Fail to Push to Uninitialized Queue', (done) => {
    const [job] = makeRandomJobs(1).jobs;
    assert.isRejected(jobQueue.enqueue(job), Error, 'JobQueue has not been initialized.');
    done();
  });

  it('Fail to Enqueue Job, Not In Database', (done) => {
    const [job] = makeRandomJobs(1).jobs;

    jobQueue.init().then(() => {
      assert.isRejected(jobQueue.enqueue(job), Error, 'Job must be made before it is queued');
      jobQueue.destroy();
      done();
    });
  });

  it('Scan Database for Already Proccesing and Queued Jobs', (done) => {
    const randomJobs = makeRandomJobs(50);
    const countOfStatus = randomJobs.statusCounter;

    Job.insertMany(randomJobs.jobs)
      .then(() => {
        jobQueue.init(mockFreezeJob)
          .then((queue) => {
            expect(queue.running() + queue.length())
              .to.be.eql(getCountOfPendingJobs(countOfStatus));
            jobQueue.destroy();
            done();
          })
          .catch((err) => {
            jobQueue.destroy();
            return done(err);
          });
      })
      .catch((err) => {
        jobQueue.destroy();
        return done(err);
      });
  });

  it('Get Running Jobs and Free Slots Left', (done) => {
    const { jobs } = makeRandomJobs(options.cores + 1);

    jobQueue.init(mockFreezeJob)
      .then(() => {
        Job.insertMany(jobs)
          .then(() => {
            testJobs(jobQueue, jobs, done);
          })
          .catch((err) => {
            jobQueue.destroy();
            return done(err);
          });
      })
      .catch((err) => {
        jobQueue.destroy();
        return done(err);
      });
  });


  it('Push Job to Queue', (done) => {
    const job = nextMockJob(Type.ACI);
    jobQueue.init(mockProcessJob);
    Job.create(job)
      .then((createResult) => {
        jobQueue.enqueue(createResult)
          .then((qJobResult) => {
            expect(qJobResult).to.have.all.keys('job', 'process');
            expect(qJobResult.job.status).to.be.string(Status.QUEUED);
            expect(qJobResult.process)
              .to.eventually.include({ status: Status.FINISHED }, { result: mockResult })
              .notify(done);
          });
      });
  });

  it('Destroy the Queue', (done) => {
    jobQueue.init(mockFreezeJob)
      .then(() => {
        expect(jobQueue.queue).to.be.not.null;
        jobQueue.destroy();
        expect(jobQueue.queue).to.be.null;
        done();
      })
      .catch((err) => {
        jobQueue.destroy();
        return done(err);
      });
  });
});
