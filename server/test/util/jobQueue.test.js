const chai = require('chai');

const mockDb = require('../../test/mock/mockDb');
const { nextMockJob } = require('../../test/mock/mockJob');

const { Job } = require('../../api/models/job');
const Type = require('../../api/models/type');

const { makeRandomJobs, getCountOfPendingJobs } = require('./queueHelpers');
const jobQueue = require('../../util/jobQueue');

const { expect } = chai;

describe('Job Queue', () => {
  before(async () => {
    await mockDb.setup();
  });

  after(async () => {
    await mockDb.teardown();
  });

  beforeEach(async () => {
    await Job.deleteMany();
  });

  afterEach(async () => {
    await jobQueue.destroy();
  });

  it('Fail to Push to Uninitialized Queue', async () => {
    const job = {};
    try {
      await jobQueue.enqueue(job);
      expect.fail();
    } catch (err) {
      expect(err).to.be.an.instanceOf(Error);
    }
  });

  it('Fail to Enqueue Job, Not In Database', async () => {
    const job = nextMockJob(Type.ACI);
    await jobQueue.init();
    try {
      await jobQueue.enqueue(job);
      expect.fail();
    } catch (err) {
      expect(err).to.be.an.instanceOf(Error);
    }
  });

  it('Scan Database for Already Processing and Queued Jobs', async () => {
    const randomJobs = makeRandomJobs(50);
    const countOfStatus = randomJobs.tallyOfStatus;

    await Promise.all(randomJobs.jobs);
    await jobQueue.init();

    const runningJobs = await jobQueue.getRunningJobs();
    const { waiting, active, completed } = await jobQueue.getJobCounts();
    const pendingCount = waiting + active + completed;

    expect(runningJobs).to.be.an('array');
    expect(runningJobs[0]).to.be.an('Object');
    expect(runningJobs.length).to.eql(26);
    expect(pendingCount).to.be.eql(getCountOfPendingJobs(countOfStatus));
  });
});
