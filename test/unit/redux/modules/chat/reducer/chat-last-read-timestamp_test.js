describe('chat reducer lastReadTimestamp', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    // Fake initial last read timestamp
    spyOn(Date, 'now').and.returnValue(100);

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-last-read-timestamp');
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
    const mockInitialState = 100;

    describe('initial state', () => {
      it('is set to an expected object', () => {
        expect(initialState)
          .toEqual(mockInitialState);
      });
    });

    describe('when a SDK_CHAT_LAST_READ action is dispatched', () => {
      let payload, lastReadTimestamp;

      beforeEach(() => {
        lastReadTimestamp = Date.now() + 100;
        payload = {
          detail: {
            timestamp: lastReadTimestamp
          }
        };

        const action = { type: actionTypes.SDK_CHAT_LAST_READ, payload };

        state = reducer(initialState, action);
      });

      it('updates the state with the payload', () => {
        const expected = lastReadTimestamp;

        expect(state)
          .toEqual(expected);
      });
    });
  });
});
