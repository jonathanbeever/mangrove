const os = require('os');

const options = {
  cores: os.cpus().length,
};

const setCores = (newCores) => {
  options.cores = newCores;
  return newCores;
};

const getCores = () => options.cores;

module.exports = { options, setCores, getCores };
