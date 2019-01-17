const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const mockDb = require('../../test/mock/mockDb');
const { nextMockJob } = require('../../test/mock/mockJob');
const { mockProcessJob, mockResult, mockFreezeJob } = require('../mock/mockProcessJob');

const { Job } = require('../../api/models/job');
const Type = require('../../api/models/type');
const Status = require('../../api/models/status');

const { makeRandomJobs, getAwaitingJobs } = require('./queueHelpers');
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


describe('Auxiliary Queue Functions', () => {
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
    const randomJobs = makeRandomJobs(50);
    const countOfStatus = randomJobs.statusCounter;


    Job.insertMany(randomJobs.jobs)
      .then(() => {
        jobQueue.init(mockFreezeJob)
          .then((queue) => {
            expect(queue.running() + queue.length())
              .to.be.eql(getAwaitingJobs(countOfStatus));
            jobQueue.uninit();
            done();
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
  });

  it('Uninitialize the queue', (done) => {
    jobQueue.init(mockFreezeJob)
      .then(() => {
        expect(jobQueue.queue).to.be.not.null;
        jobQueue.uninit();
        expect(jobQueue.queue).to.be.null;
        done();
      })
      .catch(err => done(err));
  });

  it('Get running Jobs and Free slots left', (done) => {
    const { jobs } = makeRandomJobs(options.cores + 1);

    jobQueue.init(mockFreezeJob)
      .then(() => {
        Job.insertMany(jobs)
          .then(() => {
            const firstJob = jobs[0];
            const restofJobs = jobs.splice(1);
            jobQueue.enqueue(firstJob)
              .then(() => {
                setTimeout(() => {
                  expect(jobQueue.getFreeSlots()).to.be.eql(options.cores - 1);
                  expect(jobQueue.getRunningJobs().length).to.be.eql(1);
                  let numQueued = 0;
                  restofJobs.forEach(
                    (job) => {
                      jobQueue.enqueue(job)
                        .then(() => {
                          numQueued += 1;
                          if (numQueued === options.cores) {
                            setTimeout(() => {
                              expect(jobQueue.getFreeSlots()).to.be.eql(0);
                              expect(jobQueue.getRunningJobs().length).to.be.eql(options.cores);
                              expect(jobQueue.getRunningJobs().length + jobQueue.queue.length())
                                .to.be.be.eql(options.cores + 1);
                              jobQueue.uninit();
                              done();
                            }, 1000);
                          }
                        })
                        .catch(err => done(err));
                    },
                  );
                }, 1000);
              })
              .catch(err => done(err));
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
  });
});
