const childProcesses = require('child_process');
const audioDuration = require('get-audio-duration');

const childProcess = childProcesses.spawn;
const childProcessSync = childProcess.spawnSync;

const getFileSegment = async (filepath, startTime, segLength, fileDuration) => {
  const newSegLength = (startTime + segLength > fileDuration)
    ? fileDuration - startTime
    : segLength;

  // Get file name without file extension and create a directory
  const filename = filepath.split('.').slice(0, -1).join('.');
  await childProcess.spawn('mkdir', [`${filename}/`]);

  const finalSegmentName = `${filename}/${startTime}_${newSegLength}.wav`;

  const soxProcess = childProcess.spawn('sox', ['--ignore-length', filepath, finalSegmentName, 'trim', startTime, newSegLength]);

  // output the child process outputs
  soxProcess.stdout.on('data', data => console.log(data.toString()));
  soxProcess.stderr.on('data', data => console.log(data.toString()));

  return finalSegmentName;
};

const getSpectrogram = async (segment, segmentName) => {
  childProcessSync('sox', [segment, '-n', 'spectrogram', '-o', `${segmentName}.png`]);
  return segmentName;
};

const classifySound = async (segmentName) => {
  childProcessSync('python3.5', ['util/ai/inference.py', `${segmentName}.png`, 'util/ai/cnn_03-13-20.h5']);
  return 'train';
};

const deleteFile = async (segment, segmentName) => {
  childProcess('rm', [`${segmentName}.png`, segment]);
};

// Returns object with sound class and confidence interval
const classifySounds = async (job) => {
  const duration = await audioDuration.getAudioDurationInSeconds(job.input.path);
  const segmentLength = 10;
  let currentStart = 0;
  const sounds = [];

  const fileSegments = [];

  while (currentStart < duration) {
    const fileSegment = getFileSegment(job.input.path, currentStart, segmentLength, duration)
      .then((segment) => {
        if (!segment) return;

        // Chop off file extension
        const segmentName = segment.split('.').slice(0, -1).join('.');

        // Generate spectrogram from file segment
        getSpectrogram(segment, segmentName)
          .then((spectrogramName) => {
            console.log(`python3.5 util/ai/inference.py ${spectrogramName}.png util/ai/cnn_03-13-20.h5`);

            // Run ML script with spectrogram
            classifySound(spectrogramName)
              .then((sound) => {
                // Clean up after yourself
                deleteFile(segment, spectrogramName);
                sounds.push(sound);
              });
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));

    fileSegments.push(fileSegment);

    // Move to next segment
    currentStart += 10;
  }

  return Promise.all(fileSegments)
    .then(() => {
      childProcess('rm', ['-rf', job.path.input.split('.').slice(0, -1).join('.')]);
      return sounds;
    }).catch(err => console.log(err));
};

module.exports = classifySounds;
