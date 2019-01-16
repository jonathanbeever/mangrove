const chai = require('chai');
const chaiHttp = require('chai-http');

const { ObjectId } = require('mongoose').Types;

const mockDb = require('../../mock/mockDb');
const {
  mockSpec,
  nextMockSpec,
  mockSpecCreateJson,
  nextMockSpecCreateJson,
  getJsonFromMockSpec,
} = require('../../mock/mockSpec');
const { nextMockObjectId } = require('../../mock/mockObjectId');

const app = require('../../../app');

const { Spec } = require('../../../api/models/spec');
const {
  specTypeToType,
  getSpecKeys,
  getParamsFromSpec,
} = require('../../../api/models/spec/utils');
const Type = require('../../../api/models/type');
const Param = require('../../../api/models/spec/param');

const { expect } = chai;

chai.use(chaiHttp);

describe('Specs', () => {
  before(async () => {
    await mockDb.setup();
  });

  after(async () => {
    await mockDb.teardown();
  });

  beforeEach((done) => {
    Spec.deleteMany({})
      .then(() => {
        done();
      });
  });

  describe('/PUT Specs', () => {
    it('It should fail to PUT a Spec (missing required keys)', (done) => {
      const specJson = '';

      chai
        .request(app)
        .put('/specs')
        .set('Content-Type', 'application/json')
        .send(specJson)
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.all.keys('message');
          expect(res.body.message).to.be.a('string');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('It should fail to PUT a Spec (invalid keys)', (done) => {
      const specJson = JSON.stringify({
        type: Type.ACI,
        extra: true,
      });

      chai
        .request(app)
        .put('/specs')
        .set('Content-Type', 'application/json')
        .send(specJson)
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.all.keys('message');
          expect(res.body.message).to.be.a('string');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('It should fail to PUT a Spec (invalid type)', (done) => {
      const specJson = mockSpecCreateJson('invalid', {});

      chai
        .request(app)
        .put('/specs')
        .set('Content-Type', 'application/json')
        .send(specJson)
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

    it('It should fail to PUT a Spec (invalid param values)', (done) => {
      const specJsons = [];
      specJsons.push(mockSpecCreateJson(Type.ACI, {
        minFreq: -1,
        maxFreq: Param.aci.maxFreq.max + 1,
        j: 0,
        fftW: 'Thats not an integer',
      }));
      specJsons.push(mockSpecCreateJson(Type.ADI, {
        maxFreq: {},
        dbThreshold: Param.adi.dbThreshold.min - 1,
        freqStep: Param.adi.freqStep.max + 1,
        shannon: false,
      }));
      specJsons.push(mockSpecCreateJson(Type.AEI, {
        maxFreq: -1,
        dbThreshold: Param.aei.dbThreshold.min - 1,
        freqStep: null,
      }));
      specJsons.push(mockSpecCreateJson(Type.BI, {
        minFreq: -1,
        maxFreq: -1,
        fftW: 0,
      }));
      specJsons.push(mockSpecCreateJson(Type.NDSI, {
        fftW: -1,
        anthroMin: -1,
        anthroMax: Param.ndsi.anthroMax.max + 1,
        bioMin: Param.ndsi.bioMin.min - 1,
        bioMax: Param.ndsi.bioMax.max + 1,
      }));
      // specJsons.push(mockSpecCreateJson(Type.RMS, {
      //   // TODO
      // }));

      specJsons.forEach((json) => {
        chai
          .request(app)
          .put('/specs')
          .set('Content-Type', 'application/json')
          .send(json)
          .then((res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.all.keys('message');
            expect(res.body.message).to.be.a('string');
          })
          .catch((err) => {
            done(err);
          });
      });
      done();
    });

    it('It should PUT a Spec (new)', (done) => {
      const specs = [];
      specs.push(nextMockSpec(Type.ACI));
      specs.push(nextMockSpec(Type.ADI));
      specs.push(nextMockSpec(Type.AEI));
      specs.push(nextMockSpec(Type.BI));
      specs.push(nextMockSpec(Type.NDSI));
      // specs.push(nextMockSpec(Type.RMS)); // TODO

      const specJsons = [];
      specs.forEach(spec => specJsons.push(getJsonFromMockSpec(spec)));

      specJsons.forEach((json, index) => {
        chai
          .request(app)
          .put('/specs')
          .set('Content-Type', 'application/json')
          .send(json)
          .then((res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.all.keys(getSpecKeys(specs[index].type));
            expect(ObjectId(res.body.specId).toString()).to.equal(
              res.body.specId, // Check whether it's a valid ObjectId
            );
            expect(res.body.type).to.equal(specTypeToType(specs[index].type));
            expect(getParamsFromSpec(res.body)).to.deep.equal(
              getParamsFromSpec(specs[index]),
            );
          })
          .catch((err) => {
            done(err);
          });
      });

      done();
    });

    it('It should PUT a Spec (existing)', (done) => {
      const spec = nextMockSpec(Type.AEI);
      const specJson = getJsonFromMockSpec(spec);

      Spec.create(spec)
        .then(() => {
          chai
            .request(app)
            .put('/specs')
            .set('Content-Type', 'application/json')
            .send(specJson)
            .then((res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.have.all.keys(getSpecKeys(spec.type));
              expect(res.body.specId).to.equal(spec.id);
              expect(res.body.type).to.equal(specTypeToType(spec.type));
              expect(getParamsFromSpec(res.body)).to.deep.equal(
                getParamsFromSpec(spec),
              );
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

    it('It should PUT a Spec (default params)', (done) => {
      const specs = [];
      specs.push(mockSpec(nextMockObjectId(), Type.ACI, {}));
      specs.push(mockSpec(nextMockObjectId(), Type.ADI, {}));
      specs.push(mockSpec(nextMockObjectId(), Type.AEI, {}));
      specs.push(mockSpec(nextMockObjectId(), Type.BI, {}));
      specs.push(mockSpec(nextMockObjectId(), Type.NDSI, {}));
      // specs.push(mockSpec(nextMockObjectId(), Type.RMS, {})); // TODO

      const specJsons = [];
      specs.forEach(spec => specJsons.push(getJsonFromMockSpec(spec)));

      specJsons.forEach((json, index) => {
        chai
          .request(app)
          .put('/specs')
          .set('Content-Type', 'application/json')
          .send(json)
          .then((res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.all.keys(getSpecKeys(specs[index].type));
            expect(res.body.type).to.equal(specTypeToType(specs[index].type));
            expect(getParamsFromSpec(res.body)).to.deep.equal(
              getParamsFromSpec(specs[index]),
            );
          })
          .catch((err) => {
            done(err);
          });
      });
      done();
    });
  });

  describe('/GET Spec', () => {
    it('It should fail to GET a Spec (not found)', (done) => {
      chai
        .request(app)
        .get(`/specs/${nextMockObjectId()}`)
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

    it('It should GET a Spec (found)', (done) => {
      const spec = nextMockSpec(Type.AEI);

      Spec.create(spec)
        .then(() => {
          chai
            .request(app)
            .get(`/specs/${spec.id}`)
            .then((res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.have.all.keys(getSpecKeys(spec.type));
              expect(res.body.specId).to.equal(spec.id);
              expect(res.body.type).to.equal(specTypeToType(spec.type));
              expect(getParamsFromSpec(res.body)).to.deep.equal(
                getParamsFromSpec(spec),
              );
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

  describe('/GET all Specs', () => {
    it('It should GET all the Specs (none)', (done) => {
      chai
        .request(app)
        .get('/specs')
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.all.keys(['count', 'specs']);
          expect(res.body.count).to.be.equal(0);
          expect(res.body.specs).to.be.an('array');
          expect(res.body.specs).to.be.empty;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('It should GET all the Specs (many)', (done) => {
      const specs = [];
      specs.push(nextMockSpec(Type.ACI));
      specs.push(nextMockSpec(Type.ADI));
      specs.push(nextMockSpec(Type.AEI));
      specs.push(nextMockSpec(Type.BI));
      specs.push(nextMockSpec(Type.NDSI));
      // specs.push(nextMockSpec(Type.RMS)); // TODO

      Spec.insertMany(specs)
        .then(() => {
          chai
            .request(app)
            .get('/specs')
            .then((res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.be.an('object');
              expect(res.body).to.have.all.keys(['count', 'specs']);
              expect(res.body.count).to.be.equal(specs.length);
              expect(res.body.specs).to.be.an('array');
              expect(res.body.specs).to.have.lengthOf(specs.length);
              res.body.specs.forEach((spec, index) => {
                expect(spec).to.have.all.keys(getSpecKeys(specs[index].type));
                expect(spec.specId).to.equal(specs[index].id);
                expect(spec.type).to.equal(specTypeToType(specs[index].type));
                expect(getParamsFromSpec(spec)).to.deep.equal(
                  getParamsFromSpec(specs[index]),
                );
              });
              done();
            })
            .catch(err => done(err));
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('/DELETE Spec', () => {
    it('It should DELETE a Spec (not found)', (done) => {
      chai
        .request(app)
        .delete(`/specs/${nextMockObjectId()}`)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.all.keys('success', 'message');
          expect(res.body.success).to.be.a('boolean');
          expect(res.body.success).to.be.true;
          expect(res.body.message).to.be.a('string');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('It should DELETE a Spec (found)', (done) => {
      const spec = nextMockSpec(Type.AEI);

      Spec.create(spec)
        .then(() => {
          chai
            .request(app)
            .delete(`/specs/${spec.id}`)
            .then((res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.be.an('object');
              expect(res.body).to.have.all.keys('success', 'message');
              expect(res.body.success).to.be.a('boolean');
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
