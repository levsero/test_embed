describe('talk root reducer', () => {
  let reducer;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/talk/reducer/index');

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

    it('has the embeddableConfig sub state', () => {
      expect(state.embeddableConfig)
        .toBeDefined();
    });

    it('has the agentAvailbility sub state', () => {
      expect(state.agentAvailbility)
        .toBeDefined();
    });
  });
});
