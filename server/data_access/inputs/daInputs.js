const mongoose = require('mongoose');
const config = require('config');

const Input = require('../../api/models/input');
const { Job } = require('../../api/models/job');
const { deleteInputFile } = require('../../util/storage');
const { getAudioMetadata } = require('../../util/audioMetadata');

const {
  parseInputJson,
  getExtensionlessFilename,
} = require('../../api/models/input/utils');

const logger = require('../../util/logger');

const error = config.get('error');

const CreateInput = async (inputInfo, file) => {
  try {
    const parsedJson = parseInputJson(inputInfo);
    const audioMetadata = await getAudioMetadata(file.path);
    const name = 'name' in parsedJson
      ? parsedJson.name
      : getExtensionlessFilename(file.originalname);

    const input = new Input({
      _id: new mongoose.Types.ObjectId(),
      path: file.path,
      site: parsedJson.site,
      series: parsedJson.series,
      name,
      recordTimeMs: parsedJson.recordTimeMs,
      durationMs: audioMetadata.durationMs,
      sampleRateHz: audioMetadata.sampleRateHz,
      sizeBytes: audioMetadata.sizeBytes,
      coords: {
        lat: parsedJson.coords.lat,
        long: parsedJson.coords.long,
      },
      // TODO: Remove this attribute (from here and from Input model), but
      // keep it in each response. Instead, generate it each time, depending
      // on whether or not the client is local to the server.
      downloadUrl: `file:${file.path}`,
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
  } catch (err) {
    logger.error(err);
    return { errorType: 'Other', error: error.internal };
  }
};

const GetInputs = async () => {
  try {
    const results = await Input.find().exec();

    return {
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
  } catch (err) {
    return { errorType: 'Other', error: error.internal };
  }
};

const GetInputById = async (inputId) => {
  try {
    const result = await Input.findById(inputId).exec();

    if (!result) {
      return { errorType: 'EmptySearchResult', message: `No valid entry found for inputId: ${inputId}.` };
    }

    return {
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
  } catch (err) {
    logger.error(err);
    return { errorType: 'Other', error: error.internal };
  }
};

const DeleteInput = async (inputId) => {
  try {
    const deleteResult = await Input.findOneAndDelete({ _id: inputId }).exec();
    let jobsWithInput = [];

    // Delete the input file from the file system
    if (deleteResult) deleteInputFile(deleteResult.path);

    // Delete jobs with specified Input
    if (deleteResult) {
      jobsWithInput = await Job.find({ input: inputId });
      await Job.deleteMany({ input: inputId });
    }

    return {
      success: true,
      message: deleteResult
        ? `Successfully deleted Input with inputId: ${inputId}.`
        : `No valid entry found for inputId: ${inputId}.`,
      jobs: jobsWithInput.map(job => job.id),
    };
  } catch (err) {
    logger.error(err);
    return { errorType: 'Other', error: error.internal };
  }
};

module.exports = {
  CreateInput,
  GetInputs,
  GetInputById,
  DeleteInput,
};
