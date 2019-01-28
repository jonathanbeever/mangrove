const mockResult = {
  test: 'test', numberField: 1203, boolean: false, object: { testy: 'wow' },
};

const mockProcessJob = populatedJob => new Promise((resolve) => {
  const processedJob = populatedJob;
  processedJob.result = mockResult;
  resolve(processedJob.result);
});

const mockFreezeJob = job => new Promise(() => {
  Object.assign(job, { result: 'Frozen' });
});

module.exports = {
  mockProcessJob,
  mockFreezeJob,
  mockResult,
};
