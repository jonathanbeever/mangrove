const { nextMockJob } = require('../../test/mock/mockJob');

const Type = require('../../api/models/type');
const Status = require('../../api/models/status');


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


module.exports = {
  makeRandomJobs, printCountsWithNames, getCountOfPendingJobs,
};
