const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');


const { nextMockJob } = require('../../test/mock/mockJob');

const Type = require('../../api/models/type');
const Status = require('../../api/models/status');
const { options } = require('../../util/queue_options');


const { expect } = chai;
chai.use(chaiAsPromised);

const getCounter = (enumType) => {
  const counter = [];
  Object.keys(enumType).forEach(() => {
    counter.push(0);
  });

  return counter;
};

const printCountsWithNames = (enumType, counts) => {
  const friendlyCounts = [];
  let counter = 0;
  let name;
  counts.forEach((count) => {
    name = Object.keys(enumType)[counter];
    friendlyCounts.push({ [name]: count });
    counter += 1;
  });

  console.log(friendlyCounts);
};

const getCountOfPendingJobs = (counts, maxInQueue = null) => {
  const numJobsPending = counts[0] + counts[1] + counts[2];
  if (maxInQueue && numJobsPending > maxInQueue) {
    return maxInQueue;
  }
  return numJobsPending;
};

const getRandomNumber = (min, max) => {
  const minRounded = Math.ceil(min);
  const maxRounded = Math.floor(max);
  return Math.floor(Math.random() * (maxRounded - minRounded + 1)) + minRounded;
};

const getRandomKey = (enumType) => {
  const numOptions = Object.keys(enumType).length - 1;
  return (Object.keys(enumType)[getRandomNumber(0, numOptions)]);
};

const makeRandomJobs = (numJobs) => {
  const statusCounter = getCounter(Status);
  const typeCounter = getCounter(Type);
  const jobs = [];
  let statusKey;
  let typeKey;

  for (let i = 0; i < numJobs; i += 1) {
    statusKey = getRandomKey(Status);
    typeKey = getRandomKey(Type);
    statusCounter[Object.keys(Status).indexOf(statusKey)] += 1;
    typeCounter[Object.keys(Type).indexOf(typeKey)] += 1;
    jobs.push(nextMockJob(Type[typeKey], Status[statusKey]));
  }

  return { jobs, statusCounter, typeCounter };
};

function lock(jobQueue, resolve, numberFreeSpaces) {
  setTimeout(() => {
    if (jobQueue.getFreeSlots() === numberFreeSpaces) {
      resolve();
    } else {
      lock(jobQueue, resolve, numberFreeSpaces);
    }
  }, 500);
}

function lockUntilSpacesRemain(jobQueue, numberFreeSpaces) {
  return new Promise((resolve) => {
    lock(jobQueue, resolve, numberFreeSpaces);
  });
}

function queueFirstJob(jobQueue, firstJob) {
  jobQueue.enqueue(firstJob);
}

function queueRestOfJobs(jobQueue, restOfJobs) {
  restOfJobs.forEach(
    (job) => {
      jobQueue.enqueue(job);
    },
  );
}

async function testJobs(jobQueue, jobs, done) {
  const firstJob = jobs[0];
  const restOfJobs = jobs.splice(1);
  await queueFirstJob(jobQueue, firstJob);
  await lockUntilSpacesRemain(jobQueue, 7);
  expect(jobQueue.getFreeSlots()).to.be.eql(options.cores - 1);
  expect(jobQueue.getRunningJobs().length).to.be.eql(1);
  await queueRestOfJobs(jobQueue, restOfJobs);
  await lockUntilSpacesRemain(jobQueue, 0);
  expect(jobQueue.getFreeSlots()).to.be.eql(0);
  expect(jobQueue.getRunningJobs().length).to.be.eql(options.cores);
  expect(jobQueue.getRunningJobs().length + jobQueue.queue.length())
    .to.be.be.eql(options.cores + 1);
  jobQueue.destroy();
  done();
}

module.exports = {
  makeRandomJobs, printCountsWithNames, getCountOfPendingJobs, testJobs,
};
