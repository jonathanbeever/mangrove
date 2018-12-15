let currId = 0;

const mockObjectId = (n) => {
  if (!Number.isInteger(n)) {
    return `Error: Cannot create ObjectId from non-integer (${n}).`;
  } if (n < 0) {
    return `Error: Cannot create ObjectId from negative number (${n}).`;
  } if (n > 2 ** 96) {
    return `Error: Number too large to create ObjectId (${n}).`;
  }

  return (`000000000000000000000000${n.toString(16)}`).substr(-24);
};

const nextMockObjectId = () => {
  currId += 1;
  return mockObjectId(currId);
};

module.exports = {
  mockObjectId,
  nextMockObjectId,
};
