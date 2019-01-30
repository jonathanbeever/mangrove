const Status = Object.freeze({
  WAITING: 'waiting',
  QUEUED: 'queued',
  PROCESSING: 'processing',
  FINISHED: 'finished',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
});

module.exports = Status;
