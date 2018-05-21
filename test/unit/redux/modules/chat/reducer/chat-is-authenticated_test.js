describe('chat reducer isAuthenticated', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-is-authenticated');
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

    describe('when a AUTHENTICATION_STARTED action is dispatched', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.AUTHENTICATION_STARTED
        });
      });

      it('sets state to true', () => {
        expect(state)
          .toEqual(true);
      });
    });

    describe('when a AUTHENTICATION_FAILED action is dispatched', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.AUTHENTICATION_FAILED
        });
      });

      it('sets state to true', () => {
        expect(state)
          .toEqual(false);
      });
    });
  });
});
