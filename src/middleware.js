module.exports = () => {
  return function* (next) {
    yield next;
  };
};
