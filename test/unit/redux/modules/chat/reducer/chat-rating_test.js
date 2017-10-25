describe('chat reducer agents', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    initMockRegistry({
      'component/chat/ChatRatingGroup': {
        ChatRatings: {
          GOOD: 'good',
          BAD: 'bad',
          NOT_SET: null
        }
      }
    });

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-rating');
    const actionTypesPath = buildSrcPath('redux/modules/chat/chat-action-types');

    reducer = requireUncached(reducerPath).default;
    actionTypes = requireUncached(actionTypesPath);

    initialState = reducer(null, { type: '' });
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('reducer', () => {
    let state;

    describe('initial state', () => {
      it('is set to a null value', () => {
        expect(initialState)
          .toEqual(null);
      });
    });

    describe('when a SEND_CHAT_RATING_SUCCESS action is dispatched', () => {
      let payload;

      beforeEach(() => {
        payload = 'bad';

        state = reducer(initialState, {
          type: actionTypes.SEND_CHAT_RATING_SUCCESS,
          payload: payload
        });
      });

      it('updates the agent with properties from the payload', () => {
        expect(state)
          .toEqual(payload);
      });
    });
  });
});
