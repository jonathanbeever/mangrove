const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const mockDb = require('../../test/mock/mockDb');
const { nextMockJob } = require('../../test/mock/mockJob');

const { Job } = require('../../api/models/job');
const Type = require('../../api/models/type');

const { makeRandomJobs, getCountOfPendingJobs } = require('./queueHelpers');
const jobQueue = require('../../util/jobQueue');

const { expect } = chai;

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

  afterEach(async () => {
    await jobQueue.destroy();
  });

  it('Fail to Push to Uninitialized Queue', (done) => {
    const job = {};
    expect(jobQueue.enqueue(job)).to.be.rejectedWith(Error).notify(done);
  });

  it('Fail to Enqueue Job, Not In Database', (done) => {
    const job = nextMockJob(Type.ACI)._doc;
    jobQueue.init()
      .then(() => {
        expect(jobQueue.enqueue(job)).to.be.rejectedWith(Error).notify(done);
      });
  });

  it('Scan Database for Already Proccesing and Queued Jobs', (done) => {
    const randomJobs = makeRandomJobs(50);
    const countOfStatus = randomJobs.tallyOfStatus;

    Promise.all(randomJobs.jobs)
      .then(() => {
        jobQueue.init()
          .then(() => {
            jobQueue.getRunningJobs()
              .then((jobs) => {
                jobQueue.getJobCounts().then((jobCounts) => {
                  const pendingCount = jobCounts.waiting + jobCounts.active + jobCounts.completed;
                  expect(pendingCount).to.be.eql(getCountOfPendingJobs(countOfStatus));
                  done();
                });
              });
          })
          .catch((err) => {
            jobQueue.destroy();
            console.log(err);
            done(err);
          });
      });
  });
});
