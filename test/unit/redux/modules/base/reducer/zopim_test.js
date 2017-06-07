describe('base reducer zopim', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/base/reducer/zopim');
    const actionTypesPath = buildSrcPath('redux/modules/base/base-action-types');

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

  describe(`when an UPDATE_ZOPIM_ONLINE action is dispatched`, () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.UPDATE_ZOPIM_ONLINE,
        payload: true
      });
    });

    it('sets the action payload as the state', () => {
      expect(state)
        .toEqual(true);
    });
  });
});
