const { nextMockObjectId } = require('./mockObjectId');

const settings = require('../../util/settings');
const storage = require('../../util/storage');

const Input = require('../../api/models/input');

settings.load();

const inputDir = settings.value('inputDir');

function mockInput(_id, site, series, recordTimeMs, coords) {
  const path = `${inputDir}/${site}/${series}/test.wav`;

  storage.copyFile('./test/mock/wav/test.wav', path);

  return new Input({
    _id,
    path,
    site,
    series,
    recordTimeMs,
    coords,
  });
}

const nextMockInput = () => {
  const inputId = nextMockObjectId();
  const site = 'UCF Arboretum';
  const series = 'Hurricane Irma';
  const recordTimeMs = 1505016000000;
  const coords = {
    lat: 28.596238,
    long: -81.191381,
  };
  return mockInput(inputId, site, series, recordTimeMs, coords);
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
