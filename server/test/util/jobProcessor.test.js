const chai = require('chai');

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

describe('Job Processor', () => {
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

  it('It should error upon receiving invalid input', async () => {
    const notAPopulatedJob = null;
    try {
      await jobProcessor.process(notAPopulatedJob);
      expect.fail();
    } catch (err) {
      expect(err).to.be.an.instanceOf(Error);
    }
  });

  it('It should process an ACI Job', async () => {
    const populatedJob = await nextMockPopulatedJob(Type.ACI);
    const result = await jobProcessor.process(populatedJob);

    expect(result).to.have.all.keys(getResultKeys(Type.ACI));
    expect(result.aciTotAllL).to.be.a('number');
    expect(result.aciTotAllR).to.be.a('number');
    expect(result.aciTotAllByMinL).to.be.a('number');
    expect(result.aciTotAllByMinR).to.be.a('number');
    expect(result.aciOverTimeL).to.be.an('array');
    expect(result.aciOverTimeR).to.be.an('array');
    expect(result.aciFlValsR).to.be.an('array');
    expect(result.aciFlValsL).to.be.an('array');
  });

  it('It should process an ADI Job', async () => {
    const populatedJob = await nextMockPopulatedJob(Type.ADI);
    const result = await jobProcessor.process(populatedJob);

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
  });

  it('It should process an AEI Job', async () => {
    const populatedJob = await nextMockPopulatedJob(Type.AEI);
    const result = await jobProcessor.process(populatedJob);

    expect(result).to.have.all.keys(getResultKeys(Type.AEI));
    expect(result.aeiL).to.be.a('number');
    expect(result.aeiR).to.be.a('number');
  });

  it('It should process an BI Job', async () => {
    const populatedJob = await nextMockPopulatedJob(Type.BI);
    const result = await jobProcessor.process(populatedJob);

    expect(result).to.have.all.keys(getResultKeys(Type.BI));
    expect(result.areaL).to.be.a('number');
    expect(result.areaR).to.be.a('number');
  });

  it('It should process an NDSI Job', async () => {
    const populatedJob = await nextMockPopulatedJob(Type.NDSI);
    const result = await jobProcessor.process(populatedJob);

    expect(result).to.have.all.keys(getResultKeys(Type.NDSI));
    expect(result.ndsiL).to.be.a('number');
    expect(result.ndsiR).to.be.a('number');
    expect(result.biophonyL).to.be.a('number');
    expect(result.biophonyR).to.be.a('number');
    expect(result.anthrophonyL).to.be.a('number');
    expect(result.anthrophonyR).to.be.a('number');
  });

  it('It should process an RMS Job', async () => {
    const populatedJob = await nextMockPopulatedJob(Type.RMS);
    const result = await jobProcessor.process(populatedJob);

    expect(result).to.have.all.keys(getResultKeys(Type.RMS));
    expect(result.rmsL).to.be.a('number');
    expect(result.rmsR).to.be.a('number');
  });
});
