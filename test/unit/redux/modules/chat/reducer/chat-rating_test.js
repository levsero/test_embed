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

    describe('when a CHAT_RATING_REQUEST_SUCCESS action is dispatched', () => {
      const payload = 'bad';
      const expectedState = {
        value: payload,
        comment: null
      };

      describe('when the initial state is empty', () => {
        beforeEach(() => {
          state = reducer(initialState, {
            type: actionTypes.CHAT_RATING_REQUEST_SUCCESS,
            payload: payload
          });
        });

        it('updates the state with the rating from the payload', () => {
          expect(state)
            .toEqual(expectedState);
        });
      });

      describe('when the initial state contains a previous rating and comment', () => {
        const initialState = {
          value: 'good',
          comment: 'a previous ratings comment'
        };

        beforeEach(() => {
          state = reducer(initialState, {
            type: actionTypes.CHAT_RATING_REQUEST_SUCCESS,
            payload: payload
          });
        });

        it('clears any previous comment stored in the state', () => {
          expect(state)
            .toEqual(expectedState);
        });
      });
    });

    describe('when a CHAT_RATING_COMMENT_REQUEST_SUCCESS action is dispatched', () => {
      const payload = 'Great work!';

      const expectedState = {
        comment: payload
      };

      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.CHAT_RATING_COMMENT_REQUEST_SUCCESS,
          payload: payload
        });
      });

      it('sets the comment in the state', () => {
        expect(state)
          .toEqual(expectedState);
      });
    });

    describe('when a END_CHAT_REQUEST_SUCESS action is dispatched', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.END_CHAT_REQUEST_SUCCESS
        });
      });

      it('clears the state', () => {
        expect(state)
          .toEqual({ value: null });
      });
    });
  });
});
