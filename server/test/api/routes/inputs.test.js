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

const app = require('../../../app');
const settings = require('../../../util/settings');
const {
  deleteInputDir,
  deleteRootDir,
} = require('../../../util/storage');

const Input = require('../../../api/models/input');
const {
  getInputKeys,
  newInputKeys,
  coordsKeys,
} = require('../../../api/models/input/utils');

const { expect } = chai;

const inputDir = settings.value('inputDir');

chai.use(chaiFs);
chai.use(chaiHttp);

describe('Inputs', () => {
  before(async () => {
    await mockDb.setup();
  });

  after(async () => {
    await Promise.all([
      mockDb.teardown(),
      deleteRootDir(),
    ]);
  });

  beforeEach((done) => {
    Input.deleteMany({}, (err) => {
      deleteInputDir(done);
    });
  });

  describe('/PUT Input', () => {
    // TODO: Deal with error "Multipart: Boundary not found"
    it('It should fail to PUT an Input (missing both keys)', (done) => {
      chai.request(app)
        .put('/inputs')
        // .set('Content-Type', 'multipart/form-data')
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

    it('It should fail to PUT an Input (missing file)', (done) => {
      const inputJson = nextMockInputCreateJson();

      chai.request(app)
        .put('/inputs')
        .set('Content-Type', 'multipart/form-data')
        .field('json', inputJson)
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

    it('It should fail to PUT an Input (missing JSON)', (done) => {
      chai.request(app)
        .put('/inputs')
        .set('Content-Type', 'multipart/form-data')
        .attach('file', './test/mock/wav/test.wav')
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.all.keys('message');
          expect(res.body.message).to.be.a('string');
          expect(inputDir).to.not.be.a.path();
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('It should fail to PUT an Input (invalid keys in request)', (done) => {
      const inputJson = nextMockInputCreateJson();

      chai.request(app)
        .put('/inputs')
        .set('Content-Type', 'multipart/form-data')
        .field('json', inputJson)
        .field('extra', true)
        .attach('file', './test/mock/wav/test.wav')
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.all.keys('message');
          expect(res.body.message).to.be.a('string');
          expect(inputDir).to.not.be.a.path();
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('It should fail to PUT an Input (invalid JSON)', (done) => {
      const inputJson = '';

      chai.request(app)
        .put('/inputs')
        .set('Content-Type', 'multipart/form-data')
        .field('json', inputJson)
        .attach('file', './test/mock/wav/test.wav')
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.all.keys('message');
          expect(res.body.message).to.be.a('string');
          expect(inputDir).to.not.be.a.path();
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('It should fail to PUT an Input (missing keys in JSON)', (done) => {
      const inputJson = '{}';

      chai.request(app)
        .put('/inputs')
        .set('Content-Type', 'multipart/form-data')
        .field('json', inputJson)
        .attach('file', './test/mock/wav/test.wav')
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.all.keys('message');
          expect(res.body.message).to.be.a('string');
          expect(inputDir).to.not.be.a.path();
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('It should fail to PUT an Input (invalid keys in JSON)', (done) => {
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

      chai.request(app)
        .put('/inputs')
        .set('Content-Type', 'multipart/form-data')
        .field('json', inputJson)
        .attach('file', './test/mock/wav/test.wav')
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.all.keys('message');
          expect(res.body.message).to.be.a('string');
          expect(inputDir).to.not.be.a.path();
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('It should fail to PUT an Input (file not a WAV)', (done) => {
      const inputJson = nextMockInputCreateJson();

      chai.request(app)
        .put('/inputs')
        .set('Content-Type', 'multipart/form-data')
        .field('json', inputJson)
        .attach('file', './README.md')
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.all.keys('message');
          expect(res.body.message).to.be.a('string');
          expect(inputDir).to.not.be.a.path();
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('It should PUT an Input (new)', (done) => {
      const input = nextMockInput();
      const inputJson = getJsonFromMockInput(input);

      chai.request(app)
        .put('/inputs')
        .set('Content-Type', 'multipart/form-data')
        .field('json', inputJson)
        .attach('file', './test/mock/wav/test.wav')
        .then((res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.all.keys(getInputKeys());
          expect(ObjectId(res.body.inputId).toString()).to.equal(
            res.body.inputId, // Checks whether it's a valid ObjectId
          );
          expect(res.body.path).to.equal(input.path);
          expect(res.body.site).to.equal(input.site);
          expect(res.body.series).to.equal(input.series);
          expect(res.body.recordTimeMs).to.equal(input.recordTimeMs);
          expect(res.body.coords).to.have.all.keys(coordsKeys());
          expect(res.body.coords.lat).to.equal(input.coords.lat);
          expect(res.body.coords.long).to.equal(input.coords.long);
          expect(res.body.path).to.be.a.file()
            .and.equal('./test/mock/wav/test.wav');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    // TODO: Input already exists
  });
});
