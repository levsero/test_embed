describe('chat reducer connections', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-connection');
    const actionTypesPath = buildSrcPath('redux/modules/chat/chat-action-types');

    reducer = requireUncached(reducerPath).default;
    actionTypes = requireUncached(actionTypesPath);

    initialState = reducer(undefined, { type: '' });
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('reducer', () => {
    let state;

    describe('initial state', () => {
      it('is set to an empty string', () => {
        expect(initialState)
          .toEqual('');
      });
    });

    describe('when a SDK_CONNECTION_UPDATE action is dispatched', () => {
      let payload;

      beforeEach(() => {
        payload = {
          detail: 'connected'
        };

        state = reducer(initialState, {
          type: actionTypes.SDK_CONNECTION_UPDATE,
          payload: payload
        });
      });

      it('updates the state with payload.detail', () => {
        expect(state)
          .toEqual(payload.detail);
      });
    });
  });
});
