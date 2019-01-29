const { isPrimitive } = require('../primitive');

// The sanitize() function is necessary simply due to the `r-script` package's
// failure to translate certain primitive values, like NaN, which is returned as
// the string 'NaN'. A better solution would be to correct the problem upstream,
// i.e. fix the `r-script` package, but this doesn't seem like a realistic
// option due to slowness on the part of the package's owner/maintainer. If you
// find that there are other oddities coming from `r-script`'s output, please
// add them here.
function sanitizePrimitive(value) {
  if (value === 'NaN') {
    return NaN;
  }
  return value;
}

const sanitize = (item) => {
  if (isPrimitive(item)) {
    return sanitizePrimitive(item);
  }

  if (Array.isArray(item)) {
    return item.map(element => sanitize(element));
  }

  const sanitizedObj = {};
  Object.entries(item).forEach(([key, value]) => {
    sanitizedObj[key] = sanitize(value);
  });
  return sanitizedObj;
};

module.exports = {
  sanitize,
};
