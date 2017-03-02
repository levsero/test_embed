describe('chat reducer agents', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-agents');
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
      it('is set to an empty object', () => {
        expect(initialState)
          .toEqual({});
      });
    });

    describe('when a SDK_AGENT_UPDATE action is dispatched', () => {
      let payload;

      beforeEach(() => {
        payload = {
          detail: {
            nick: 'agent:mcbob',
            display_name: 'McBob',
            avatar_path: 'http://www.example.com/avatar.png',
            title: 'Bobliest Bob'
          }
        };

        state = reducer(initialState, {
          type: actionTypes.SDK_AGENT_UPDATE,
          payload: payload
        });
      });

      it('updates the agent with properties from the payload', () => {
        expect(state['agent:mcbob'])
          .toEqual(jasmine.objectContaining(payload.detail));
      });
    });

    describe('when a SDK_CHAT_TYPING action is dispatched', () => {
      let payload;

      beforeEach(() => {
        payload = {
          detail: {
            type: 'typing',
            nick: 'agent:mcbob',
            typing: true
          }
        };

        state = reducer(initialState, {
          type: actionTypes.SDK_CHAT_TYPING,
          payload: payload
        });
      });

      it('updates the agents typing property', () => {
        expect(state['agent:mcbob'].typing)
          .toEqual(true);
      });
    });

    describe('when a SDK_CHAT_MEMBER_JOIN action is dispatched', () => {
      let payload;

      beforeAll(() => {
        payload = {
          detail: {
            type: 'chat.memberjoin',
            nick: '',
            display_name: '',
            timestamp: Date.now()
          }
        };
      });

      describe('when the member is an agent', () => {
        beforeAll(() => {
          payload.detail.nick = 'agent:mcbob';
        });

        describe('when the member does not exist in the state already', () => {
          beforeEach(() => {
            state = reducer(initialState, {
              type: actionTypes.SDK_CHAT_MEMBER_JOIN,
              payload: payload
            });
          });

          it('adds an entry for the member', () => {
            expect(state)
              .toEqual(jasmine.objectContaining({
                'agent:mcbob': { nick: payload.detail.nick }
              }));
          });
        });

        describe('when the member exists in the state already', () => {
          beforeEach(() => {
            const currentState = {
              'agent:mcbob': {}
            };

            state = reducer(currentState, {
              type: actionTypes.SDK_CHAT_MEMBER_JOIN,
              payload: payload
            });
          });

          it('updates the entry for the member', () => {
            expect(state['agent:mcbob'].nick)
              .toEqual(payload.detail.nick);
          });
        });
      });

      describe('when the member is a visitor', () => {
        beforeEach(() => {
          payload.detail.nick = 'someguy';

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
  });
});
