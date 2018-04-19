describe('chat reducer inactiveAgents', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-inactive-agents');
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
    let actionType,
      payload,
      state;

    describe('initial state', () => {
      it('is set to an empty object', () => {
        expect(initialState)
          .toEqual({});
      });
    });

    describe('actions dispatch', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionType,
          payload: payload
        });
      });

      describe('when a CHAT_AGENT_INACTIVE action is dispatched', () => {
        beforeAll(() => {
          actionType = actionTypes.CHAT_AGENT_INACTIVE;
          payload = {
            nick: 'agent:mcbob',
            display_name: 'McBob',
            title: 'Bobliest Bob'
          };
        });

        it('updates the agent with properties from the payload', () => {
          const expected = {
            [payload.nick]: { ...payload }
          };

          expect(state)
            .toEqual(jasmine.objectContaining(expected));
        });
      });

      describe('when a SDK_CHAT_MEMBER_JOIN action is dispatched', () => {
        beforeAll(() => {
          actionType = actionTypes.SDK_CHAT_MEMBER_JOIN;
          payload = {
            detail: { nick: 'agent:terence' }
          };
          initialState = {
            'agent:terence': { display_name: 'terence' },
            'agent:bob': { display_name: 'bob' }
          };
        });

        it('updates the state by removing the agent specified in the payload', () => {
          const expected = {
            'agent:bob': { display_name: 'bob' }
          };

          expect(state)
            .toEqual(jasmine.objectContaining(expected));
        });
      });

      describe('when a CHAT_ALL_AGENTS_INACTIVE action is dispatched', () => {
        beforeAll(() => {
          payload = {
            'agent:foo': { display_name: 'Fooh bear' },
            'agent:bar': { display_name: 'bar bong' }
          };
          actionType = actionTypes.CHAT_ALL_AGENTS_INACTIVE;
          initialState = {};
        });

        it('clears the state', () => {
          expect(state)
            .toEqual(jasmine.objectContaining(payload));
        });
      });
    });
  });
});
