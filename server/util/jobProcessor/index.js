const R = require('r-script');

const { sanitize } = require('./rScriptSanitizer');

function JobProcessor() {
  this.process = populatedJob => new Promise((resolve, reject) => {
    try {
      const result = R('./util/jobProcessor/R/processJob.R')
        .data(populatedJob)
        .callSync();
      resolve(sanitize(result));
    } catch (err) {
      // FIXME: `r-script` throws a string rather than an Error. Creating a new
      // Error is a workaround until the package is updated with a fix.
      reject(new Error(err));
    }
  });
}

module.exports = new JobProcessor();
