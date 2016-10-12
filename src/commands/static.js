module.exports = (o) => {
  const opts = Object.assign({}, o);
  return function* combo(next) {
    console.log(opts);
    yield next;
  };
};
