const Status = require('../../api/models/status');
const { getJobModel } = require('../../api/models/job/utils');


const moveJobFromWorkToFinish = (index) => {
  this.finishedJobs.push(this.workersList[index]);
  this.workersList[index].splice(index, 1);
};

function MockQueue(concurrency, proccessFunction) {
  this.queue = null;
  this.workersList = null;
  this.finishedJobs = null;
  this.concurrency = concurrency;
  this.proccessFunction = proccessFunction;


  this.init = () => {
    this.queue = [];
    this.workersList = [];
    this.finishedJobs = [];
  };

  this.enqueue = (job) => {
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

  this.finishWork = (populatedJob, status) => {
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
      jobInWork.result = this.proccessFunction(jobInWork);
      moveJobFromWorkToFinish(indexOfJob);
    } else {
      throw new Error(`Cannot Finish Job With Status ${status}`);
    }
  };
}

module.exports = new MockQueue();
