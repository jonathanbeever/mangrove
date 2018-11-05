const mongoose = require('mongoose');
const JobSpec = require('./jobSpec');

module.exports = JobSpec.discriminator('bi', new mongoose.Schema({
  minFreq:{Type:Number,min:0,default:0},
  maxFreq:{Type:Number,min:0,default:16000},
  fftW:{Type:Number,min:1,default:10}
}));
