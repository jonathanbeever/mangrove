var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/soundscapeDB');
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // connected
  console.log('connected');

});

// I read online about exporting these all to their own files as a
// convention, thoughts?

const FileMetadataSchema = new Schema({
  fileName: {
    type: String,
    required: true
  },
  fileLocation: {
    type: String,
    required: true
  },
  date: Date,
  siteName: String,
  siteCoordinates: [Number],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('FileMetadataModel', FileMetadataSchema);

// Acoustic Complexity
const AciMetricDataSchema = new Schema({
  fileUid: {
    type: Schema.Types.ObjectId,
    ref: 'FileMetadata'
  },
  minFreq: Number,
  maxFreq: Number,
  j: Number,
  fftW: Number
});

module.exports = mongoose.model('AciMetricDataModel', AciMetricDataSchema);

const AciOutputSchema = new Schema({
  fileUid: {
    type: Schema.Types.ObjectId,
    ref: 'FileMetadata'
  },
  parameters: {
    type: Schema.Types.ObjectId,
    ref: 'AciMetricData'
  },
  aciTotAllLeft: Number,
  aciTotAllRight: Number,
  aciTotAllLeftBymin: Number,
  aciTotAllRightBymin: Number,
  aciFlLeftVals: [Number],
  aciFlRightVals: [Number],
  aciLeftMatrix: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'MatrixRow'
    }]
  },
  aciRightMatrix: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'MatrixRow'
    }]
  }
});

module.exports = mongoose.model('AciOutputModel', AciOutputSchema);

const MatrixRowSchema = new Schema({
  rowNumber: Number,
  values: [Number]
});

module.exports = mongoose.model('MatrixRowModel', MatrixRowSchema);

const NdsiMetricDataSchema = new Schema({
  fileUid: {
    type: Schema.Types.ObjectId,
    ref: 'FileMetadata'
  },
  fftW: Number,
  anthroMin: Number,
  anthroMax: Number,
  bioMin: Number,
  bioMax: Number
});

module.exports = mongoose.model('NdsiMetricDataModel', NdsiMetricDataSchema);

const NdsiOutputSchema = new Schema({
  fileUid: {
    type: Schema.Types.ObjectId,
    ref: 'FileMetadata'
  },
  parameters: {
    type: Schema.Types.ObjectId,
    ref: 'NdsiMetricData'
  },
  ndsiLeft: Number,
  ndsiRight: Number,
  biophonyLeft: Number,
  anthroponyLeft: Number,
  biophonyRight: Number,
  anthroponyRight: Number
});

module.exports = mongoose.model('NdsiOutputModel', NdsiOutputSchema);

// Acoustic Diversity
const AdiMetricDataSchema = new Schema({
  fileUid: {
    type: Schema.Types.ObjectId,
    ref: 'FileMetadata'
  },
  maxFreq: Number,
  dbThreshold: Number,
  freqStep: Number,
  shannon: Boolean
});

module.exports = mongoose.model('AdiMetricDataModel', AdiMetricDataSchema);

const AdiOutputSchema = new Schema({
  fileUid: {
    type: Schema.Types.ObjectId,
    ref: 'FileMetadata'
  },
  parameters: {
    type: Schema.Types.ObjectId,
    ref: 'AdiMetricData'
  },
  adiLeft: Number,
  adiRight: Number,
  leftBand: [Number],
  rightBand: [Number],
  leftBandRange: [String],
  rightBandRange: [String]
});

module.exports = mongoose.model('AdiOutputModel', AdiOutputSchema);

// Acoustic Evenness
const EvennessDataSchema = new Schema({
  fileUid: {
    type: Schema.Types.ObjectId,
    ref: 'FileMetadata'
  },
  maxFreq: Number,
  dbThreshold: Number,
  freqStep: Number
});

module.exports = mongoose.model('EvennessDataModel', EvennessDataSchema);

const EvennessOutputSchema = new Schema({
  fileUid: {
    type: Schema.Types.ObjectId,
    ref: 'FileMetadata'
  },
  parameters: {
    type: Schema.Types.ObjectId,
    ref: 'EvennessMetricData'
  },
  aeiLeft: Number,
  aeiRight: Number
});

module.exports = mongoose.model('EvennessOutputModel', EvennessOutputSchema);

// Bioacoustic Index
const BioacousticDataSchema = new Schema({
  fileUid: {
    type: Schema.Types.ObjectId,
    ref: 'FileMetadata'
  },
  minFreq: Number,
  maxFreq: Number,
  fftW: Number
});

module.exports = mongoose.model('BioacousticDataModel', BioacousticDataSchema);

const BioacousticOutputSchema = new Schema({
  fileUid: {
    type: Schema.Types.ObjectId,
    ref: 'FileMetadata'
  },
  parameters: {
    type: Schema.Types.ObjectId,
    ref: 'BioacousticMetricData'
  },
  leftArea: Number,
  rightArea: Number
});

module.exports = mongoose.model('BioacousticOutputModel', BioacousticOutputSchema);

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('UserModel', UserSchema);

const GroupSchema = new Schema({
  groupName: {
    type: String,
    required: true
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
  // Analysis results shared with group?
  // Group comments or something like that?
});

module.exports = mongoose.model('GroupModel', GroupSchema);
