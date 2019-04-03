const config = require('config');
const Queue = require('bull');

const Status = require('../../api/models/status');
const {
  updateJob,
  getPendingJobs,
} = require('../../api/models/job/utils');
const settings = require('../settings');

const redis = config.get('redisConfig');
const cores = settings.value('cores');

function JobQueue() {
  this.queue = null;

  this.destroy = async () => {
    if (this.queue) {
      const clean = this.queue.clean.bind(this.queue, 0);
      await this.queue.pause();
      await clean('completed');
      await clean('failed');
      await clean('paused');
      await clean('active');
      await clean('delayed');
      await clean('failed');
      await this.queue.empty();
      await this.queue.close();
      this.queue = null;
    }
  };

  const createQueue = () => {
    this.queue = new Queue('job processing', { redis });
    this.queue.process(cores, `${__dirname}/processJob.js`);

    this.queue.on('active', (job) => {
      updateJob(job.data, { status: Status.PROCESSING });
    });
    this.queue.on('completed', (job, result) => {
      this.queue.clean(0, 'completed');
      updateJob(job.data, { status: Status.FINISHED, result });
    });
    this.queue.on('failed', (job, err) => {
      console.error(err);
      this.queue.clean(0, 'failed');
      updateJob(job.data, { status: Status.FAILED });
    });
    this.queue.on('stalled', (job) => {
      throw Error(`${job} has stalled`);
    });
  };

  const queuePendingJobs = async (pendingJobs) => {
    if (pendingJobs.length > 0) {
      const [job] = pendingJobs;
      const nextJobs = pendingJobs.splice(1);
      await this.enqueue(job);
      await queuePendingJobs(nextJobs);
    }
  };

  this.init = async () => {
    await createQueue();
    const pendingJobs = await getPendingJobs();
    await queuePendingJobs(pendingJobs);
    return this;
  };

  this.enqueue = async (job) => {
    if (!this.queue) throw new Error('Queue must be initialized');

    const updatedJob = await updateJob(job, { status: Status.QUEUED }, true);
    if (!updatedJob) throw new Error('Job must be made before it is queued');

    this.queue.add(updatedJob);

    return {
      ...updatedJob._doc,
      ...{ input: job.input, spec: job.spec },
    };
  };

  // TODO: Make a remove job function

  this.getJobCounts = () => {
    if (!this.queue) throw new Error('Queue must be initialized');
    return this.queue.getJobCounts();
  };

  this.getRunningJobs = () => {
    if (!this.queue) throw new Error('Queue must be initialized');
    return this.queue.getJobs();
  };
}

module.exports = new JobQueue();
