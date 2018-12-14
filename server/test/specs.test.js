const chai = require('chai');
const chaiHttp = require('chai-http');

const mockDb = require('./util/mockDb');
const { nextMockSpec } = require('./util/mockSpec');

const app = require('../app');

const { Spec } = require('../api/models/spec');

const { MAX_NUM_R } = require('../api/models/spec/config');

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
    Spec.deleteMany({}, (err) => {
      done();
    });
  });

  describe('/GET specs', () => {
    it('It should GET all the Specs (none)', (done) => {
      chai.request(app)
        .get('/specs')
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.count).to.be.eql(0);
          expect(res.body.specs).to.be.an('array');
          expect(res.body.specs).to.be.empty;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('It should GET all the Specs (many), no Errors, no Defaults', (done) => {
      const specs = [];
      specs.push(
        nextMockSpec('aciSpec', {
          minFreq: 200,
          maxFreq: 3000,
          j: 20,
          fftW: 15,
        }),
      );
      specs.push(
        nextMockSpec('adiSpec', {
          maxFreq: 20000,
          dbThreshold: 30,
          freqStep: 500,
          shannon: false,
        }),
      );
      specs.push(
        nextMockSpec('aeiSpec', {
          maxFreq: 20000,
          dbThreshold: 30,
          freqStep: 500,
        }),
      );
      specs.push(
        nextMockSpec('biSpec', { minFreq: 0, maxFreq: 20000, fftW: 10 }),
      );
      specs.push(
        nextMockSpec('ndsiSpec', {
          fftW: 10,
          anthroMin: 5001,
          anthroMax: 20000,
          bioMin: 0,
          bioMax: 5000,
        }),
      );
      specs.push(nextMockSpec('rmsSpec', {}));

      Spec.insertMany(specs)
        .then(() => {
          chai
            .request(app)
            .get('/specs')
            .then((res) => {
              const content = res.body;
              expect(res).to.have.status(200);
              expect(content).to.be.an('object');
              expect(content.count).to.be.eql(specs.length);
              expect(content.specs).to.be.an('array');
              expect(content.specs).to.have.lengthOf(specs.length);

              content.specs.forEach((spec) => {
                switch (spec.type) {
                  case 'aciSpec':
                    expect(spec).to.include.any.keys(
                      'minFreq',
                      'maxFreq',
                      'j',
                      'fftW',
                    );
                    break;
                  case 'adiSpec':
                    expect(spec).to.include.any.keys(
                      'maxFreq',
                      'dbThreshold',
                      'freqStep',
                      'shannon',
                    );
                    break;
                  case 'aeiSpec':
                    expect(spec).to.include.any.keys(
                      'maxFreq',
                      'dbThreshold',
                      'freqStep',
                    );
                    break;
                  case 'biSpec':
                    expect(spec).to.include.any.keys(
                      'minFreq',
                      'maxFreq',
                      'fftW',
                    );
                    break;
                  case 'ndsiSpec':
                    expect(spec).to.include.any.keys(
                      'fftW',
                      'anthroMin',
                      'anthroMax',
                      'bioMin',
                      'bioMax',
                    );
                    break;
                  case 'rmsSpec':
                    expect(true).to.be.true; // when RMS is implemented add keys
                    break;
                  default:
                    expect(false, spec.type).to.be.true;
                    break;
                }
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

    it('It should GET all the Specs (many), no Errors, Defaults', (done) => {
      const specs = [];
      specs.push(nextMockSpec('aciSpec', {}));
      specs.push(nextMockSpec('adiSpec', {}));
      specs.push(nextMockSpec('aeiSpec', {}));
      specs.push(nextMockSpec('biSpec', {}));
      specs.push(nextMockSpec('ndsiSpec', {}));
      specs.push(nextMockSpec('rmsSpec', {}));

      Spec.insertMany(specs)
        .then(() => {
          chai
            .request(app)
            .get('/specs')
            .then((res) => {
              const content = res.body;
              expect(res).to.have.status(200);
              expect(content).to.be.an('object');
              expect(content.count).to.be.eql(specs.length);
              expect(content.specs).to.be.an('array');
              expect(content.specs).to.have.lengthOf(specs.length);

              content.specs.forEach((spec) => {
                switch (spec.type) {
                  case 'aciSpec':
                    expect(spec).to.include.any.keys(
                      'minFreq',
                      'maxFreq',
                      'j',
                      'fftW',
                    );
                    break;
                  case 'adiSpec':
                    expect(spec).to.include.any.keys(
                      'maxFreq',
                      'dbThreshold',
                      'freqStep',
                      'shannon',
                    );
                    break;
                  case 'aeiSpec':
                    expect(spec).to.include.any.keys(
                      'maxFreq',
                      'dbThreshold',
                      'freqStep',
                    );
                    break;
                  case 'biSpec':
                    expect(spec).to.include.any.keys(
                      'minFreq',
                      'maxFreq',
                      'fftW',
                    );
                    break;
                  case 'ndsiSpec':
                    expect(spec).to.include.any.keys(
                      'fftW',
                      'anthroMin',
                      'anthroMax',
                      'bioMin',
                      'bioMax',
                    );
                    break;
                  case 'rmsSpec':
                    expect(true).to.be.true; // when RMS is implemented add keys
                    break;
                  default:
                    expect(false, spec.type).to.be.true;
                    break;
                }
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

    it('It should GET all the Specs (many), Errors, no Defaults', (done) => {
      const specs = [];
      specs.push(
        nextMockSpec('aciSpec', {
          minFreq: -10,
          maxFreq: 21309813012890218,
          j: 0,
          fftW: 'Thats not an integer',
        }),
      );
      specs.push(
        nextMockSpec('adiSpec', {
          maxFreq: {},
          dbThreshold: -1000002,
          freqStep: 1000001,
          shannon: false,
        }),
      );
      specs.push(
        nextMockSpec('aeiSpec', {
          maxFreq: -1,
          dbThreshold: -1000001,
          freqStep: null,
        }),
      );
      specs.push(nextMockSpec('biSpec', { minFreq: -1, maxFreq: -1, fftW: 0 }));
      specs.push(
        nextMockSpec('ndsiSpec', {
          fftW: -1,
          anthroMin: -1,
          anthroMax: 100000112,
          bioMin: -111111111,
          bioMax: 900000001232,
        }),
      );
      specs.push(nextMockSpec('rmsSpec', {}));

      Spec.insertMany(specs)
        .then(() => {
          chai
            .request(app)
            .get('/specs')
            .then((res) => {
              const content = res.body;
              expect(res).to.have.status(200);
              expect(content).to.be.an('object');
              expect(content.count).to.be.eql(specs.length);
              expect(content.specs).to.be.an('array');
              expect(content.specs).to.have.lengthOf(specs.length);

              content.specs.forEach((spec) => {
                switch (spec.type) {
                  case 'aciSpec':
                    expect(spec).to.include.any.keys(
                      'minFreq',
                      'maxFreq',
                      'j',
                      'fftW',
                    );
                    break;
                  case 'adiSpec':
                    expect(spec).to.include.any.keys(
                      'maxFreq',
                      'dbThreshold',
                      'freqStep',
                      'shannon',
                    );
                    break;
                  case 'aeiSpec':
                    expect(spec).to.include.any.keys(
                      'maxFreq',
                      'dbThreshold',
                      'freqStep',
                    );
                    break;
                  case 'biSpec':
                    expect(spec).to.include.any.keys(
                      'minFreq',
                      'maxFreq',
                      'fftW',
                    );
                    break;
                  case 'ndsiSpec':
                    expect(spec).to.include.any.keys(
                      'fftW',
                      'anthroMin',
                      'anthroMax',
                      'bioMin',
                      'bioMax',
                    );
                    break;
                  case 'rmsSpec':
                    expect(true).to.be.true; // when RMS is implemented add keys
                    break;
                  default:
                    expect(false, spec.type).to.be.true;
                    break;
                }

                expect(spec).to.be.an('object');
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
});
