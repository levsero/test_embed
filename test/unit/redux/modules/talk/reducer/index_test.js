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

    it('has the agentAvailability sub state', () => {
      expect(state.agentAvailability)
        .toBeDefined();
    });

    it('has the screen sub state', () => {
      expect(state.screen)
        .toBeDefined();
    });

    it('has the formState sub state', () => {
      expect(state.formState)
        .toBeDefined();
    });

    it('has the callback sub state', () => {
      expect(state.callback)
        .toBeDefined();
    });

    it('has the vendor sub state', () => {
      expect(state.vendor)
        .toBeDefined();
    });
  });
});
