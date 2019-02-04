describe('chat vendor reducer', () => {
  let reducer,
    actionTypes,
    initialState,
    nullZChatSDK;

  beforeAll(() => {
    mockery.enable();

    const nullZChatSDKPath = buildSrcPath('util/nullZChat');
    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-vendor');
    const actionTypesPath = buildSrcPath('redux/modules/chat/chat-action-types');

    nullZChatSDK = requireUncached(nullZChatSDKPath).nullZChatSDK;
    actionTypes = requireUncached(actionTypesPath);

    initMockRegistry({
      'src/util/nullZChat': {
        nullZChat: nullZChatSDK
      }
    });

    reducer = requireUncached(reducerPath).default;
    initialState = reducer(undefined, { type: '' });
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('reducer', () => {
    let state;
    const mockInitialState = {
      zChat: nullZChatSDK,
      slider: null,
      luxon: {}
    };

    describe('initial state', () => {
      it('is set to a null object', () => {
        expect(initialState)
          .toEqual(mockInitialState);
      });
    });

    describe('when a CHAT_VENDOR_LOADED action is dispatched', () => {
      let payload;

      beforeEach(() => {
        payload = {
          zChat: 'zChatLibrary',
          slider: 'react-slick',
          luxon: 'luxon'
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
