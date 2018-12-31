const chai = require("chai");
const chaiHttp = require("chai-http");

const mockDb = require("./util/mockDb");
const {
  nextMockSpec,
  nextUncheckedMockSpec,
  mockSpecCreateJson,
  getJsonFromMockSpec
} = require("./util/mockSpec");

const app = require("../app");

const { Spec } = require("../api/models/spec");

const { specType } = require("../api/models/specType");

const { MAX_NUM_R } = require("../util/rConstants");
const { mockParameter, checkDefault } = require("../test/util/mockParam");

const { expect } = chai;

chai.use(chaiHttp);

describe("Specs", () => {
  before(async () => {
    await mockDb.setup();
  });

  after(async () => {
    await mockDb.teardown();
  });

  beforeEach(done => {
    Spec.deleteMany({}, err => {
      done();
    });
  });

  describe("/GET all specs", () => {
    it("It should GET all the Specs (none)", done => {
      chai
        .request(app)
        .get("/specs")
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body.count).to.be.eql(0);
          expect(res.body.specs).to.be.an("array");
          expect(res.body.specs).to.be.empty;
          done();
        })
        .catch(err => {
          done(err);
        });
    });

    it("It should Get all the Specs (many), no Errors, no Defaults", done => {
      const specs = [];
      specs.push(
        nextUncheckedMockSpec(specType.ACI, {
          minFreq: 1,
          maxFreq: 20000,
          j: 25,
          fftW: 15
        })
      );
      specs.push(
        nextUncheckedMockSpec(specType.ADI, {
          maxFreq: 20000,
          dbThreshold: 30,
          freqStep: 2,
          shannon: false
        })
      );
      specs.push(
        nextUncheckedMockSpec(specType.AEI, {
          maxFreq: 20001,
          dbThreshold: 35,
          freqStep: 16
        })
      );
      specs.push(
        nextUncheckedMockSpec(specType.BI, {
          minFreq: 1,
          maxFreq: 20000,
          fftW: 15
        })
      );
      specs.push(
        nextUncheckedMockSpec(specType.NDSI, {
          fftW: 15,
          anthroMin: 2,
          anthroMax: 17000,
          bioMin: 5,
          bioMax: 6000
        })
      );

      Spec.insertMany(specs)
        .then(() => {
          chai
            .request(app)
            .get("/specs")
            .then(res => {
              expect(res).to.have.status(200);
              expect(res.body).to.be.an("object");
              expect(res.body).to.have.all.keys("count", "specs");
              expect(res.body.count).to.be.eql(specs.length);
              expect(res.body.specs).to.be.an("array");
              expect(res.body.specs).to.have.lengthOf(specs.length);
              res.body.specs.forEach(spec => {
                // splitting keys between type specific and base keys
                const keys = Object.keys(spec);
                const baseKeys = keys.splice(keys.length - 3, 3);
                // mock paramater only takes in type specific keys for comparison,
                // hacky way to re-use code.
                expect(mockParameter(spec.type, spec, true)).to.be.an("object");
                expect(baseKeys.includes("_id", "type", "__v"));
              });
              done();
            })
            .catch(err => done(err));
        })
        .catch(err => {
          done(err);
        });
    });
    it("It should Get all the Specs (many), no Errors, Defaults", done => {
      const specs = [];
      specs.push(nextUncheckedMockSpec(specType.ACI, {}));
      specs.push(nextUncheckedMockSpec(specType.ADI, {}));
      specs.push(nextUncheckedMockSpec(specType.AEI, {}));
      specs.push(nextUncheckedMockSpec(specType.BI, {}));
      specs.push(nextUncheckedMockSpec(specType.NDSI, {}));
      specs.push(nextUncheckedMockSpec(specType.RMS, {}));

      Spec.insertMany(specs)
        .then(() => {
          chai
            .request(app)
            .get("/specs")
            .then(res => {
              const content = res.body;
              expect(res).to.have.status(200);
              expect(content).to.be.an("object");
              expect(content.count).to.be.eql(specs.length);
              expect(content.specs).to.be.an("array");
              expect(content.specs).to.have.lengthOf(specs.length);

              content.specs.forEach(spec => {
                expect(checkDefault(spec.type, spec)).to.be.true;
              });

              done();
            })
            .catch(err => {
              done(err);
            });
        })
        .catch(err => {
          done(err);
        });
    });

    it("It should Get all the Specs (many), Errors, no Defaults", done => {
      const specs = [];
      specs.push(
        nextMockSpec(specType.ACI, {
          minFreq: -10,
          maxFreq: MAX_NUM_R + 1,
          j: 0,
          fftW: "Thats not an integer"
        })
      );
      specs.push(
        nextMockSpec(specType.ADI, {
          maxFreq: {},
          dbThreshold: -MAX_NUM_R - 1,
          freqStep: MAX_NUM_R + 1,
          shannon: false
        })
      );
      specs.push(
        nextMockSpec(specType.AEI, {
          maxFreq: -1,
          dbThreshold: -MAX_NUM_R - 1,
          freqStep: null
        })
      );
      specs.push(
        nextMockSpec(specType.BI, { minFreq: -1, maxFreq: -1, fftW: 0 })
      );
      specs.push(
        nextMockSpec("ndsiSpec", {
          fftW: -1,
          anthroMin: -1,
          anthroMax: MAX_NUM_R + 1,
          bioMin: -MAX_NUM_R - 1,
          bioMax: MAX_NUM_R + 1
        })
      );
      specs.push(nextMockSpec(specType.RMS, {}));

      Spec.insertMany(specs)
        .then(() => {
          chai
            .request(app)
            .get("/specs")
            .then(res => {
              const content = res.body;
              expect(res).to.have.status(200);
              expect(content).to.be.an("object");
              expect(content.count).to.be.eql(specs.length);
              expect(content.specs).to.be.an("array");
              expect(content.specs).to.have.lengthOf(specs.length);

              content.specs.forEach(spec => {
                expect(checkDefault(spec.type, spec)).to.be.true;
              });
              done();
            })
            .catch(err => {
              done(err);
            });
        })
        .catch(err => {
          done(err);
        });
    });
  });

  describe("/GET spec", (req, res) => {
    it("It should get a spec by ID (One)", done => {
      const testSpec = nextMockSpec(specType.AEI, {
        maxFreq: 1000,
        dbThreshold: 14,
        freqStep: 25
      });

      const testId = testSpec.id;

      Spec.create(testSpec)
        .then(() => {
          chai
            .request(app)
            .get(`/specs/${testId}`)
            .then(innerRes => {
              const content = innerRes.body;
              expect(content).to.be.not.null;
              expect(content._id).to.be.equal(testId);
              done();
            })
            .catch(err => {
              done(err);
            });
        })
        .catch(err => {
          done(err);
        });
    });
    it("It should fail to get a spec by ID (One)", done => {
      const testSpec = nextMockSpec(specType.AEI, {
        maxFreq: 1000,
        dbThreshold: 14,
        freqStep: 25
      });

      const testId = "ffffffffffffffffffffffff";

      Spec.create(testSpec)
        .then(() => {
          chai
            .request(app)
            .get(`/specs/${testId}`)
            .then(innerRes => {
              const content = innerRes.body;
              expect(content).to.be.not.null;
              expect(content.error).to.not.be.null;
              expect(content.error).to.be.a("string");
              done();
            })
            .catch(err => {
              done(err);
            });
        })
        .catch(err => {
          done(err);
        });
    });
  });

  describe("/PUT specs", () => {
    it("It should add spec, ACI (One)", done => {
      const testSpecJson = mockSpecCreateJson(specType.ACI, {
        minFreq: 1,
        maxFreq: 3001,
        j: 30,
        fftW: 13
      });
      chai
        .request(app)
        .put("/specs")
        .set("Content-Type", "application/json")
        .send(testSpecJson)
        .then(res => {
          const content = res.body;
          expect(res).to.not.be.null;
          expect(content).to.not.be.null;
          expect(res).to.have.status(201);
          done();
        })
        .catch(err => {
          done(err);
        });
    });
    it("It should add spec, AEI (One)", done => {
      const testSpecJson = mockSpecCreateJson(specType.AEI, {
        maxFreq: 3000,
        dbThreshold: 45,
        freqStep: 18
      });
      chai
        .request(app)
        .put("/specs")
        .set("Content-Type", "application/json")
        .send(testSpecJson)
        .then(res => {
          const content = res.body;
          expect(res).to.not.be.null;
          expect(content).to.not.be.null;
          expect(res).to.have.status(201);
          done();
        })
        .catch(err => {
          done(err);
        });
    });

    it("It should add spec, ADI (One)", done => {
      const testSpecJson = mockSpecCreateJson(specType.ADI, {
        maxFreq: 3000,
        dbThreshold: 45,
        freqStep: 18,
        shannon: false
      });
      chai
        .request(app)
        .put("/specs")
        .set("Content-Type", "application/json")
        .send(testSpecJson)
        .then(res => {
          const content = res.body;
          expect(res).to.not.be.null;
          expect(content).to.not.be.null;
          expect(res).to.have.status(201);
          done();
        })
        .catch(err => {
          done(err);
        });
    });
    it("It should add spec, BI (One)", done => {
      const testSpecJson = mockSpecCreateJson(specType.BI, {
        minFreq: 100,
        maxFreq: 2000,
        fftW: 20
      });
      chai
        .request(app)
        .put("/specs")
        .set("Content-Type", "application/json")
        .send(testSpecJson)
        .then(res => {
          const content = res.body;
          expect(res).to.not.be.null;
          expect(content).to.not.be.null;
          expect(res).to.have.status(201);
          done();
        })
        .catch(err => {
          done(err);
        });
    });
    it("It should add spec, NDSI (One)", done => {
      const testSpecJson = mockSpecCreateJson(specType.NDSI, {
        fftW: 20,
        anthroMin: 10,
        anthroMax: 3000,
        bioMin: 3005,
        bioMax: 5002
      });
      chai
        .request(app)
        .put("/specs")
        .set("Content-Type", "application/json")
        .send(testSpecJson)
        .then(res => {
          const content = res.body;
          expect(res).to.not.be.null;
          expect(content).to.not.be.null;
          expect(res).to.have.status(201);
          done();
        })
        .catch(err => {
          done(err);
        });
    });
    it("It should add spec, RMS (One)", done => {
      const testSpecJson = mockSpecCreateJson(specType.RMS, {});
      chai
        .request(app)
        .put("/specs")
        .set("Content-Type", "application/json")
        .send(testSpecJson)
        .then(res => {
          const content = res.body;
          expect(res).to.not.be.null;
          expect(content).to.not.be.null;
          expect(res).to.have.status(201);
          done();
        })
        .catch(err => {
          done(err);
        });
    });

    it("It should try to create duplicate, should only create one", done => {
      const testSpecJson = mockSpecCreateJson(specType.AEI, {
        maxFreq: 2000,
        dbThreshold: 17,
        freqStep: 26
      });

      // add the same spec twice, making sure that it only adds once
      chai
        .request(app)
        .put("/specs")
        .set("Content-Type", "application/json")
        .send(testSpecJson)
        .then(res => {
          const content = res.body;
          expect(res).to.not.be.null;
          expect(content).to.not.be.null;
          expect(content.maxFreq).to.be.eql(2000);
          expect(content.dbThreshold).to.be.eql(17);
          expect(content.freqStep).to.be.eql(26);
          expect(res).to.have.status(201);

          chai
            .request(app)
            .put("/specs")
            .set("Content-Type", "application/json")
            .send(testSpecJson)
            .then(innerRes => {
              const innerContent = innerRes.body;
              expect(innerRes).to.not.be.null;
              expect(innerContent).to.not.be.null;
              expect(innerContent.maxFreq).to.be.eql(2000);
              expect(innerContent.dbThreshold).to.be.eql(17);
              expect(innerContent.freqStep).to.be.eql(26);
              expect(innerRes).to.have.status(200);
              // status code should return 200 OK, if 201 then that means a new spec was created.
            })
            .catch(err => {
              done(err);
            });
          done();
        })
        .catch(err => {
          done(err);
        });
    });
    it("It should not recognize the invalid spec type", done => {
      const testSpecJson = mockSpecCreateJson("invalidSpec", {
        maxFreq: 2000,
        dbThreshold: 17,
        freqStep: 26
      });
      chai
        .request(app)
        .put("/specs")
        .set("Content-Type", "application/json")
        .send(testSpecJson)
        .then(res => {
          const content = res.body;
          expect(res).to.not.be.null;
          expect(content).to.not.be.null;
          expect(Object.keys(content)[0]).to.be.string("error");
          done();
        })
        .catch(err => {
          done(err);
        });
    });
  });

  describe("/DELETE Spec", () => {
    it("It should delete one spec given Id", done => {
      const testSpec = nextMockSpec(specType.AEI, {
        maxFreq: 2000,
        dbThreshold: 17,
        freqStep: 26
      });

      Spec.create(testSpec)
        .then(
          chai
            .request(app)
            .delete(`/specs/${testSpec.id}`)
            .then(res => {
              const content = res.body;
              expect(content.success).to.be.true;
              expect(content.message).to.be.string(
                `Succesfully deleted Spec with specId: ${testSpec.id}`
              );
            })
            .catch(err => {
              done(err);
            }),
          chai
            .request(app)
            .delete(`/specs/${testSpec.id}`)
            .then(res => {
              const content = res.body;
              expect(content.success).to.be.true;
              expect(content.message).to.be.string(
                `No valid entry found for specId: ${testSpec.id}`
              );
              done();
            })
            .catch(err => {
              done(err);
            })
        )
        .catch(err => {
          done(err);
        });
    });
  });
});
