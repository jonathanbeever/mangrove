const chai = require('chai');
const chaiHttp = require('chai-http');

const mockDb = require('../test/mock/mockDb');
const { nextMockJob } = require('../test/mock/mockJob');
const Type = require('../api/models/type');
const Status = require('../api/models/status');

const {
  intialize, qJob, setTrack, getHistory,
} = require('../util/queue');

const { Job } = require('../api/models/job');

const { expect } = chai;
chai.use(chaiHttp);

let q = null;

describe('Queue', () => {
  before(async () => {
    q = intialize(true);
    await mockDb.setup();
  });

  after(async () => {
    await mockDb.teardown();
  });

  beforeEach((done) => {
    Job.deleteMany({}, (err) => {
      done();
    });
  });

  describe('Queue Job', () => {
    it('Testing Q', (done) => {
      const job = nextMockJob(Type.ACI);
      Job.create(job)
        .then((createResult) => {
          qJob(createResult)
            .then((qResult) => {
              console.log('QUEUE RESULT:');
              console.log(qResult);
              Job.findById(qResult._id)
                .then((searchResult) => {
                  console.log('SEARCH RESULT:');
                  console.log(searchResult);
                  console.log(getHistory());
                  expect(searchResult.status).to.be.string(Status.QUEUED);
                  done();
                })
                .catch((err) => {
                  done(err);
                });
            })
            .catch((err) => {
              done(err);
            });
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
