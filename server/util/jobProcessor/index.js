const R = require('r-script');

const { sanitize } = require('./rScriptSanitizer');

function JobProcessor() {
  this.process = populatedJob => new Promise((resolve, reject) => {
    R('./util/jobProcessor/R/processJob.R')
      .data(populatedJob)
      .call((err, result) => {
        if (err) {
          reject(err);
        } else {
          const sanitizedResult = sanitize(result);
          resolve(sanitizedResult);
        }
      });
  });
}

module.exports = new JobProcessor();
