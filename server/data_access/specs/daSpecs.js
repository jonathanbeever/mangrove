const mongoose = require('mongoose');
const config = require('config');

const { Spec } = require('../../api/models/spec');
const { getJobModel } = require('../../api/models/job/utils');

const Type = require('../../api/models/type');
const Nyquist = require('../../api/models/spec/nyquist');

const {
  getSpecModel,
  newSpecKeys,
  getParamsFromSpec,
  fillDefaultParams,
} = require('../../api/models/spec/utils');

const { arrayDiff } = require('../../util/array');
const logger = require('../../util/logger');

const error = config.get('error');

const CreateSpec = async (specInfo) => {
  const missingKeys = arrayDiff(newSpecKeys(), Object.keys(specInfo));
  if (missingKeys.length > 0) {
    return { errorType: 'MissingKeys', message: `Missing required keys: ${missingKeys.join(', ')}.` };
  }

  let SpecModel;
  try {
    SpecModel = getSpecModel(specInfo.type);
  } catch (err) {
    const types = Object.values(Type).join(', ');
    return { errorType: 'InvalidType', message: `Invalid type: ${specInfo.type}. Must be one of: ${types}.` };
  }

  const extraKeys = arrayDiff(Object.keys(specInfo), newSpecKeys(specInfo.type, true));
  if (extraKeys.length > 0) {
    return { errorType: 'InvalidKeys', message: `Invalid keys for type (${specInfo.type}): ${extraKeys.join(', ')}.` };
  }

  try {
    const params = getParamsFromSpec(specInfo, Nyquist.db.type);
    const spec = new SpecModel({
      _id: new mongoose.Types.ObjectId(),
      ...params,
    });

    const validationErr = spec.validateSync();
    if (validationErr) {
      return { errorType: 'Validation', message: Object.values(validationErr.errors).map(e => e.message).join(' ') };
    }

    const paramsFilled = fillDefaultParams(specInfo.type, params);
    const searchResult = await SpecModel.find(paramsFilled).exec();

    if (searchResult.length /* === 1 */) {
      return {
        specId: searchResult[0]._id,
        type: searchResult[0].type,
        ...getParamsFromSpec(searchResult[0], Nyquist.user.type),
      };
    }

    const newSpec = await Spec.create(spec);

    return {
      specId: newSpec._id,
      type: newSpecKeys.type,
      ...getParamsFromSpec(newSpec, Nyquist.user.type),
    };
  } catch (err) {
    logger.error(err);
    return { errorType: 'Other', error: error.internal };
  }
};

const GetSpecs = async () => {
  try {
    const searchResults = await Spec.find().exec();

    const results = {
      count: searchResults.length,
      specs: searchResults.map(spec => ({
        specId: spec._id,
        type: spec.type,
        ...getParamsFromSpec(spec, Nyquist.user.type),
      })),
    };

    return results;
  } catch (err) {
    logger.error(err);
    return { errorType: 'Other', error: error.internal };
  }
};

const GetSpecById = async (specId) => {
  try {
    const searchResult = await Spec.findById(specId).exec();

    if (!searchResult) {
      return { errorType: 'EmptySearchResult', message: `No valid entry found for ${specId}` };
    }

    return {
      specId: searchResult._id,
      type: searchResult.type,
      ...getParamsFromSpec(searchResult, Nyquist.user.type),
    };
  } catch (err) {
    logger.error(err);
    return { errorType: 'Other', error: error.internal };
  }
};

const DeleteSpec = async (specId) => {
  try {
    const deleteResult = await Spec.findOneAndDelete({ _id: specId }).exec();

    let jobsWithSpec = [];
    if (deleteResult) {
      const JobModel = getJobModel(deleteResult.type);
      jobsWithSpec = await JobModel.find({ spec: specId });
      await JobModel.deleteMany({ spec: specId });
    }

    return {
      success: true,
      message: deleteResult
        ? `Successfully deleted Spec with specId: ${specId}`
        : `No valid entry found for specId: ${specId}.`,
      jobs: jobsWithSpec.map(job => job.id),
    };
  } catch (err) {
    logger.error(err);
    return { errorType: 'Other', error: error.internal };
  }
};

module.exports = {
  CreateSpec,
  GetSpecs,
  GetSpecById,
  DeleteSpec,
};
