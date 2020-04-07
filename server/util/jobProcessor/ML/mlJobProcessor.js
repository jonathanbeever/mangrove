const childProcesses = require('child_process');
const audioDuration = require('get-audio-duration');

const childProcess = childProcesses.spawn;
const childProcessSync = childProcesses.spawnSync;

// Extracts a specific section of a file into its own sound file with a specific length
const getFileSegment = async (filepath, startTime, segLength, fileDuration) => {
  // If the specified length puts the end of the new sound file
  // past the original file's duration, change the segment length
  const newSegLength = (startTime + segLength > fileDuration)
    ? fileDuration - startTime
    : segLength;

  // Get file name without file extension and create a directory
  const filename = filepath.split('.').slice(0, -1).join('.');
  childProcess('mkdir', [`${filename}/`]);

  const finalSegmentName = `${filename}/${startTime}_${newSegLength}.wav`;
  const soxProcess = childProcess('sox', ['--ignore-length', filepath, finalSegmentName, 'trim', startTime, newSegLength]);

  // output the child process outputs
  soxProcess.stdout.on('data', data => console.log(data.toString()));
  soxProcess.stderr.on('data', data => console.log(data.toString()));

  return finalSegmentName;
};

// Gets spectrogram from a sound file
const getSpectrogram = async (segment, segmentName) => {
  childProcessSync('sox', [segment, '-n', 'spectrogram', '-o', `${segmentName}.png`]);
  return segmentName;
};

// Runs a spectrogram through the model to listen for sounds
const classifySound = async (segmentName) => {
  const process = childProcessSync('python3.5', ['util/ai/inference.py', `${segmentName}.png`, 'util/ai/cnn_03-13-20.h5']);
  const output = process.stdout.toString().split('\n');

  // Retrieve segment information based on segmentName
  // segmentName is in format ../filename/x_y.png
  // Where x is the start time of the file segment in terms of the full input file
  // and y is the duration of the file segment
  let fileSegment = segmentName.split('/');
  fileSegment = fileSegment[fileSegment.length - 1].split('_');

  const startTime = parseFloat(fileSegment[0]);
  const duration = parseFloat(fileSegment[1]);
  const confidence = parseFloat(output[output.length - 2]);

  const result = {
    soundType: output[output.length - 3],
    confidence,
    startTime,
    duration,
  };
  return result;
};

// Deletes a file segment and its spectrogram
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

  // The classification is structured as nested Promises so that we can stagger
  // each file segment's extraction, spectrogram generation, and model analysis.
  // This is to make this partially asynchronous even though each step relies upon
  // the previous step in reference to specific file segments.
  while (currentStart < duration) {
    const fileSegment = getFileSegment(job.input.path, currentStart, segmentLength, duration)
      .then((segment) => {
        if (!segment) return;

        // Chop off file extension to prepare for conversion to an image
        const segmentName = segment.split('.').slice(0, -1).join('.');

        // Generate spectrogram from file segment
        getSpectrogram(segment, segmentName)
          .then((spectrogramName) => {
            // Run ML script with spectrogram
            classifySound(spectrogramName)
              .then((sound) => {
                // Clean up after yourself
                deleteFile(segment, spectrogramName);

                // Save result if the model returns a sound
                if (sound.confidence) sounds.push(sound);
              });
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));

    // Save file segment analysis as a Promise
    // so we can wait for all segments to be analyzed
    fileSegments.push(fileSegment);

    // Move to next 10 second segment
    currentStart += 10;
  }

  return Promise.all(fileSegments)
    .then(() => {
      // Remove the file's temporary directory where we saved the file segments and spectrograms
      childProcess('rm', ['-rf', job.input.path.split('.').slice(0, -1).join('.')]);
      return { sounds };
    }).catch(err => console.log(err));
};

module.exports = classifySounds;
