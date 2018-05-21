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

    describe('when a IS_AUTHENTICATED action is dispatched', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.IS_AUTHENTICATED
        });
      });

      it('sets state to true', () => {
        expect(state)
          .toEqual(true);
      });
    });

    describe('when a IS_NOT_AUTHENTICATED action is dispatched', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.IS_NOT_AUTHENTICATED
        });
      });

      it('sets state to true', () => {
        expect(state)
          .toEqual(false);
      });
    });
  });
});
