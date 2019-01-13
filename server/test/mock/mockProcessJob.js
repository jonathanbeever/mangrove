const mockProcessJob = job => Object.assign(job, { result: { test: 'test' } });

module.exports = {
  mockProcessJob,
};
