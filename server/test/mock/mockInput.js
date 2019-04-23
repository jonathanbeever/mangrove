const nodePath = require('path');

const { nextMockObjectId } = require('./mockObjectId');

const settings = require('../../util/settings');
const storage = require('../../util/storage');

const Input = require('../../api/models/input');

settings.load();

const inputDir = settings.value('inputDir');

function mockInput(
  _id,
  path,
  site,
  series,
  name,
  recordTimeMs,
  durationMs,
  sampleRateHz,
  sizeBytes,
  coords,
  downloadUrl,
) {
  return new Input({
    _id,
    path,
    site,
    series,
    name,
    recordTimeMs,
    durationMs,
    sampleRateHz,
    sizeBytes,
    coords,
    downloadUrl,
  });
}

// TODO: Support more than one new mocked Input
const nextMockInput = () => {
  const inputId = nextMockObjectId();
  const site = 'UCF Arboretum';
  const series = 'Hurricane Irma';
  const name = 'Test Input';
  const recordTimeMs = 1505016000000;
  const durationMs = 30000;
  const sampleRateHz = 44100;
  const sizeBytes = 5292044;
  const coords = {
    lat: 28.596238,
    long: -81.191381,
  };

  const path = nodePath.join(inputDir, site, series, `${recordTimeMs}.wav`);
  storage.copyFile('./test/mock/wav/test.wav', path);
  const downloadUrl = `file:${path}`;

  return mockInput(
    inputId,
    path,
    site,
    series,
    name,
    recordTimeMs,
    durationMs,
    sampleRateHz,
    sizeBytes,
    coords,
    downloadUrl,
  );
};

function mockInputCreateJson(
  site,
  series,
  name = undefined,
  recordTimeMs,
  coords,
) {
  return JSON.stringify({
    site,
    series,
    ...(name ? { name } : undefined),
    recordTimeMs,
    coords,
  });
}

const nextMockInputCreateJson = (includeName = false) => {
  const site = 'UCF Arboretum';
  const series = 'Hurricane Irma';
  const name = includeName ? 'Test Input' : undefined;
  const recordTimeMs = 1505016000000;
  const coords = {
    lat: 28.596238,
    long: -81.191381,
  };
  return mockInputCreateJson(
    site,
    series,
    name,
    recordTimeMs,
    coords,
  );
};

const getJsonFromMockInput = (input, includeName = false) => {
  const {
    site,
    series,
    name,
    recordTimeMs,
    coords,
  } = input;
  return mockInputCreateJson(
    site,
    series,
    (includeName ? name : undefined),
    recordTimeMs,
    coords,
  );
};

module.exports = {
  nextMockInput,
  nextMockInputCreateJson,
  getJsonFromMockInput,
};
