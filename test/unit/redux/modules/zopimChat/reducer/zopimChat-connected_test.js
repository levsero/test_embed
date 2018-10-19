describe('zopimChat reducer connected', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/zopimChat/reducer/zopimChat-connected');
    const actionTypesPath = buildSrcPath('redux/modules/zopimChat/zopimChat-action-types');

    reducer = requireUncached(reducerPath).default;
    actionTypes = requireUncached(actionTypesPath);

    initialState = reducer(undefined, { type: '' });
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('initial state', () => {
    it('is set to false', () => {
      expect(initialState)
        .toEqual(false);
    });
  });

  describe('when an ZOPIM_CONNECTED action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(false, {
        type: actionTypes.ZOPIM_CONNECTED
      });
    });

    it('sets the state to true', () => {
      expect(state)
        .toEqual(true);
    });
  });
});
