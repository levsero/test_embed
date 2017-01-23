describe('chat reducer currentMessage', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-current-message');
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

    describe('when a UPDATE_CURRENT_MSG action is dispatched', () => {
      let payload;

      beforeEach(() => {
        payload = 'im typing here';

        state = reducer(initialState, {
          type: actionTypes.UPDATE_CURRENT_MSG,
          payload: payload
        })
      });

      it('updates the state with payload', () => {
        expect(state)
          .toEqual(payload);
      });
    });
  });
});
