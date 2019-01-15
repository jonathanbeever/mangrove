const chai = require('chai');
const chaiHttp = require('chai-http');

const { ObjectId } = require('mongoose').Types;

const mockDb = require('../../mock/mockDb');
const {
  nextMockJob,
  nextMockJobCreateJson,
  getJsonFromMockJob,
} = require('../../mock/mockJob');
const { nextMockObjectId } = require('../../mock/mockObjectId');

const app = require('../../../app');

const { Job } = require('../../../api/models/job');
const { getJobKeys } = require('../../../api/models/job/utils');
const Type = require('../../../api/models/type');
const Status = require('../../../api/models/status');

const { expect } = chai;

chai.use(chaiHttp);

const types = Object.values(Type);
const statuses = Object.values(Status);
const statusesNotFinished = statuses.slice();
statusesNotFinished.splice(statusesNotFinished.indexOf(Status.FINISHED), 1);

describe('Jobs', () => {
  before(async () => {
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

  describe('/PUT Job', () => {
    it('It should fail to PUT a Job (missing required keys)', (done) => {
      const jobJson = '';

      chai
        .request(app)
        .put('/jobs')
        .set('Content-Type', 'application/json')
        .send(jobJson)
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.all.keys('message');
          expect(res.body.message).to.be.a('string');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('It should fail to PUT a Job (invalid keys)', (done) => {
      const jobJson = JSON.stringify({
        type: Type.ACI,
        inputId: nextMockObjectId(),
        specId: nextMockObjectId(),
        extra: true,
      });

      chai
        .request(app)
        .put('/jobs')
        .set('Content-Type', 'application/json')
        .send(jobJson)
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.all.keys('message');
          expect(res.body.message).to.be.a('string');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('It should fail to PUT a Job (invalid type)', (done) => {
      const jobJson = nextMockJobCreateJson('invalid');

      chai
        .request(app)
        .put('/jobs')
        .set('Content-Type', 'application/json')
        .send(jobJson)
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.all.keys('message');
          expect(res.body.message).to.be.a('string');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('It should PUT a Job (new)', (done) => {
      const jobs = [];
      types.forEach(type => jobs.push(nextMockJob(type)));

      const jobJsons = [];
      jobs.forEach(job => jobJsons.push(getJsonFromMockJob(job)));

      jobJsons.forEach((json, index) => {
        chai
          .request(app)
          .put('/jobs')
          .set('Content-Type', 'application/json')
          .send(json)
          .then((res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.all.keys(
              getJobKeys(types[index % types.length], false),
            );
            expect(ObjectId(res.body.jobId).toString()).to.equal(
              res.body.jobId, // Check whether it's a valid ObjectId
            );
            expect(res.body.type).to.equal(types[index % types.length]);
            expect(res.body.input).to.equal(
              ObjectId(jobs[index].input).toString(),
            );
            expect(res.body.spec).to.equal(
              ObjectId(jobs[index].spec).toString(),
            );
            expect(res.body.author).to.equal(jobs[index].author);
            expect(res.body.creationTimeMs).to.be.a('number');
            expect(res.body.status).to.equal(Status.QUEUED);
          })
          .catch((err) => {
            done(err);
          });
      });

      done();
    });

    it('It should PUT a Job (existing, unfinished)', (done) => {
      const jobs = [];
      types.forEach((type, index) => {
        jobs.push(nextMockJob(
          type,
          statusesNotFinished[index % (statusesNotFinished.length)],
        ));
      });

      const jobJsons = [];
      jobs.forEach(job => jobJsons.push(getJsonFromMockJob(job)));

      Job.insertMany(jobs)
        .then(() => {
          jobJsons.forEach((json, index) => {
            chai
              .request(app)
              .put('/jobs')
              .set('Content-Type', 'application/json')
              .send(json)
              .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.all.keys(
                  getJobKeys(types[index % types.length], false),
                );
                expect(res.body.jobId).to.equal(jobs[index].id);
                expect(res.body.type).to.equal(types[index % types.length]);
                expect(res.body.input).to.equal(
                  ObjectId(jobs[index].input).toString(),
                );
                expect(res.body.spec).to.equal(
                  ObjectId(jobs[index].spec).toString(),
                );
                expect(res.body.author).to.equal(jobs[index].author);
                expect(res.body.creationTimeMs).to.be.a('number');
                expect(res.body.status).to.equal(
                  statusesNotFinished[index % (statusesNotFinished.length)],
                );
              })
              .catch((err) => {
                done(err);
              });
          });

          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('It should PUT a Job (existing, finished)', (done) => {
      const jobs = [];
      types.forEach(type => jobs.push(nextMockJob(type, Status.FINISHED)));

      const jobJsons = [];
      jobs.forEach(job => jobJsons.push(getJsonFromMockJob(job)));

      Job.insertMany(jobs)
        .then(() => {
          jobJsons.forEach((json, index) => {
            chai
              .request(app)
              .put('/jobs')
              .set('Content-Type', 'application/json')
              .send(json)
              .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.all.keys(
                  getJobKeys(types[index % types.length]),
                );
                expect(res.body.jobId).to.equal(jobs[index].id);
                expect(res.body.type).to.equal(types[index % types.length]);
                expect(res.body.input).to.equal(
                  ObjectId(jobs[index].input).toString(),
                );
                expect(res.body.spec).to.equal(
                  ObjectId(jobs[index].spec).toString(),
                );
                expect(res.body.author).to.equal(jobs[index].author);
                expect(res.body.creationTimeMs).to.be.a('number');
                expect(res.body.status).to.equal(Status.FINISHED);
                expect(res.body.result).to.be.an('null'); // TODO: 'object'
              })
              .catch((err) => {
                done(err);
              });
          });

          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('/GET Job', () => {
    it('It should fail to GET a Job (not found)', (done) => {
      chai
        .request(app)
        .get(`/jobs/${nextMockObjectId()}`)
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.all.keys('message');
          expect(res.body.message).to.be.a('string');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('It should GET a Job (found, unfinished)', (done) => {
      const jobs = [];
      types.forEach((type, index) => {
        jobs.push(nextMockJob(
          type,
          statusesNotFinished[index % (statusesNotFinished.length)],
        ));
      });

      Job.insertMany(jobs)
        .then(() => {
          jobs.forEach((job, index) => {
            chai
              .request(app)
              .get(`/jobs/${job.id}`)
              .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.all.keys(
                  getJobKeys(types[index % types.length], false),
                );
                expect(res.body.jobId).to.equal(job.id);
                expect(res.body.type).to.equal(types[index % types.length]);
                expect(res.body.input).to.equal(
                  ObjectId(job.input).toString(),
                );
                expect(res.body.spec).to.equal(
                  ObjectId(job.spec).toString(),
                );
                expect(res.body.author).to.equal(job.author);
                expect(res.body.creationTimeMs).to.be.a('number');
                expect(res.body.status).to.equal(
                  statusesNotFinished[index % (statusesNotFinished.length)],
                );
              })
              .catch((err) => {
                done(err);
              });
          });

          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('It should GET a Job (found, finished)', (done) => {
      const jobs = [];
      types.forEach(type => jobs.push(nextMockJob(type, Status.FINISHED)));

      Job.insertMany(jobs)
        .then(() => {
          jobs.forEach((job, index) => {
            chai
              .request(app)
              .get(`/jobs/${job.id}`)
              .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.all.keys(
                  getJobKeys(types[index % types.length]),
                );
                expect(res.body.jobId).to.equal(job.id);
                expect(res.body.type).to.equal(types[index % types.length]);
                expect(res.body.input).to.equal(
                  ObjectId(job.input).toString(),
                );
                expect(res.body.spec).to.equal(
                  ObjectId(job.spec).toString(),
                );
                expect(res.body.author).to.equal(job.author);
                expect(res.body.creationTimeMs).to.be.a('number');
                expect(res.body.status).to.equal(Status.FINISHED);
                expect(res.body.result).to.be.an('null'); // TODO: 'object'
              })
              .catch((err) => {
                done(err);
              });
          });

          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('/GET all Jobs', () => {
    it('It should GET all Jobs (none)', (done) => {
      chai
        .request(app)
        .get('/jobs')
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.all.keys(['count', 'jobs']);
          expect(res.body.count).to.be.eql(0);
          expect(res.body.jobs).to.be.an('array');
          expect(res.body.jobs).to.be.empty;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('It should GET all Jobs (many, unfinished)', (done) => {
      const jobs = [];
      types.forEach((type, index) => {
        jobs.push(nextMockJob(
          type,
          statusesNotFinished[index % (statusesNotFinished.length)],
        ));
      });

      Job.insertMany(jobs)
        .then(() => {
          chai
            .request(app)
            .get('/jobs')
            .then((res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.have.all.keys(['count', 'jobs']);
              expect(res.body.count).to.be.eql(jobs.length);
              expect(res.body.jobs).to.be.an('array');
              expect(res.body.jobs).to.have.lengthOf(jobs.length);
              res.body.jobs.forEach((job, index) => {
                expect(job).to.have.all.keys(
                  getJobKeys(types[index % types.length], false),
                );
                expect(job.jobId).to.equal(jobs[index].id);
                expect(job.type).to.equal(types[index % types.length]);
                expect(job.input).to.equal(
                  ObjectId(jobs[index].input).toString(),
                );
                expect(job.spec).to.equal(
                  ObjectId(jobs[index].spec).toString(),
                );
                expect(job.author).to.equal(jobs[index].author);
                expect(job.creationTimeMs).to.be.a('number');
                expect(job.status).to.equal(
                  statusesNotFinished[index % (statusesNotFinished.length)],
                );
              });
              done();
            })
            .catch((err) => {
              done(err);
            });
        })
        .catch((err) => {
          done(err);
        });
    });

    it('It should GET all Jobs (many, finished)', (done) => {
      const jobs = [];
      types.forEach(type => jobs.push(nextMockJob(type, Status.FINISHED)));

      Job.insertMany(jobs)
        .then(() => {
          chai
            .request(app)
            .get('/jobs')
            .then((res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.have.all.keys(['count', 'jobs']);
              expect(res.body.count).to.be.eql(jobs.length);
              expect(res.body.jobs).to.be.an('array');
              expect(res.body.jobs).to.have.lengthOf(jobs.length);
              res.body.jobs.forEach((job, index) => {
                expect(job).to.have.all.keys(
                  getJobKeys(types[index % types.length]),
                );
                expect(job.jobId).to.equal(jobs[index].id);
                expect(job.type).to.equal(types[index % types.length]);
                expect(job.input).to.equal(
                  ObjectId(jobs[index].input).toString(),
                );
                expect(job.spec).to.equal(
                  ObjectId(jobs[index].spec).toString(),
                );
                expect(job.author).to.equal(jobs[index].author);
                expect(job.creationTimeMs).to.be.a('number');
                expect(job.status).to.equal(Status.FINISHED);
                expect(job.result).to.be.an('null'); // TODO: 'object'
              });
              done();
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

  describe('/DELETE Job', () => {
    it('It should DELETE a Job (not found)', (done) => {
      chai
        .request(app)
        .delete(`/jobs/${nextMockObjectId()}`)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.all.keys('success', 'message');
          expect(res.body.success).to.be.true;
          expect(res.body.message).to.be.a('string');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('It should DELETE a Job (found)', (done) => {
      const job = nextMockJob(Type.ACI);

      Job.create(job)
        .then(() => {
          chai
            .request(app)
            .delete(`/jobs/${job.id}`)
            .then((res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.have.all.keys('success', 'message');
              expect(res.body.success).to.be.true;
              expect(res.body.message).to.be.a('string');
              done();
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
