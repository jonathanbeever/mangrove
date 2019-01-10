const fs = require('fs');
const rimraf = require('rimraf');

const settings = require('./settings');

const inputDir = settings.value('inputDir');

const getUploadPath = json => `${inputDir}/${json.site}/${json.series}`;

function getParentDirectory(path) {
  return path.substring(0, path.lastIndexOf('/'));
}

function deleteEmptyDirs(path) {
  if (path !== inputDir) {
    fs.rmdir(path, (err) => {
      if (!err) {
        deleteEmptyDirs(getParentDirectory(path));
      }
    });
  }
}

const deleteInputFile = (path) => {
  fs.unlink(path, (err) => {
    if (err) {
      console.error(err);
    } else {
      deleteEmptyDirs(getParentDirectory(path));
    }
  });
};

const deleteInputDir = (cb) => {
  rimraf(inputDir, (err) => {
    if (!err) {
      cb();
    } else {
      console.error(err);
    }
  });
};

const deleteRootDir = () => {
  rimraf(settings.rootDir, (err) => {
    if (err) console.error(err);
  });
};

module.exports = {
  getUploadPath,
  deleteInputFile,
  deleteInputDir,
  deleteRootDir,
};
