const R = require('r-script');

const { Job } = require('../../api/models/job');
const Input = require('../../api/models/input');
const { Spec } = require('../../api/models/spec');

const { sanitize } = require('./rScriptSanitizer');

function JobProcessor() {
  this.process = populatedJob => new Promise((resolve, reject) => {
    if (!(populatedJob instanceof Job)
      || !(populatedJob.input instanceof Input)
      || !(populatedJob.spec instanceof Spec)
    ) {
      throw new Error('`populatedJob` is not an instance of a populated Job');
    }

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
