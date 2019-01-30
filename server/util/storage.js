const os = require('os');
const fs = require('fs');
const nodePath = require('path');

const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

const settings = require('./settings');

settings.load();

const inputDir = settings.value('inputDir');

const getUploadPath = input => nodePath.join(inputDir, input.site, input.series);

const copyFile = (source, dest) => {
  try {
    if (fs.existsSync(source)) {
      mkdirp.sync(nodePath.dirname(dest));
      fs.copyFileSync(source, dest);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const deleteInputFile = (path) => {
  fs.unlinkSync(path);
  if (fs.readdirSync(nodePath.dirname(path)).length <= 0) {
    fs.rmdirSync(nodePath.dirname(path));
  }
};

const setCores = async (numCores, queue = null) => {
  if (queue !== null) {
    await queue.pause();
  }
  if (numCores > os.cpus().length) {
    settings.setValue('cores', os.cpus().length);
  } else if (numCores <= 0) {
    settings.setValue('cores', 1);
  } else {
    settings.setValue('cores', numCores);
  }
  if (queue !== null) {
    await queue.pause();
  }
};

const deleteInputDir = () => {
  rimraf.sync(inputDir);
};

const deleteRootDir = () => {
  rimraf.sync(settings.rootDir);
};

module.exports = {
  getUploadPath,
  copyFile,
  deleteInputFile,
  deleteInputDir,
  deleteRootDir,
  setCores,
};
