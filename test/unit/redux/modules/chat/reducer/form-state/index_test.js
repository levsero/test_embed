describe('chat form-state reducer', () => {
  let reducer;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/form-state/index');

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

    it('has the offlineForm sub state', () => {
      expect(state.offlineForm)
        .toBeDefined();
    });

    it('has the preChatForm sub state', () => {
      expect(state.preChatForm)
        .toBeDefined();
    });
  });
});
