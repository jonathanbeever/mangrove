const mockResult = { test: 'test' };

const mockProcessJob = job => new Promise((resolve) => {
  Object.assign(job, { result: mockResult });
  resolve(job);
});

const mockFreezeJob = job => new Promise(() => {
  Object.assign(job, { result: 'Frozen' });
});

module.exports = {
  mockProcessJob,
  mockFreezeJob,
  mockResult,
};
