module.exports = function jsonEquals(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
};
