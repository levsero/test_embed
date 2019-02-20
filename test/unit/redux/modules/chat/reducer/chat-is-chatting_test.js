describe('chat reducer is_chatting', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-is-chatting');
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
      it('is set to false', () => {
        expect(initialState)
          .toEqual(false);
      });
    });

    describe('when a SDK_CHAT_MEMBER_JOIN action is dispatched', () => {
      let payload;

      describe('when the member is a visitor', () => {
        beforeEach(() => {
          payload = {
            detail: {
              nick: 'visitor:xxx'
            }
          };

          state = reducer(initialState, {
            type: actionTypes.SDK_CHAT_MEMBER_JOIN,
            payload: payload
          });
        });

        it('sets state to true', () => {
          expect(state)
            .toEqual(true);
        });
      });

      describe('when the member is an agent', () => {
        beforeEach(() => {
          payload = {
            detail: {
              nick: 'agent:xxx'
            }
          };

          state = reducer(initialState, {
            type: actionTypes.SDK_CHAT_MEMBER_JOIN,
            payload: payload
          });
        });

        it('does not change the state', () => {
          expect(state)
            .toEqual(initialState);
        });
      });
    });

    describe('when a SDK_CHAT_MEMBER_LEAVE action is dispatched', () => {
      let payload;

      describe('when the member is a visitor', () => {
        beforeEach(() => {
          payload = {
            detail: {
              nick: 'visitor:xxx'
            }
          };

          state = reducer(true, {
            type: actionTypes.SDK_CHAT_MEMBER_LEAVE,
            payload: payload
          });
        });

        it('sets state to false', () => {
          expect(state)
            .toEqual(false);
        });
      });

      describe('when the member is an agent', () => {
        beforeEach(() => {
          payload = {
            detail: {
              nick: 'agent:xxx'
            }
          };

          state = reducer(true, {
            type: actionTypes.SDK_CHAT_MEMBER_LEAVE,
            payload: payload
          });
        });

        it('does not change the state', () => {
          expect(state)
            .toEqual(true);
        });
      });
    });

    describe('when a END_CHAT_REQUEST_SUCCESS action is dispatched', () => {
      describe('when the member is an agent', () => {
        beforeEach(() => {
          state = reducer(initialState, {
            type: actionTypes.END_CHAT_REQUEST_SUCCESS
          });
        });

        it('should set the state to false', () => {
          expect(state)
            .toEqual(false);
        });
      });
    });

    describe('when a IS_CHATTING action is dispatched', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.IS_CHATTING,
          payload: true
        });
      });

      it('should set the state to the payload', () => {
        expect(state)
          .toEqual(true);
      });
    });

    describe('when a CHAT_BANNED action is dispatched', () => {
      beforeEach(() => {
        state = reducer('boop', {
          type: actionTypes.CHAT_BANNED
        });
      });

      it('returns the initialState', () => {
        expect(state).toEqual(initialState);
      });
    });
  });
});
