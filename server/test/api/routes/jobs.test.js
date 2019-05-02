const chai = require('chai');
const chaiHttp = require('chai-http');

const { ObjectId } = require('mongoose').Types;

const mockDb = require('../../mock/mockDb');
const {
  nextMockJob,
  nextMockJobCreateJson,
  getJsonFromMockJob,
} = require('../../mock/mockJob');
const { mockProcessJob } = require('../../mock/mockProcessJob');
const { nextMockObjectId } = require('../../mock/mockObjectId');
const mockQueue = require('../../mock/mockQueue');

const app = require('../../../app');

const {
  deleteInputDir,
  deleteRootDir,
} = require('../../../util/storage');

const Input = require('../../../api/models/input');
const { Spec } = require('../../../api/models/spec');
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

const { token } = require('../../../test/testUser.js');

describe('Jobs', () => {
  before(async () => {
    await mockDb.setup();
    global.jobQueue = await mockQueue.init(mockProcessJob);
  });

  after(async () => {
    await mockDb.teardown();
    deleteRootDir();
  });

  beforeEach(async () => {
    await Input.deleteMany();
    deleteInputDir();
    await Spec.deleteMany();
    await Job.deleteMany();
  });

  describe('/PUT Job', () => {
    it('It should fail to PUT a Job (missing required keys)', async () => {
      const jobJson = '';

      const res = await chai.request(app)
        .put('/jobs')
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .send(jobJson);

      expect(res).to.have.status(400);
      expect(res.body).to.have.all.keys('message');
      expect(res.body.message).to.be.a('string');
    });

    it('It should fail to PUT a Job (invalid keys)', async () => {
      const jobJson = JSON.stringify({
        input: nextMockObjectId(),
        spec: nextMockObjectId(),
        extra: true,
      });

      const res = await chai.request(app)
        .put('/jobs')
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .send(jobJson);

      expect(res).to.have.status(400);
      expect(res.body).to.have.all.keys('message');
      expect(res.body.message).to.be.a('string');
    });

    it('It should fail to PUT a Job (Input not found)', async () => {
      const job = await nextMockJob(Type.ACI);
      const jobJson = getJsonFromMockJob(job);

      await Input.deleteOne({ _id: job.input }).exec();

      const res = await chai.request(app)
        .put('/jobs')
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .send(jobJson);

      expect(res).to.have.status(404);
      expect(res.body).to.have.all.keys('message');
      expect(res.body.message).to.be.a('string');
    });

    it('It should fail to PUT a Job (Spec not found)', async () => {
      const job = await nextMockJob(Type.ACI);
      const jobJson = getJsonFromMockJob(job);

      await Spec.deleteOne({ _id: job.spec }).exec();

      const res = await chai.request(app)
        .put('/jobs')
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .send(jobJson);

      expect(res).to.have.status(404);
      expect(res.body).to.have.all.keys('message');
      expect(res.body.message).to.be.a('string');
    });

    it('It should fail to PUT a Job (casting/validation error)', async () => {
      const jobJson = getJsonFromMockJob({
        input: true,
        spec: 123,
      });

      const res = await chai.request(app)
        .put('/jobs')
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .send(jobJson);

      expect(res).to.have.status(400);
      expect(res.body).to.have.all.keys('message');
      expect(res.body.message).to.be.a('string');
    });

    it('It should PUT a Job (new)', async () => {
      const mockedJobs = types.map(type => nextMockJob(type));
      const jobs = await Promise.all(mockedJobs);
      const jobJsons = jobs.map(job => getJsonFromMockJob(job));

      const requests = jobJsons.map(json => chai.request(app)
        .put('/jobs')
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .send(json));
      const responses = await Promise.all(requests);

      responses.forEach((res, index) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.all.keys(
          getJobKeys(types[index % types.length], false),
        );
        expect(ObjectId(res.body.jobId).toString()).to.equal(
          res.body.jobId, // Check whether it's a valid ObjectId
        );
        expect(res.body.input).to.equal(
          ObjectId(jobs[index].input).toString(),
        );
        expect(res.body.spec).to.equal(
          ObjectId(jobs[index].spec).toString(),
        );
        expect(res.body.author).to.equal(jobs[index].author);
        expect(res.body.creationTimeMs).to.be.a('number');
        expect(res.body.status).to.equal(Status.QUEUED);
      });
    });

    it('It should PUT a Job (existing, unfinished)', async () => {
      const mockedJobs = [];
      types.forEach((type, index) => {
        mockedJobs.push(nextMockJob(
          type,
          statusesNotFinished[index % (statusesNotFinished.length)],
        ));
      });
      const jobs = await Promise.all(mockedJobs);

      const jobJsons = jobs.map(job => getJsonFromMockJob(job));

      await Job.insertMany(jobs);

      const requests = jobJsons.map(json => chai.request(app)
        .put('/jobs')
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .send(json));
      const responses = await Promise.all(requests);

      responses.forEach((res, index) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.all.keys(
          getJobKeys(types[index % types.length], false),
        );
        expect(res.body.jobId).to.equal(jobs[index].id);
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
      });
    });

    it('It should PUT a Job (existing, finished)', async () => {
      const mockedJobs = types.map(type => nextMockJob(type, Status.FINISHED));
      const jobs = await Promise.all(mockedJobs);
      const jobJsons = jobs.map(job => getJsonFromMockJob(job));

      await Job.insertMany(jobs);

      const requests = jobJsons.map(json => chai.request(app)
        .put('/jobs')
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .send(json));
      const responses = await Promise.all(requests);

      responses.forEach((res, index) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.all.keys(
          getJobKeys(types[index % types.length]),
        );
        expect(res.body.jobId).to.equal(jobs[index].id);
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
      });
    });
  });

  describe('/GET Job', () => {
    it('It should fail to GET a Job (not found)', async () => {
      const res = await chai.request(app)
        .get(`/jobs/${nextMockObjectId()}`)
        .set('Authorization', token);

      expect(res).to.have.status(404);
      expect(res.body).to.have.all.keys('message');
      expect(res.body.message).to.be.a('string');
    });

    it('It should GET a Job (found, unfinished)', async () => {
      const mockedJobs = [];
      types.forEach((type, index) => {
        mockedJobs.push(nextMockJob(
          type,
          statusesNotFinished[index % (statusesNotFinished.length)],
        ));
      });
      const jobs = await Promise.all(mockedJobs);

      await Job.insertMany(jobs);

      const requests = jobs.map(job => chai.request(app)
        .get(`/jobs/${job.id}`)
        .set('Authorization', token));
      const responses = await Promise.all(requests);

      responses.forEach((res, index) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.all.keys(
          getJobKeys(types[index % types.length], false),
        );
        expect(res.body.jobId).to.equal(jobs[index].id);
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
      });
    });

    it('It should GET a Job (found, finished)', async () => {
      const mockedJobs = types.map(type => nextMockJob(type, Status.FINISHED));
      const jobs = await Promise.all(mockedJobs);

      await Job.insertMany(jobs);

      const requests = jobs.map(job => chai.request(app)
        .get(`/jobs/${job.id}`)
        .set('Authorization', token));
      const responses = await Promise.all(requests);

      responses.forEach((res, index) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.all.keys(
          getJobKeys(types[index % types.length]),
        );
        expect(res.body.jobId).to.equal(jobs[index].id);
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
      });
    });
  });

  describe('/GET all Jobs', () => {
    it('It should GET all Jobs (none)', async () => {
      const res = await chai.request(app)
        .get('/jobs')
        .set('Authorization', token);

      expect(res).to.have.status(200);
      expect(res.body).to.have.all.keys(['count', 'jobs']);
      expect(res.body.count).to.equal(0);
      expect(res.body.jobs).to.be.an('array');
      expect(res.body.jobs).to.be.empty;
    });

    it('It should GET all Jobs (many, unfinished)', async () => {
      const mockedJobs = [];
      types.forEach((type, index) => {
        mockedJobs.push(nextMockJob(
          type,
          statusesNotFinished[index % (statusesNotFinished.length)],
        ));
      });
      const jobs = await Promise.all(mockedJobs);

      await Job.insertMany(jobs);

      const res = await chai.request(app)
        .get('/jobs')
        .set('Authorization', token);

      expect(res).to.have.status(200);
      expect(res.body).to.have.all.keys(['count', 'jobs']);
      expect(res.body.count).to.equal(jobs.length);
      expect(res.body.jobs).to.be.an('array');
      expect(res.body.jobs).to.have.lengthOf(jobs.length);
      res.body.jobs.forEach((job, index) => {
        expect(job).to.have.all.keys(
          getJobKeys(types[index % types.length], false),
        );
        expect(job.jobId).to.equal(jobs[index].id);
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
    });

    it('It should GET all Jobs (many, finished)', async () => {
      const mockedJobs = types.map(type => nextMockJob(type, Status.FINISHED));
      const jobs = await Promise.all(mockedJobs);

      await Job.insertMany(jobs);

      const res = await chai.request(app)
        .get('/jobs')
        .set('Authorization', token);

      expect(res).to.have.status(200);
      expect(res.body).to.have.all.keys(['count', 'jobs']);
      expect(res.body.count).to.equal(jobs.length);
      expect(res.body.jobs).to.be.an('array');
      expect(res.body.jobs).to.have.lengthOf(jobs.length);
      res.body.jobs.forEach((job, index) => {
        expect(job).to.have.all.keys(
          getJobKeys(types[index % types.length]),
        );
        expect(job.jobId).to.equal(jobs[index].id);
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
    });
  });

  describe('/DELETE Job', () => {
    it('It should DELETE a Job (not found)', async () => {
      const res = await chai.request(app)
        .delete(`/jobs/${nextMockObjectId()}`)
        .set('Authorization', token);

      expect(res).to.have.status(200);
      expect(res.body).to.have.all.keys('success', 'message');
      expect(res.body.success).to.be.true;
      expect(res.body.message).to.be.a('string');
    });

    it('It should DELETE a Job (found)', async () => {
      const job = await nextMockJob(Type.ACI);

      await Job.create(job);

      const res = await chai.request(app)
        .delete(`/jobs/${job.id}`)
        .set('Authorization', token);

      expect(res).to.have.status(200);
      expect(res.body).to.have.all.keys('success', 'message');
      expect(res.body.success).to.be.true;
      expect(res.body.message).to.be.a('string');
    });
  });
});
