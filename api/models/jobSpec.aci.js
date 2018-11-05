const mongoose = require('mongoose');
const JobSpec = require('./jobSpec');

module.exports = JobSpec.discriminator('aci', new mongoose.Schema({
  minFreq:{type:Number,min:0,default:0},
  maxFreq:{type:Number,min:0,max:100000,default:16000},
  j:{type:Number,min:1,default:30},
  fftW:{type:Number,min:1,default:10},
}));
