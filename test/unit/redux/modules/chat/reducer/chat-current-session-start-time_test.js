describe('chat reducer currentSessionStartTime', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-current-session-start-time');
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

      describe('SDK_CHAT_MSG', () => {
        beforeAll(() => {
          actionObj = {
            type: actionTypes.SDK_CHAT_MSG,
            payload: {
              detail: {
                timestamp: 345345345435
              }
            }
          };
        });

        describe('when timestamp exists already', () => {
          beforeAll(() => {
            currentState = 123;
          });

          it('does not change state', () => {
            expect(state)
              .toEqual(123);
          });
        });

        describe('when timestamp does not exist already', () => {
          beforeAll(() => {
            currentState = null;
          });

          it('sets the state to the value passed in the payload', () => {
            expect(state)
              .toEqual(345345345435);
          });
        });
      });

      describe('END_CHAT_REQUEST_SUCCESS', () => {
        beforeAll(() => {
          currentState = initialState;
          actionObj = {
            type: actionTypes.END_CHAT_REQUEST_SUCCESS,
            payload: { nick: 'visitor', timestamp: 345345345435 }
          };
        });

        it('resets the state to the initialState', () => {
          expect(state)
            .toEqual(initialState);
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
            .toEqual(initialState);
        });
      });
    });
  });
});
