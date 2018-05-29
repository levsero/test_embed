describe('chat chat-history reducer', () => {
  let reducer;

  beforeAll(() => {
    mockery.enable();

    const chatConstantsPath = buildSrcPath('constants/chat');
    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-history/index');

    initMockRegistry({
      'constants/chat': {
        HISTORY_REQUEST_STATUS: requireUncached(chatConstantsPath).HISTORY_REQUEST_STATUS
      }
    });

    reducer = requireUncached(reducerPath).default;
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('initial state', () => {
    let state;

    beforeEach(() => {
      state = reducer({}, { type: '' });
    });

    it('has the hasMore sub state', () => {
      expect(state.hasMore)
        .toBeDefined();
    });

    it('has the chats sub state', () => {
      expect(state.chats)
        .toBeDefined();
    });

    it('has the requestStatus sub state', () => {
      expect(state.requestStatus)
        .toBeDefined();
    });
  });
});
