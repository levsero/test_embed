describe('chat ratings', () => {
  let reducer,
    actionTypes,
    initialState,
    mockIsAgent;

  beforeAll(() => {
    mockery.enable();

    initMockRegistry({
      'component/chat/ChatRatingGroup': {
        ChatRatings: {
          GOOD: 'good',
          BAD: 'bad',
          NOT_SET: null
        }
      },
      'src/util/chat': {
        isAgent: () => mockIsAgent
      }
    });

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-rating');
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
      it('is set to an object with the correct keys', () => {
        expect(initialState)
          .toEqual({
            value: null,
            disableEndScreen: false,
            comment: null
          });
      });
    });

    describe('when a CHAT_RATING_REQUEST_SUCCESS action is dispatched', () => {
      const payload = 'bad';
      const expectedState = {
        value: payload,
        comment: null,
        disableEndScreen: false
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
          comment: 'a previous ratings comment',
          disableEndScreen: false
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

    describe('when a SDK_CHAT_RATING action is dispatched', () => {
      const payload = {
        detail: {
          new_rating: 'bad'
        }
      };
      const expectedState = {
        value: 'bad',
        comment: null,
        disableEndScreen: false
      };

      describe('when the initial state is empty', () => {
        beforeEach(() => {
          state = reducer(initialState, {
            type: actionTypes.SDK_CHAT_RATING,
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
          comment: 'a previous ratings comment',
          disableEndScreen: false
        };

        beforeEach(() => {
          state = reducer(initialState, {
            type: actionTypes.SDK_CHAT_RATING,
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
        comment: payload,
        value: null,
        disableEndScreen: false
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

    describe('when a SDK_CHAT_COMMENT action is dispatched', () => {
      const payload = {
        detail: {
          new_comment: 'Great work!'
        }
      };

      const expectedState = {
        comment: 'Great work!',
        value: null,
        disableEndScreen: false
      };

      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.SDK_CHAT_COMMENT,
          payload: payload
        });
      });

      it('sets the comment in the state', () => {
        expect(state)
          .toEqual(expectedState);
      });
    });

    describe('when a END_CHAT_REQUEST_SUCCESS action is dispatched', () => {
      beforeEach(() => {
        state = reducer({}, {
          type: actionTypes.END_CHAT_REQUEST_SUCCESS
        });
      });

      it('clears the state', () => {
        expect(state)
          .toEqual(initialState);
      });
    });

    describe('when a SDK_CHAT_MEMBER_LEAVE action is dispatched', () => {
      let payload;
      const randomState = {
        'yolo': 'yolo'
      };

      beforeEach(() => {
        state = reducer(randomState, {
          type: actionTypes.SDK_CHAT_MEMBER_LEAVE,
          payload
        });
      });

      describe('when agent leaves', () => {
        beforeAll(() => {
          mockIsAgent = true;
          payload = {
            detail: {
              nick: 'agent:123'
            }
          };
        });

        it('does not change state', () => {
          expect(state)
            .toEqual(randomState);
        });
      });

      describe('when user leaves', () => {
        beforeAll(() => {
          mockIsAgent = false;
          payload = {
            detail: {
              nick: 'visitor'
            }
          };
        });

        it('clears the state', () => {
          expect(state)
            .toEqual(initialState);
        });
      });
    });

    describe('when a CHAT_RECONNECT action is dispatched', () => {
      beforeEach(() => {
        state = reducer({}, {
          type: actionTypes.CHAT_RECONNECT
        });
      });

      it('clears the state', () => {
        expect(state)
          .toEqual(initialState);
      });
    });

    describe('when a UPDATE_PREVIEWER_SCREEN action is dispatched', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.UPDATE_PREVIEWER_SCREEN
        });
      });

      it('sets disableEndScreen to true', () => {
        expect(state)
          .toEqual(jasmine.objectContaining({ disableEndScreen: true }));
      });
    });
  });
});
