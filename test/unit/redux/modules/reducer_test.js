describe('root reducer', () => {
  let reducer;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/reducer');

    reducer = requireUncached(reducerPath).default;
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('nested reducers', () => {
    let newState;

    const nestedReducers = [
      'chat'
    ];

    beforeEach(() => {
      newState = reducer({}, {});
    });

    nestedReducers.forEach((key) => {
      it(`has a ${key} key`, () => {
        expect(newState[key])
          .toBeDefined();
      });
    });
  });
});
