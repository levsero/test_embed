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

    describe('when a SDK_CHAT_MEMBER_JOIN action is dispatchd', () => {
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

    describe('when a SDK_CHAT_MEMBER_LEAVE action is dispatchd', () => {
      let payload;

      beforeAll(() => {
        initialState = true;
      });

      describe('when the member is a visitor', () => {
        beforeEach(() => {
          payload = {
            detail: {
              nick: 'visitor:xxx'
            }
          };

          state = reducer(initialState, {
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

          state = reducer(initialState, {
            type: actionTypes.SDK_CHAT_MEMBER_LEAVE,
            payload: payload
          });
        });

        it('does not change the state', () => {
          expect(state)
            .toEqual(initialState);
        });
      });
    });
  });
});
