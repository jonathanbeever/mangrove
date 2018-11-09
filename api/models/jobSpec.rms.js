const mongoose = require('mongoose');
const JobSpec = require('./jobSpec');

module.exports = JobSpec.discriminator('rmsSpec', new mongoose.Schema({
  // Implement what rms needs
}));
