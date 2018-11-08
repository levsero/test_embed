describe('chat reducer standalone mobile notification visible', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-standalone-mobile-notification-visible');
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
    const mockInitialState = false;

    describe('initial state', () => {
      it('is set to an expected object', () => {
        expect(initialState)
          .toEqual(mockInitialState);
      });
    });

    describe('when a SHOW_STANDALONE_MOBILE_NOTIFICATION action is dispatched', () => {
      beforeEach(() => {
        const action = { type: actionTypes.SHOW_STANDALONE_MOBILE_NOTIFICATION };

        state = reducer(initialState, action);
      });

      it('sets the state to true', () => {
        expect(state)
          .toBe(true);
      });
    });

    describe('when a CHAT_NOTIFICATION_DISMISSED action is dispatched', () => {
      beforeEach(() => {
        const action = { type: actionTypes.CHAT_NOTIFICATION_DISMISSED };

        state = reducer(initialState, action);
      });

      it('sets the state to false', () => {
        expect(state)
          .toBe(false);
      });
    });

    describe('when a PROACTIVE_CHAT_NOTIFICATION_DISMISSED action is dispatched', () => {
      beforeEach(() => {
        const action = { type: actionTypes.PROACTIVE_CHAT_NOTIFICATION_DISMISSED };

        state = reducer(initialState, action);
      });

      it('sets the state to false', () => {
        expect(state)
          .toBe(false);
      });
    });

    describe('when a CHAT_NOTIFICATION_RESPONDED action is dispatched', () => {
      beforeEach(() => {
        const action = { type: actionTypes.CHAT_NOTIFICATION_RESPONDED };

        state = reducer(initialState, action);
      });

      it('sets the state to false', () => {
        expect(state)
          .toBe(false);
      });
    });
  });
});
