describe('chat reducer queue position', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-queue-position');
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
    const mockInitialState = 0;

    describe('initial state', () => {
      it('is set to an expected object', () => {
        expect(initialState)
          .toEqual(mockInitialState);
      });
    });

    describe('when a SDK_CHAT_QUEUE_POSITION action is dispatched', () => {
      let payload, queuePosition;

      beforeEach(() => {
        queuePosition = 7;
        payload = {
          detail: {
            queue_position: queuePosition
          }
        };

        const action = { type: actionTypes.SDK_CHAT_QUEUE_POSITION, payload };

        state = reducer(initialState, action);
      });

      it('updates the state with the payload', () => {
        const expected = queuePosition;

        expect(state)
          .toEqual(expected);
      });
    });
  });
});
