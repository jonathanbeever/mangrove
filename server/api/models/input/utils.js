const Input = require('./index');

const getInputKeys = () => {
  const keys = Object.keys(Input.schema.paths);
  keys[keys.indexOf('_id')] = 'inputId';
  keys.splice(keys.indexOf('__v'), 1);

  return keys;
};

const newInputKeys = () => {
  const keys = getInputKeys();
  keys.splice(keys.indexOf('inputId'), 1);
  keys.splice(keys.indexOf('path'), 1);

  return keys;
};

const coordsKeys = () => ['lat', 'long'];

module.exports = {
  getInputKeys,
  newInputKeys,
  coordsKeys,
};
