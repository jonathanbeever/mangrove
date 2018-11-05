const mongoose = require('mongoose');

const options = { discriminatorKey : 'type'};

const jobSpec = new mongoose.Schema({
    _id: mondoose.Schema.Types.ObjectId,
    creationTimeMs:{type: Number,required:true},
    author:{type:String, required:true}
}, options);

module.exports = mongoose.model('JobSpec', jobSpec);
