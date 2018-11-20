const locals = new Proxy(
  {},
  {
    get: function getter(target, key) {
      return key;
    },
  },
);

export { locals };
