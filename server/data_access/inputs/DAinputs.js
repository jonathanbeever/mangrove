const mongoose = require('mongoose');

const Input = require('../../api/models/input');
const { Job } = require('../../api/models/job');

const { deleteInputFile } = require('../../util/storage');

const CreateInput = async (name, filepath, inputInfo, audioMetadata) => {
  const input = new Input({
    _id: new mongoose.Types.ObjectId(),
    path: filepath,
    site: inputInfo.site,
    series: inputInfo.series,
    name,
    recordTimeMs: inputInfo.recordTimeMs,
    durationMs: audioMetadata.durationMs,
    sampleRateHz: audioMetadata.sampleRateHz,
    sizeBytes: audioMetadata.sizeBytes,
    coords: {
      lat: inputInfo.coords.lat,
      long: inputInfo.coords.long,
    },
    // TODO: Remove this attribute (from here and from Input model), but
    // keep it in each response. Instead, generate it each time, depending
    // on whether or not the client is local to the server.
    downloadUrl: `file:${filepath}`,
  });

  const createResult = await Input.create(input);

  const finalInput = {
    inputId: createResult._id,
    site: createResult.site,
    series: createResult.series,
    name: createResult.name,
    recordTimeMs: createResult.recordTimeMs,
    durationMs: createResult.durationMs,
    sampleRateHz: createResult.sampleRateHz,
    sizeBytes: createResult.sizeBytes,
    coords: {
      lat: createResult.coords.lat,
      long: createResult.coords.long,
    },
    downloadUrl: createResult.downloadUrl,
  };

  return finalInput;
};

const GetInputs = async () => {
  const results = await Input.find().exec();

  const inputs = {
    count: results.length,
    inputs: results.map(input => ({
      inputId: input._id,
      site: input.site,
      series: input.series,
      name: input.name,
      recordTimeMs: input.recordTimeMs,
      durationMs: input.durationMs,
      sampleRateHz: input.sampleRateHz,
      sizeBytes: input.sizeBytes,
      coords: {
        lat: input.coords.lat,
        long: input.coords.long,
      },
      downloadUrl: input.downloadUrl,
    })),
  };

  return inputs;
};

const GetInputById = async (id) => {
  const result = await Input.findById(id).exec();

  if (!result) {
    return null;
  }

  const input = {
    inputId: result._id,
    site: result.site,
    series: result.series,
    name: result.name,
    recordTimeMs: result.recordTimeMs,
    durationMs: result.durationMs,
    sampleRateHz: result.sampleRateHz,
    sizeBytes: result.sizeBytes,
    coords: {
      lat: result.coords.lat,
      long: result.coords.long,
    },
    downloadUrl: result.downloadUrl,
  };

  return input;
};

const DeleteInput = async (id) => {
  const deleteResult = await Input.findOneAndDelete({ _id: id }).exec();
  let jobsWithInput = [];

  // Delete the input file from the file system
  if (deleteResult) deleteInputFile(deleteResult.path);

  // Delete jobs with specified Input
  if (deleteResult) {
    jobsWithInput = await Job.find({ input: id });
    await Job.deleteMany({ input: id });
  }

  return { deleteResult, jobsWithInput };
};

module.exports = {
  CreateInput,
  GetInputs,
  GetInputById,
  DeleteInput,
};
