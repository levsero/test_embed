describe('zopimChat reducer isChatting', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/zopimChat/reducer/zopimChat-isChatting');
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

  describe('when an ZOPIM_IS_CHATTING action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(false, {
        type: actionTypes.ZOPIM_IS_CHATTING
      });
    });

    it('sets the state to true', () => {
      expect(state)
        .toEqual(true);
    });
  });

  describe('when an ZOPIM_END_CHAT action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(true, {
        type: actionTypes.ZOPIM_END_CHAT
      });
    });

    it('sets the state to false', () => {
      expect(state)
        .toEqual(false);
    });
  });
});
