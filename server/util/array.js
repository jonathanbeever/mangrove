const arrayDiff = (arr1, arr2) => arr1.filter(key => !arr2.includes(key));

module.exports = {
  arrayDiff,
};
