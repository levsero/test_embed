describe('zopimChat reducer status', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/zopimChat/reducer/zopimChat-status');
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
    it('is set to a empty string', () => {
      expect(initialState)
        .toEqual('');
    });
  });

  describe('when an ZOPIM_CHAT_ON_STATUS_UPDATE action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.ZOPIM_CHAT_ON_STATUS_UPDATE,
        payload: 'online'
      });
    });

    it('sets the action payload as the state', () => {
      expect(state)
        .toEqual('online');
    });

    describe('when the payload is undefined', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.ZOPIM_CHAT_ON_STATUS_UPDATE,
          payload: undefined
        });
      });

      it('does not update state', () => {
        expect(state)
          .toEqual(initialState);
      });
    });
  });
});
