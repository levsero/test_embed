describe('chat reducer sessionTimestamp', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-session-timestamp');
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
    let state,
      currentState,
      actionObj;

    describe('initial state', () => {
      it('is set to null', () => {
        expect(initialState)
          .toEqual(null);
      });
    });

    describe('when an action is dispatched', () => {
      beforeEach(() => {
        state = reducer(currentState, actionObj);
      });

      describe('NEW_AGENT_MESSAGE_RECEIVED', () => {
        beforeAll(() => {
          currentState = initialState;
          actionObj = {
            type: actionTypes.NEW_AGENT_MESSAGE_RECEIVED,
            payload: { timestamp: 1524785984445 }
          };
        });

        it('sets the state to the value passed in the payload', () => {
          expect(state)
            .toEqual(1524785984445);
        });
      });

      describe('CHAT_MSG_REQUEST_SUCCESS', () => {
        beforeAll(() => {
          currentState = initialState;
          actionObj = {
            type: actionTypes.CHAT_MSG_REQUEST_SUCCESS,
            payload: { timestamp: 345345345435 }
          };
        });

        it('sets the state to the value passed in the payload', () => {
          expect(state)
            .toEqual(345345345435);
        });
      });

      describe('SDK_CHAT_MEMBER_LEAVE', () => {
        beforeAll(() => {
          currentState = initialState;
          actionObj = {
            type: actionTypes.SDK_CHAT_MEMBER_LEAVE,
            payload: { nick: 'visitor', timestamp: 345345345435 }
          };
        });

        it('resets the state to the initialState', () => {
          expect(state)
            .toEqual(null);
        });
      });

      describe('CHAT_RECONNECT', () => {
        beforeAll(() => {
          currentState = initialState;
          actionObj = {
            type: actionTypes.CHAT_RECONNECT,
            payload: { nick: 'visitor', timestamp: 2342342342343 }
          };
        });

        it('resets the state to the initialState', () => {
          expect(state)
            .toEqual(null);
        });
      });
    });
  });
});
