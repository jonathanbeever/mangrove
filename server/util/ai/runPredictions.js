const mlJobProcessor = require('../jobProcessor/ML/mlJobProcessor');

const runPredictions = (files) => {
  const predictions = [];

  files.forEach((file) => {
    predictions.push(mlJobProcessor(file));
  });
  console.log(predictions);
  return predictions;
};

module.exports = { runPredictions };
