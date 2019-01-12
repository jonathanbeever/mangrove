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


describe('Queue', () => {
  before(async () => {
    intialize(true);
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
            .then((qJobResult) => {
              console.log(qJobResult.updatedJob);
              qJobResult.proccessPromise
                .then((proccessedResult) => {
                  console.log(proccessedResult);
                  done();
                })
                .catch((proccessedErr) => { done(proccessedErr); });
            })
            .catch((err) => { console.log(err); });
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
