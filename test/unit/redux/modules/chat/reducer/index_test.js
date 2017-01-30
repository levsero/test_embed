describe('chat root reducer', () => {
  let reducer;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/index');

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

    it('has the account_status sub state', () => {
      expect(state.account_status)
        .toBeDefined();
    });

    it('has the agents sub state', () => {
      expect(state.agents)
        .toBeDefined();
    });

    it('has the chats sub state', () => {
      expect(state.chats)
        .toBeDefined();
    });

    it('has the visitor sub state', () => {
      expect(state.connection)
        .toBeDefined();
    });

    it('has the currentMessage sub state', () => {
      expect(state.currentMessage)
        .toBeDefined();
    });

    it('has the departments sub state', () => {
      expect(state.departments)
        .toBeDefined();
    });

    it('has the is_chatting sub state', () => {
      expect(state.is_chatting)
        .toBeDefined();
    });

    it('has the visitor sub state', () => {
      expect(state.visitor)
        .toBeDefined();
    });
  });
});
