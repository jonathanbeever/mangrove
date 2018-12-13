const mockType = (type) => {
  if (
    type === 'aci'
    || type === 'aei'
    || type === 'bi'
    || type === 'ndsi'
    || type === 'rms'
  ) {
    return type;
  }
  return null;
};

module.exports = mockType;
