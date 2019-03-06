const fs = require('fs');

const execa = require('execa');
const ffprobe = require('ffprobe-static');

const getAudioMetadata = async (path) => {
  if (!fs.existsSync(path)) {
    throw new Error(`File does not exist at path ${path}`);
  }

  const params = [
    '-v', 'error',
    '-of', 'json',
    '-show_entries', 'format=duration,size',
    '-show_entries', 'stream=sample_rate',
  ];

  try {
    const result = await execa(ffprobe.path, [...params, path]);
    const json = JSON.parse(result.stdout);
    const metadata = {
      durationMs: parseFloat(json.format.duration, 10) * (10 ** 3),
      sampleRateHz: parseInt(json.streams[0].sample_rate, 10),
      sizeBytes: parseInt(json.format.size, 10),
    };

    return metadata;
  } catch (err) {
    console.error(err);
    throw new Error(`Failed to get metadata from file: ${path}`);
  }
};

module.exports = {
  getAudioMetadata,
};
