const child_process = require('child_process');
const audio_duration = require('get-audio-duration');

// Splits file into 10 second intervals
// Returns array of <=10 second audio files
const splitFile = async (file) => {
  const duration = await audio_duration.getAudioDurationInSeconds(file.path);
  let fileSegments = [];

  // initialize start end times for trimming
  let start = 0;
  let segLength = 10;

  // while the current segment is not longer than the end of the file
  while (start + segLength <= duration) {
    const soxProcess = child_process.spawn;

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

// Creates list of spectrograms for array of sound files
const generateSpectrograms = (files) => {
  files.forEach(async (file) => {
    const fileSegments = await splitFile(file);

    fileSegments.forEach((fileSegment) => {
      const soxProcess = child_process.spawn;

      // generate spectrogram
      const process = soxProcess('sox', [fileSegment, '-n', 'spectrogram', '-o', `${fileSegment}.png`]);

      // output the child process outputs
      process.stdout.on('data', data => console.log(data.toString()));
      process.stderr.on('data', data => console.log(data.toString()));
    });
  });
};

module.exports = {
  generateSpectrograms,
};
