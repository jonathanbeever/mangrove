const fs = require('fs');
const nodePath = require('path');

const os = require('os');

const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

const settings = require('./settings');

settings.load();

const getCores = () => settings.value('cores');

const setCores = (newCores) => {
  if (newCores <= os.cpus().length && newCores > 0) { settings.setValue('cores', newCores); } else {
    settings.setValue('cores', os.cpus().length);
  }
};

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

const deleteInputDir = () => {
  rimraf.sync(inputDir);
};

const deleteRootDir = () => {
  rimraf.sync(settings.rootDir);
};

module.exports = {
  getUploadPath,
  getCores,
  setCores,
  copyFile,
  deleteInputFile,
  deleteInputDir,
  deleteRootDir,
};
