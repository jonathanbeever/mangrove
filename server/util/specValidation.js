const { specDefaults } = require('../api/models/specDefaults');

const validateParam = function validateParam(body) {
  const type = body.specType.substring(0, body.specType.length - 4);
  const newBody = body;
  Object.keys(body).forEach((key) => {
    if (
      key !== 'specType'
      && key !== 'shannon'
      && (typeof body[key] !== 'number'
        || specDefaults[type][key].min > body[key]
        || specDefaults[type][key].max < body[key])
    ) {
      newBody[key] = specDefaults[type][key].default;
    }
    if (key === 'shannon' && typeof body[key] !== 'boolean') {
      newBody[key] = specDefaults[type][key].default;
    }
  });
  return newBody;
};

const fillDefaults = function fillDefaults(body) {
  const type = body.specType.substring(0, body.specType.length - 4);
  const newBody = body;
  Object.keys(specDefaults[type]).forEach((key) => {
    if (!(key in newBody)) {
      newBody[key] = specDefaults[type][key].default;
    }
  });

  return newBody;
};

module.exports = { validateParam, fillDefaults };
