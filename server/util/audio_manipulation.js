const childProcess = require('child_process');
const audioDuration = require('get-audio-duration');

const createFileSegments = async (duration, file) => {
  const fileSegments = [];

  // initialize start end times for trimming
  let start = 0;
  let segLength = 10;

  // while the current segment is not longer than the end of the file
  while (start + segLength <= duration) {
    const soxProcess = childProcess.spawn;

    // trim the file using the start and end times
    const process = soxProcess('sox', ['--ignore-length', file.path, `${file.path}_${start}_${segLength}.wav`, 'trim', start, segLength]);

    // output the child process outputs
    process.stdout.on('data', data => console.log(data.toString()));
    process.stderr.on('data', data => console.log(data.toString()));

    // add file name to array of file segments
    fileSegments.push(`${file.path}_${start}_${segLength}.wav`);

    // update the start and end times
    start += 10;

    // if the start time + 10 seconds is greater than the duration,
    // you've reached the end of the file
    if (start > duration) break;

    // if the end time + 10 seconds is greater than the duration
    // but the start time + 10 seconds is not greater than the duration,
    // then you are on the last segment, which might be less than 10 full seconds
    if (start + segLength > duration) segLength = duration - start;
  }

  return fileSegments;
};

// Splits file into 10 second intervals
// Returns array of <=10 second audio files
const splitFile = async (file) => {
  const duration = await audioDuration.getAudioDurationInSeconds(file.path);

  return (async () => {
    const data = await createFileSegments(duration, file);
    return data;
  })();
};

const runSoxSpectrogram = async (fileSegment) => {
  const soxProcess = childProcess.spawn;

  // generate spectrogram
  const process = soxProcess('sox', [fileSegment, '-n', 'spectrogram', '-o', `${fileSegment}.png`]);

  // output the child process outputs
  process.stdout.on('data', data => console.log(data.toString()));
  process.stderr.on('data', data => console.log(data.toString()));

  return `${fileSegment}.png`;
};

// Creates list of spectrograms for array of sound files
const generateSpectrograms = async (files) => {
  const spectrograms = [];

  for (const file of files) {
    const fileSegments = await splitFile(file).then(value => value);

    for (const fileSegment of fileSegments) {
      const data = await runSoxSpectrogram(fileSegment).then(value => value);

      spectrograms.push(data);
    }
  }

  return spectrograms;
};

module.exports = {
  generateSpectrograms,
};
