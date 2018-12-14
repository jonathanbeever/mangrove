const mockType = (type) => {
  if (
    type === 'aciSpec'
    || type === 'adiSpec'
    || type === 'aeiSpec'
    || type === 'biSpec'
    || type === 'ndsiSpec'
    || type === 'rmsSpec'
  ) {
    return type;
  }
  return null;
};

module.exports = mockType;
