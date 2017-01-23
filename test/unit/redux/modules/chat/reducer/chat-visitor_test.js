describe('chat reducer visitor', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-visitor');
    const actionTypesPath = buildSrcPath('redux/modules/chat/chat-action-types');

    reducer = requireUncached(reducerPath).default;
    actionTypes = requireUncached(actionTypesPath);

    initialState = reducer(undefined, { type: 'NOTHING' });
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('reducer', () => {
    let state;

    describe('initial state', () => {
      it('is set to an empty object', () => {
        expect(initialState)
          .toEqual({});
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

        it('updates state.nick', () => {
          expect(state.nick)
            .toEqual(payload.detail.nick);
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

    describe('when a SDK_VISITOR_UPDATE action is dispatchd', () => {
      let payload;

      beforeEach(() => {
        payload = {
          detail: {
            display_name: 'agent:xxx', // eslint-disable-line camelcase
            email: 'bob@example.com',
            phone: '0400123456'
          }
        };
        state = reducer(initialState, {
          type: actionTypes.SDK_VISITOR_UPDATE,
          payload: payload
        });
      });

      it('updates state with data from payload.detail', () => {
        expect(state)
          .toEqual(jasmine.objectContaining(payload.detail));
      });
    });
  });
});
