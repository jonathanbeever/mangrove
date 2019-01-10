const chai = require('chai');
const chaiHttp = require('chai-http');

const { ObjectId } = require('mongoose').Types;

const mockDb = require('../../mock/mockDb');
const {
  nextMockInput, nextMockInputCreateJson, getJsonFromMockInput,
} = require('../../mock/mockInput');

const app = require('../../../app');
const {
  deleteInputDir, deleteRootDir,
} = require('../../../util/storage');

const Input = require('../../../api/models/input');
const {
  getInputKeys, newInputKeys, coordsKeys,
} = require('../../../api/models/input/utils');

const { expect } = chai;

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
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
