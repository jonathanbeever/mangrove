const Queue = require('bull');
const Status = require('../api/models/status');
const {
  updateJob,
  getPendingJobs,
} = require('../api/models/job/utils');
const { value } = require('./settings');

function JobQueue() {
  this.queue = null;

  this.destroy = () => new Promise((resolve) => {
    if (this.queue) {
      const clean = this.queue.clean.bind(this.queue, 0);
      this.queue.pause()
        .then(() => clean('completed'))
        .then(() => clean('failed'))
        .then(() => clean('paused'))
        .then(() => clean('active'))
        .then(() => clean('delayed'))
        .then(() => clean('failed'))
        .then(() => this.queue.empty())
        .then(() => this.queue.close())
        .then(() => {
          this.queue = null;
          resolve();
        });
    } else {
      resolve();
    }
  });

  const createQueue = () => {
    this.queue = new Queue('job processing');
    this.queue.process(value('cores'), `${__dirname}/processor.js`);

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

  const queueHelper = (resolve, reject, pendingJobs) => {
    if (pendingJobs.length === 0) {
      resolve();
    } else {
      const [job] = pendingJobs;
      const nextJobs = pendingJobs.splice(1);
      // Allows update job to use spread operator without extracting whole mongo document
      const { _doc } = { ...job };
      this.enqueue(_doc)
        .then(() => {
          queueHelper(resolve, reject, nextJobs);
        })
        .catch((err) => { reject(err); });
    }
  };

  const queueJobs = pendingJobs => new Promise((resolve, reject) => {
    queueHelper(resolve, reject, pendingJobs);
  });

  const queuePendingJobs = async () => {
    const pendingJobs = await getPendingJobs();
    await queueJobs(pendingJobs);
  };

  this.init = async () => {
    await createQueue();
    await queuePendingJobs();
    return this;
  };

  this.enqueue = job => new Promise(async (resolve, reject) => {
    if (!this.queue) {
      reject(new Error('Queue must be initialized'));
    } else {
      try {
        const updatedJob = await updateJob(job, { status: Status.QUEUED }, true);
        if (!updatedJob) {
          throw reject(new Error('Job must be made before it is queued'));
        }
        this.queue.add(updatedJob);
        resolve({
          ...updatedJob._doc,
          ...{ input: job.input, spec: job.spec },
        });
      } catch (err) {
        reject(err);
      }
    }
  });

  // TODO: Make a remove job function

  this.getJobCounts = () => {
    if (!this.queue) { throw new Error('Queue must be initialized'); }
    return this.queue.getJobCounts();
  };

  this.getRunningJobs = () => {
    if (!this.queue) { throw new Error('Queue must be initialized'); }
    return this.queue.getJobs();
  };
}

module.exports = new JobQueue();
