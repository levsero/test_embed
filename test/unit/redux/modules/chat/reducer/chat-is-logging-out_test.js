describe('chat reducer isLoggingOut', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-is-logging-out');
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

    describe('when a USER_LOGGING_OUT action is dispatched', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.USER_LOGGING_OUT
        });
      });

      it('sets the state to true', () => {
        expect(state)
          .toEqual(true);
      });
    });

    describe('when a USER_LOGGED_OUT action is dispatched', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.USER_LOGGED_OUT
        });
      });

      it('sets the state to false', () => {
        expect(state)
          .toEqual(false);
      });
    });
  });
});
