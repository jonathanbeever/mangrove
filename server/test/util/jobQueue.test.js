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
const { getCores, setCores } = require('../../util/storage');

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

function queueFirstJob(firstJob) {
  jobQueue.enqueue(firstJob);
}

function queueRestOfJobs(restOfJobs) {
  restOfJobs.forEach(
    (job) => {
      jobQueue.enqueue(job);
    },
  );
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

  it('Change number of cores', (done) => {
    setCores(1);
    expect(getCores()).to.be.equal(1);
    setCores(-1);
    expect(getCores()).to.be.equal(os.cpus().length);
    setCores(100);
    expect(getCores()).to.be.equal(os.cpus().length);
    done();
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
            done(err);
          });
      })
      .catch((err) => {
        jobQueue.destroy();
        done(err);
      });
  });

  it('Get Running Jobs and Free Slots Left', (done) => {
    const { jobs } = makeRandomJobs(getCores() + 1);

    jobQueue.init(mockFreezeJob)
      .then(() => {
        Job.insertMany(jobs)
          .then(async () => {
            const firstJob = jobs[0];
            const restOfJobs = jobs.splice(1);
            try {
              await queueFirstJob(firstJob);
              await lockUntilSpacesRemain(getCores() - 1);

              expect(jobQueue.getFreeSlots()).to.be.equal(getCores() - 1);
              expect(jobQueue.getRunningJobs().length).to.be.equal(1);

              await queueRestOfJobs(restOfJobs);
              await lockUntilSpacesRemain(0);

              expect(jobQueue.getFreeSlots()).to.be.equal(0);
              expect(jobQueue.getRunningJobs().length).to.be.equal(getCores());

              jobQueue.destroy();
              done();
            } catch (err) {
              done(err);
            }
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
      .catch(err => done(err));
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
