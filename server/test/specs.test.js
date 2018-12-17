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

const { MAX_NUM_R } = require("../api/models/spec/config");
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

  describe("/GET specs", () => {
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
      specs.push(nextUncheckedMockSpec("aciSpec", {}));
      specs.push(nextUncheckedMockSpec("adiSpec", {}));
      specs.push(nextUncheckedMockSpec("aeiSpec", {}));
      specs.push(nextUncheckedMockSpec("biSpec", {}));
      specs.push(nextUncheckedMockSpec("ndsiSpec", {}));
      specs.push(nextUncheckedMockSpec("rmsSpec", {}));

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
        nextMockSpec("aciSpec", {
          minFreq: -10,
          maxFreq: MAX_NUM_R + 1,
          j: 0,
          fftW: "Thats not an integer"
        })
      );
      specs.push(
        nextMockSpec("adiSpec", {
          maxFreq: {},
          dbThreshold: -MAX_NUM_R - 1,
          freqStep: MAX_NUM_R + 1,
          shannon: false
        })
      );
      specs.push(
        nextMockSpec("aeiSpec", {
          maxFreq: -1,
          dbThreshold: -MAX_NUM_R - 1,
          freqStep: null
        })
      );
      specs.push(nextMockSpec("biSpec", { minFreq: -1, maxFreq: -1, fftW: 0 }));
      specs.push(
        nextMockSpec("ndsiSpec", {
          fftW: -1,
          anthroMin: -1,
          anthroMax: MAX_NUM_R + 1,
          bioMin: -MAX_NUM_R - 1,
          bioMax: MAX_NUM_R + 1
        })
      );
      specs.push(nextMockSpec("rmsSpec", {}));

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
    //TODO GET BY ID
  });

  //TODO PUT SPECS
  describe("/PUT specs", () => {});

  //TODO DELETE SPECS
});
