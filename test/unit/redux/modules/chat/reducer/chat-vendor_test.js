describe('chat vendor reducer', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-vendor');
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
    const mockInitialState = {
      zChat: null
    };

    describe('initial state', () => {
      it('is set to an expected object', () => {
        expect(initialState)
          .toEqual(mockInitialState);
      });
    });

    describe('when a CHAT_VENDOR_LOADED action is dispatched', () => {
      let payload;

      beforeEach(() => {
        payload = {
          zChat: 'zChatLibrary'
        };

        const action = { type: actionTypes.CHAT_VENDOR_LOADED, payload };

        state = reducer(initialState, action);
      });

      it('updates the state with payload', () => {
        expect(state)
          .toEqual(payload);
      });
    });

    describe('when a PREVIEWER_LOADED action is dispatched', () => {
      beforeEach(() => {
        const action = { type: actionTypes.PREVIEWER_LOADED };

        state = reducer(initialState, action);
      });

      it('updates the state with a mock zChat with a getAuthLoginUrl function', () => {
        expect(typeof state.zChat.getAuthLoginUrl)
          .toBe('function');
      });
    });
  });
});
