const fs = require('fs');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

const settings = require('./settings');

settings.load();

const inputDir = settings.value('inputDir');

const getUploadPath = input => `${inputDir}/${input.site}/${input.series}`;

function getParentDirectory(path) {
  return path.substring(0, path.lastIndexOf('/'));
}

const copyFile = (source, dest) => {
  if (fs.existsSync(source)) {
    const path = getParentDirectory(dest);
    mkdirp(path, (mkdirErr) => {
      if (mkdirErr) {
        throw mkdirErr;
      } else {
        fs.copyFile(source, dest, (copyErr) => {
          if (copyErr) throw copyErr;
        });
      }
    });
  } else {
    throw new Error(`No file found at ${source}`);
  }
};

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
  copyFile,
  deleteInputFile,
  deleteInputDir,
  deleteRootDir,
};
