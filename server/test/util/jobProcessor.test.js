const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const mockDb = require('../mock/mockDb');
const { nextMockPopulatedJob } = require('../mock/mockJob');

const {
  deleteInputDir,
  deleteRootDir,
} = require('../../util/storage');

const jobProcessor = require('../../util/jobProcessor');
const Input = require('../../api/models/input');
const { Spec } = require('../../api/models/spec');
const { Job } = require('../../api/models/job');
const Type = require('../../api/models/type');
const { getResultKeys } = require('../../api/models/job/utils');

const { expect } = chai;

chai.use(chaiAsPromised);

describe('Job Processor', () => {
  before(async () => {
    await mockDb.setup();
  });

  after(async () => {
    await mockDb.teardown();
    deleteRootDir();
  });

  beforeEach((done) => {
    Promise.all([
      Input.deleteMany({})
        .then(() => {
          deleteInputDir();
        }),
      Spec.deleteMany({}),
      Job.deleteMany({}),
    ])
      .then(() => done())
      .catch(err => done(err));
  });

  it('It should error upon receiving invalid input', (done) => {
    const notAPopulatedJob = null;
    expect(jobProcessor.process(notAPopulatedJob)).to.be.rejectedWith(Error)
      .notify(done);
  });

  it('It should process an ACI Job', (done) => {
    nextMockPopulatedJob(Type.ACI)
      .then((populatedJob) => {
        jobProcessor.process(populatedJob)
          .then((result) => {
            expect(result).to.have.all.keys(getResultKeys(Type.ACI));
            expect(result.aciTotAllL).to.be.a('number');
            expect(result.aciTotAllR).to.be.a('number');
            expect(result.aciTotAllByMinL).to.be.a('number');
            expect(result.aciTotAllByMinR).to.be.a('number');
            expect(result.aciFlValsL).to.be.an('array');
            expect(result.aciFlValsR).to.be.an('array');
            expect(result.aciMatrixL).to.be.an('array');
            result.aciMatrixL.forEach((subarray) => {
              expect(subarray).to.be.an('array');
              subarray.forEach(item => expect(item).to.be.a('number'));
            });
            expect(result.aciMatrixR).to.be.an('array');
            result.aciMatrixR.forEach((subarray) => {
              expect(subarray).to.be.an('array');
              subarray.forEach(item => expect(item).to.be.a('number'));
            });
            done();
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
  });

  it('It should process an ADI Job', (done) => {
    nextMockPopulatedJob(Type.ADI)
      .then((populatedJob) => {
        jobProcessor.process(populatedJob)
          .then((result) => {
            expect(result).to.have.all.keys(getResultKeys(Type.ADI));
            expect(result.adiL).to.be.a('number');
            expect(result.adiR).to.be.a('number');
            expect(result.bandL).to.be.an('array');
            result.bandL.forEach(item => expect(item).to.be.a('number'));
            expect(result.bandR).to.be.an('array');
            result.bandR.forEach(item => expect(item).to.be.a('number'));
            expect(result.bandRangeL).to.be.an('array');
            result.bandRangeL.forEach(item => expect(item).to.be.a('string'));
            expect(result.bandRangeR).to.be.an('array');
            result.bandRangeR.forEach(item => expect(item).to.be.a('string'));
            done();
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
  });

  it('It should process an AEI Job', (done) => {
    nextMockPopulatedJob(Type.AEI)
      .then((populatedJob) => {
        jobProcessor.process(populatedJob)
          .then((result) => {
            expect(result).to.have.all.keys(getResultKeys(Type.AEI));
            expect(result.aeiL).to.be.a('number');
            expect(result.aeiR).to.be.a('number');
            done();
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
  });

  it('It should process an BI Job', (done) => {
    nextMockPopulatedJob(Type.BI)
      .then((populatedJob) => {
        jobProcessor.process(populatedJob)
          .then((result) => {
            expect(result).to.have.all.keys(getResultKeys(Type.BI));
            expect(result.areaL).to.be.a('number');
            expect(result.areaR).to.be.a('number');
            done();
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
  });

  it('It should process an NDSI Job', (done) => {
    nextMockPopulatedJob(Type.NDSI)
      .then((populatedJob) => {
        jobProcessor.process(populatedJob)
          .then((result) => {
            expect(result).to.have.all.keys(getResultKeys(Type.NDSI));
            expect(result.ndsiL).to.be.a('number');
            expect(result.ndsiR).to.be.a('number');
            expect(result.biophonyL).to.be.a('number');
            expect(result.biophonyR).to.be.a('number');
            expect(result.anthrophonyL).to.be.a('number');
            expect(result.anthrophonyR).to.be.a('number');
            done();
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
  });

  // it('It should process an RMS Job', (done) => {
  //   nextMockPopulatedJob(Type.RMS)
  //     .then((populatedJob) => {
  //       jobProcessor.process(populatedJob)
  //         .then((result) => {
  //           // TODO
  //           done();
  //         })
  //         .catch(err => done(err));
  //     })
  //     .catch(err => done(err));
  // });
});
