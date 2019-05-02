const fs = require('fs');
const chai = require('chai');
const chaiFs = require('chai-fs');
const chaiHttp = require('chai-http');

const { ObjectId } = require('mongoose').Types;

const mockDb = require('../../mock/mockDb');
const {
  nextMockInput,
  nextMockInputCreateJson,
  getJsonFromMockInput,
} = require('../../mock/mockInput');
const { nextMockPopulatedJob } = require('../../mock/mockJob');
const { nextMockObjectId } = require('../../mock/mockObjectId');

const app = require('../../../app');
const settings = require('../../../util/settings');
const {
  deleteInputDir,
  deleteRootDir,
} = require('../../../util/storage');

const Input = require('../../../api/models/input');
const { Spec } = require('../../../api/models/spec');
const { Job } = require('../../../api/models/job');
const {
  getInputKeys,
  newInputKeys,
  coordsKeys,
  getExtensionlessFilename,
} = require('../../../api/models/input/utils');
const Type = require('../../../api/models/type');

const { expect } = chai;

const inputDir = settings.value('inputDir');

const testInputFile = './test/mock/wav/test.wav';

const { token } = require('../../../test/testUser.js');

chai.use(chaiFs);
chai.use(chaiHttp);

describe('Inputs', () => {
  before(async () => {
    await mockDb.setup();
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

  describe('/PUT Input', () => {
    // TODO: Deal with error "Multipart: Boundary not found"
    it('It should fail to PUT an Input (missing both keys)', async () => {
      const res = await chai.request(app)
        .put('/inputs')
        .set('Authorization', token);
      // .set('Content-Type', 'multipart/form-data');

      expect(res).to.have.status(400);
      expect(res.body).to.have.all.keys('message');
      expect(res.body.message).to.be.a('string');
    });

    it('It should fail to PUT an Input (missing file)', async () => {
      const inputJson = nextMockInputCreateJson();

      const res = await chai.request(app)
        .put('/inputs')
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', token)
        .field('json', inputJson);

      expect(res).to.have.status(400);
      expect(res.body).to.have.all.keys('message');
      expect(res.body.message).to.be.a('string');
    });

    it('It should fail to PUT an Input (missing JSON)', async () => {
      const res = await chai.request(app)
        .put('/inputs')
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', token)
        .attach('file', testInputFile);

      expect(res).to.have.status(400);
      expect(res.body).to.have.all.keys('message');
      expect(res.body.message).to.be.a('string');
      expect(inputDir).to.not.be.a.path();
    });

    it('It should fail to PUT an Input (invalid keys in request)', async () => {
      const inputJson = nextMockInputCreateJson();

      const res = await chai.request(app)
        .put('/inputs')
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', token)
        .field('json', inputJson)
        .field('extra', true)
        .attach('file', testInputFile);

      expect(res).to.have.status(400);
      expect(res.body).to.have.all.keys('message');
      expect(res.body.message).to.be.a('string');
      expect(inputDir).to.not.be.a.path();
    });

    it('It should fail to PUT an Input (invalid JSON)', async () => {
      const inputJson = '';

      const res = await chai.request(app)
        .put('/inputs')
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', token)
        .field('json', inputJson)
        .attach('file', testInputFile);

      expect(res).to.have.status(400);
      expect(res.body).to.have.all.keys('message');
      expect(res.body.message).to.be.a('string');
      expect(inputDir).to.not.be.a.path();
    });

    it('It should fail to PUT an Input (missing keys in JSON)', async () => {
      const inputJson = '{}';

      const res = await chai.request(app)
        .put('/inputs')
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', token)
        .field('json', inputJson)
        .attach('file', testInputFile);

      expect(res).to.have.status(400);
      expect(res.body).to.have.all.keys('message');
      expect(res.body.message).to.be.a('string');
      expect(inputDir).to.not.be.a.path();
    });

    it('It should fail to PUT an Input (invalid keys in JSON)', async () => {
      const inputJson = JSON.stringify({
        site: 'UCF Arboretum',
        series: 'Hurricane Irma',
        recordTimeMs: 1505016000000,
        coords: {
          lat: 28.596238,
          long: -81.191381,
        },
        extra: true,
      });

      const res = await chai.request(app)
        .put('/inputs')
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', token)
        .field('json', inputJson)
        .attach('file', testInputFile);

      expect(res).to.have.status(400);
      expect(res.body).to.have.all.keys('message');
      expect(res.body.message).to.be.a('string');
      expect(inputDir).to.not.be.a.path();
    });

    it('It should fail to PUT an Input (file not a WAV)', async () => {
      const inputJson = nextMockInputCreateJson();

      const res = await chai.request(app)
        .put('/inputs')
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', token)
        .field('json', inputJson)
        .attach('file', './README.md');

      expect(res).to.have.status(400);
      expect(res.body).to.have.all.keys('message');
      expect(res.body.message).to.be.a('string');
      expect(inputDir).to.not.be.a.path();
    });

    it('It should PUT an Input (new with default name)', async () => {
      const input = nextMockInput();
      const inputJson = getJsonFromMockInput(input);

      const res = await chai.request(app)
        .put('/inputs')
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', token)
        .field('json', inputJson)
        .attach('file', testInputFile);

      expect(res).to.have.status(201);
      expect(res.body).to.have.all.keys(getInputKeys());
      expect(ObjectId(res.body.inputId).toString()).to.equal(
        res.body.inputId, // Checks whether it's a valid ObjectId
      );
      expect(res.body.site).to.equal(input.site);
      expect(res.body.series).to.equal(input.series);
      expect(res.body.name).to.equal(
        getExtensionlessFilename(testInputFile),
      );
      expect(res.body.recordTimeMs).to.equal(input.recordTimeMs);
      expect(res.body.durationMs).to.equal(input.durationMs);
      expect(res.body.sampleRateHz).to.equal(input.sampleRateHz);
      expect(res.body.sizeBytes).to.equal(input.sizeBytes);
      expect(res.body.coords).to.eql(input.coords);
      expect(res.body.downloadUrl).to.equal(input.downloadUrl); // TODO: Actual download
      expect(input.path).to.be.a.file()
        .and.equal(testInputFile);
    });

    it('It should PUT an Input (new with given name)', async () => {
      const input = nextMockInput();
      const inputJson = getJsonFromMockInput(input, true);

      const res = await chai.request(app)
        .put('/inputs')
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', token)
        .field('json', inputJson)
        .attach('file', testInputFile);

      expect(res).to.have.status(201);
      expect(res.body).to.have.all.keys(getInputKeys());
      expect(ObjectId(res.body.inputId).toString()).to.equal(
        res.body.inputId, // Checks whether it's a valid ObjectId
      );
      expect(res.body.site).to.equal(input.site);
      expect(res.body.series).to.equal(input.series);
      expect(res.body.name).to.equal(input.name);
      expect(res.body.recordTimeMs).to.equal(input.recordTimeMs);
      expect(res.body.durationMs).to.equal(input.durationMs);
      expect(res.body.sampleRateHz).to.equal(input.sampleRateHz);
      expect(res.body.sizeBytes).to.equal(input.sizeBytes);
      expect(res.body.coords).to.eql(input.coords);
      expect(res.body.downloadUrl).to.equal(input.downloadUrl); // TODO: Actual download
      expect(input.path).to.be.a.file()
        .and.equal(testInputFile);
    });

    // TODO: Input already exists
  });

  describe('/GET Input', () => {
    it('It should fail to GET an Input (not found)', async () => {
      const res = await chai.request(app)
        .get(`/inputs/${nextMockObjectId()}`)
        .set('Authorization', token);

      expect(res).to.have.status(404);
      expect(res.body).to.have.all.keys('message');
      expect(res.body.message).to.be.a('string');
    });

    it('It should GET an Input (found)', async () => {
      const input = nextMockInput();

      await Input.create(input);

      const res = await chai.request(app)
        .get(`/inputs/${input.id}`)
        .set('Authorization', token);

      expect(res).to.have.status(200);
      expect(res.body).to.have.all.keys(getInputKeys());
      expect(res.body.inputId).to.equal(input.id);
      expect(res.body.site).to.equal(input.site);
      expect(res.body.series).to.equal(input.series);
      expect(res.body.name).to.equal(input.name);
      expect(res.body.recordTimeMs).to.equal(input.recordTimeMs);
      expect(res.body.durationMs).to.equal(input.durationMs);
      expect(res.body.sampleRateHz).to.equal(input.sampleRateHz);
      expect(res.body.sizeBytes).to.equal(input.sizeBytes);
      expect(res.body.coords).to.eql(input.coords);
      expect(res.body.downloadUrl).to.equal(input.downloadUrl); // TODO: Actual download
      expect(input.path).to.be.a.file()
        .and.equal(testInputFile);
    });
  });

  describe('/GET all Inputs', () => {
    it('It should GET all the Inputs (none)', async () => {
      const res = await chai.request(app)
        .get('/inputs')
        .set('Authorization', token);

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.all.keys(['count', 'inputs']);
      expect(res.body.count).to.be.equal(0);
      expect(res.body.inputs).to.be.an('array');
      expect(res.body.inputs).to.be.empty;
    });

    it('It should GET all the Inputs (many)', async () => {
      const inputs = [];
      inputs.push(nextMockInput());

      await Input.insertMany(inputs);

      const res = await chai.request(app)
        .get('/inputs')
        .set('Authorization', token);

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.all.keys(['count', 'inputs']);
      expect(res.body.count).to.be.equal(inputs.length);
      expect(res.body.inputs).to.be.an('array');
      expect(res.body.inputs).to.have.lengthOf(inputs.length);
      res.body.inputs.forEach((input, index) => {
        expect(input).to.have.all.keys(getInputKeys());
        expect(input.inputId).to.equal(inputs[index].id);
        expect(input.site).to.equal(inputs[index].site);
        expect(input.series).to.equal(inputs[index].series);
        expect(input.name).to.equal(inputs[index].name);
        expect(input.recordTimeMs).to.equal(inputs[index].recordTimeMs);
        expect(input.durationMs).to.equal(inputs[index].durationMs);
        expect(input.sampleRateHz).to.equal(inputs[index].sampleRateHz);
        expect(input.sizeBytes).to.equal(inputs[index].sizeBytes);
        expect(input.coords).to.eql(inputs[index].coords);
        expect(input.downloadUrl).to.equal(inputs[index].downloadUrl); // TODO: Actual download
        expect(inputs[index].path).to.be.a.file()
          .and.equal(testInputFile);
      });
    });
  });

  describe('/DELETE Input', () => {
    it('It should DELETE an Input (not found)', async () => {
      const res = await chai.request(app)
        .delete(`/inputs/${nextMockObjectId()}`)
        .set('Authorization', token);

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.all.keys('success', 'message', 'jobs');
      expect(res.body.success).to.be.a('boolean');
      expect(res.body.success).to.be.true;
      expect(res.body.message).to.be.a('string');
      expect(res.body.jobs).to.be.an('array');
      expect(res.body.jobs).to.be.empty;
    });

    it('It should DELETE an Input (found without Jobs)', async () => {
      const input = nextMockInput();

      await Input.create(input);

      const res = await chai.request(app)
        .delete(`/inputs/${input.id}`)
        .set('Authorization', token);

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.all.keys('success', 'message', 'jobs');
      expect(res.body.success).to.be.a('boolean');
      expect(res.body.success).to.be.true;
      expect(res.body.message).to.be.a('string');
      expect(res.body.jobs).to.be.an('array');
      expect(res.body.jobs).to.be.empty;
      expect(input.path).to.not.be.a.path();
    });

    it('It should DELETE an Input (found with Jobs)', async () => {
      const job = await nextMockPopulatedJob(Type.ACI);

      const res = await chai.request(app)
        .delete(`/inputs/${job.input.id}`)
        .set('Authorization', token);

      const remainingJobs = await Job.find({ input: job.input.id });

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.all.keys('success', 'message', 'jobs');
      expect(res.body.success).to.be.a('boolean');
      expect(res.body.success).to.be.true;
      expect(res.body.message).to.be.a('string');
      expect(res.body.jobs).to.be.an('array');
      expect(res.body.jobs).to.have.lengthOf(1);
      expect(res.body.jobs[0]).to.be.a('string');
      expect(res.body.jobs[0]).to.equal(job.id);
      expect(job.input.path).to.not.be.a.path();
      expect(remainingJobs).to.be.empty;
    });
  });
});
