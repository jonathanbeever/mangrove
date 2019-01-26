const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const os = require('os');

const mockDb = require('../../test/mock/mockDb');
const { nextMockJob } = require('../../test/mock/mockJob');
const { mockProcessJob, mockResult, mockFreezeJob } = require('../mock/mockProcessJob');

const { Job } = require('../../api/models/job');
const Type = require('../../api/models/type');
const Status = require('../../api/models/status');

const { makeRandomJobs, getCountOfPendingJobs } = require('./queueHelpers');
const jobQueue = require('../../util/jobQueue');
const { setCores } = require('../../util/storage');
const settings = require('../../util/settings');

const { expect } = chai;

chai.use(chaiAsPromised);

function lock(resolve, freeSlotsWanted) {
  setTimeout(() => {
    if (jobQueue.getFreeSlots() === freeSlotsWanted) {
      resolve();
    } else {
      lock(resolve, freeSlotsWanted);
    }
  }, 500);
}

function lockUntilSpacesRemain(freeSlotsWanted) {
  return new Promise((resolve) => {
    lock(resolve, freeSlotsWanted);
  });
}

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
    expect(jobQueue.enqueue(job)).to.be.rejectedWith(Error).notify(done);
  });

  it('Fail to Enqueue Job, Not In Database', (done) => {
    const [job] = makeRandomJobs(1).jobs;

    jobQueue.init().then(async () => {
      await expect(jobQueue.enqueue(job)).to.be.rejectedWith(Error);
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
              .to.be.equal(getCountOfPendingJobs(countOfStatus));
            jobQueue.destroy();
            done();
          })
          .catch((err) => {
            jobQueue.destroy();
            console.log(err);
            done(err);
          });
      })
      .catch((err) => {
        jobQueue.destroy();
        console.log(err);
        done(err);
      });
  });

  it('Get Running Jobs and Free Slots Left', (done) => {
    const { jobs } = makeRandomJobs(settings.value('cores') + 1);

    jobQueue.init(mockFreezeJob)
      .then(() => {
        Job.insertMany(jobs)
          .then(async () => {
            const [firstJob] = jobs;
            const restOfJobs = jobs.splice(1);
            try {
              await jobQueue.enqueue(firstJob);
              await lockUntilSpacesRemain(settings.value('cores') - 1);

              expect(jobQueue.getFreeSlots()).to.be.equal(settings.value('cores') - 1);
              expect(jobQueue.getRunningJobs().length).to.be.equal(1);

              restOfJobs.forEach(async job => jobQueue.enqueue(job));
              await lockUntilSpacesRemain(0);

              expect(jobQueue.getFreeSlots()).to.be.equal(0);
              expect(jobQueue.getRunningJobs().length).to.be.equal(settings.value('cores'));

              jobQueue.destroy();
              done();
            } catch (err) {
              console.log(err);
              done(err);
            }
          })
          .catch((err) => {
            jobQueue.destroy();
            console.log(err);
            done(err);
          });
      })
      .catch((err) => {
        jobQueue.destroy();
        console.log(err);
        done(err);
      });
  });


  it('Push Job to Queue', (done) => {
    const job = nextMockJob(Type.ACI);
    jobQueue.init(mockProcessJob)
      .then(() => {
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
      })
      .catch((err) => {
        console.log(err);
        done(err);
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
        console.log(err);
        done(err);
      });
  });
});
