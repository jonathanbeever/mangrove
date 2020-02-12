
const childProcess = require('child_process');

// Returns object with sound class and confidence interval
const classifySounds = (imagePath) => {
  // Test function and child process is working properly
  console.log('hello');
  const spawnProcess = childProcess.spawn;
  const process = spawnProcess('ls');
  process.stdout.on('data', data => console.log(data.toString()));
  process.stderr.on('data', data => console.log(data.toString()));

  // Spawn process to run python script to run model using Tensorflow
  // Save output of the script as array to parse for the model results
  const classify = spawnProcess('python', ['ai/inference.py', imagePath, 'ai/model.h5']);
  const stdout = classify.stdout.toString().split(' ');

  // Parse process output to retrieve sound type and confidence interval
  const soundClass = stdout[stdout.length - 2];
  const confidence = stdout[stdout.length - 1];

  // Return job result object
  return { soundType: soundClass, confidence };
};


module.exports = classifySounds;
