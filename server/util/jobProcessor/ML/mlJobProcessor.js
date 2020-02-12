const childProcess = require('child_process').spawn;

// Returns object with sound class and confidence interval
const classifySounds = (imagePath) => {
  // Spawn process to run python script to run model using Tensorflow
  // Save output of the script as array to parse for the model results
  // TODO: Rename model to actual Mangrove model
  console.log();
  console.log(`python3 util/ai/inference.py ${imagePath} util/ai/food_model.h5`);
  const classify = childProcess('python3', ['util/ai/inference.py', imagePath, 'util/ai/food_model.h5']);
  const stdout = classify.stdout.toString().split(' ');
  const stderr = classify.stderr.toString();

  // Parse process output to retrieve sound type and confidence interval
  console.log(stdout);
  console.log(stderr);
  const soundClass = stdout[stdout.length - 2];
  const confidence = stdout[stdout.length - 1];

  // Return job result object
  return { soundType: soundClass, confidence };
};


module.exports = classifySounds;
