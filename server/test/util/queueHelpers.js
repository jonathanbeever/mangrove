const { nextMockPopulatedJob } = require('../../test/mock/mockJob');

const Type = require('../../api/models/type');
const Status = require('../../api/models/status');


const initCounter = (enumType) => {
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

const makeRandomJobs = (numJobs) => {
  const tallyOfStatus = initCounter(Status);
  const tallyOfTypes = initCounter(Type);
  const numOfStatus = tallyOfStatus.length;
  const numOfTypes = tallyOfTypes.length;
  const jobs = [];
  let statusCounter = 0;
  let typeCounter = 0;

  for (let i = 0; i < numJobs; i += 1) {
    tallyOfStatus[statusCounter] += 1;
    tallyOfTypes[typeCounter] += 1;
    nextMockPopulatedJob(
      Object.values(Type)[typeCounter],
      Object.values(Status)[statusCounter],
    );
    statusCounter = (statusCounter + 1) % numOfStatus;
    typeCounter = (typeCounter + 1) % numOfTypes;
  }

  return { jobs, tallyOfStatus, tallyOfTypes };
};


module.exports = {
  makeRandomJobs, printCountsWithNames, getCountOfPendingJobs,
};
