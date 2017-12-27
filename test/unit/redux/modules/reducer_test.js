describe('root reducer', () => {
  let reducer;

  const combinedReducers = [
    'chat',
    'base',
    'helpCenter',
    'talk',
    'zopimChat',
    'settings'
  ];

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/reducer');

    const mockReducer = (state) => { return {...state}; };

    initMockRegistry({
      './base/reducer': mockReducer,
      './settings/reducer': mockReducer,
      './chat/reducer': mockReducer,
      './helpCenter/reducer': mockReducer,
      './talk/reducer': mockReducer,
      './zopimChat/reducer': mockReducer,
      './root/reducer/root': (state) => { return {...state, root: true}; }
    });

    reducer = requireUncached(reducerPath).default;
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('combined reducers', () => {
    let newState;

    beforeEach(() => {
      newState = reducer({}, {});
    });

    combinedReducers.forEach((key) => {
      it(`has a ${key} key`, () => {
        expect(newState[key])
          .toBeDefined();
      });
    });
  });

  describe('root reducer', () => {
    let newState;

    beforeEach(() => {
      newState = reducer({}, {});
    });

    it('runs through the root reducer and applies its state changes', () => {
      expect(newState.root)
        .toBe(true);
    });

    it('still contains the combinedReducers state', () => {
      combinedReducers.forEach((key) => {
        expect(newState[key])
          .toBeDefined();
      });
    });
  });
});
