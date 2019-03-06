const nodePath = require('path');

const { nextMockObjectId } = require('./mockObjectId');

const settings = require('../../util/settings');
const storage = require('../../util/storage');

const Input = require('../../api/models/input');

settings.load();

const inputDir = settings.value('inputDir');

function mockInput(
  _id,
  site,
  series,
  recordTimeMs,
  durationMs,
  sampleRateHz,
  sizeBytes,
  coords,
) {
  const path = nodePath.join(inputDir, site, series, 'test.wav');

  storage.copyFile('./test/mock/wav/test.wav', path);

  return new Input({
    _id,
    path,
    site,
    series,
    recordTimeMs,
    durationMs,
    sampleRateHz,
    sizeBytes,
    coords,
  });
}

// TODO: Support more than one new mocked Input
const nextMockInput = () => {
  const inputId = nextMockObjectId();
  const site = 'UCF Arboretum';
  const series = 'Hurricane Irma';
  const recordTimeMs = 1505016000000;
  const durationMs = 30000;
  const sampleRateHz = 44100;
  const sizeBytes = 5292044;
  const coords = {
    lat: 28.596238,
    long: -81.191381,
  };

  return mockInput(
    inputId,
    site,
    series,
    recordTimeMs,
    durationMs,
    sampleRateHz,
    sizeBytes,
    coords,
  );
};

function mockInputCreateJson(site, series, recordTimeMs, coords) {
  return JSON.stringify({
    site,
    series,
    recordTimeMs,
    coords,
  });
}

const nextMockInputCreateJson = () => {
  const site = 'UCF Arboretum';
  const series = 'Hurricane Irma';
  const recordTimeMs = 1505016000000;
  const coords = {
    lat: 28.596238,
    long: -81.191381,
  };
  return mockInputCreateJson(site, series, recordTimeMs, coords);
};

const getJsonFromMockInput = (input) => {
  const {
    site, series, recordTimeMs, coords,
  } = input;
  return mockInputCreateJson(site, series, recordTimeMs, coords);
};

module.exports = {
  nextMockInput,
  nextMockInputCreateJson,
  getJsonFromMockInput,
};
