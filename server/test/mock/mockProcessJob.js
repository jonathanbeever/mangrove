const mockResult = { test: 'test' };

const mockProcessJob = job => new Promise((resolve) => {
  Object.assign(job, { result: mockResult });
  resolve(job);
});

module.exports = {
  mockProcessJob,
  mockResult,
};
