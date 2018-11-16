const Status = Object.freeze({
  QUEUED: 'queued',
  PROCESSING: 'processing',
  FINISHED: 'finished',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
});

module.exports = Status;
