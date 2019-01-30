const Status = require('../../api/models/status');
const { getJobModel } = require('../../api/models/job/utils');
const { value } = require('../../util/settings');


const moveJobFromWorkToFinish = (index) => {
  this.finishedJobs.push(this.workersList[index]);
  this.workersList[index].splice(index, 1);
};

function MockQueue(processFunction, concurrency = value('cores')) {
  this.queue = null;
  this.workersList = null;
  this.finishedJobs = null;
  this.concurrency = concurrency;
  this.process = processFunction;


  this.init = process => new Promise((resolve) => {
    this.queue = [];
    this.workersList = [];
    this.finishedJobs = [];
    this.process = process;
    resolve(this);
  });


  this.destroy = () => {
    if (this.queue) {
      this.queue = null;
      this.workersList = null;
      this.finishedJobs = null;
    }
  };


  this.enqueue = job => new Promise((resolve, reject) => {
    const JobModel = getJobModel(job.type);
    JobModel.findByIdAndUpdate(
      job._id,
      { status: Status.QUEUED },
      { new: true },
    ).then(async (foundJob) => {
      if (foundJob) {
        const processedResult = await this.process(job);
        const processedJob = { ...foundJob._doc, ...{ result: processedResult } };
        resolve({
          job: processedJob,
          ...(processedJob.process || { process: 'Mocked enqueue does not contain promise' }),
        });
      }
    }).catch((err) => {
      reject(err);
    });
  });

  this.pushToQueue = (job) => {
    const JobModel = getJobModel(job.type);
    JobModel.findById(
      job.jobId,
    ).then((foundJob) => {
      if (foundJob) {
        const updatedJob = job;
        updatedJob.status = Status.QUEUED;
        this.queue.push(updatedJob);
      } else {
        throw new Error('Job must be made before being queued');
      }
    });
  };

  this.pushToWork = (job) => {
    if (this.concurrency <= this.workersList.length) {
      throw new Error('You have reached maximum concurrency');
    }
    const indexOfJob = this.queue.map(queuedJob => queuedJob.jobId)
      .indexOf(job.jobId);
    if (indexOfJob === -1) {
      throw new Error('Job is not queued');
    }
    this.queue[indexOfJob].status = Status.PROCESSING;
    this.workersList.push(this.queue[indexOfJob]);
  };

  this.finishWork = (populatedJob, status, proccess = this.processFunction) => {
    const indexOfJob = this.workersList.map(workingJob => workingJob.jobId)
      .indexOf(populatedJob.jobId);
    const jobInWork = this.workersList[indexOfJob];

    if (status === Status.CANCELLED) {
      jobInWork.status = Status.CANCELLED;
      jobInWork.result = { error: 'Job Cancelled' };
      moveJobFromWorkToFinish(indexOfJob);
    } else if (status === Status.FAILED) {
      jobInWork.status = Status.FAILED;
      jobInWork.result = { error: 'Job Failed' };
      moveJobFromWorkToFinish(indexOfJob);
    } else if (status === Status.FINISHED) {
      jobInWork.status = Status.FINISHED;
      jobInWork.result = proccess(jobInWork);
      moveJobFromWorkToFinish(indexOfJob);
    } else {
      throw new Error(`Cannot Finish Job With Status ${status}`);
    }
  };
}

module.exports = new MockQueue();
