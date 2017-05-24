describe('base root reducer', () => {
  let reducer;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/base/reducer/index');

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

    it('has the activeEmbed sub state', () => {
      expect(state.activeEmbed)
        .toBeDefined();
    });

    it('has the embeds sub state', () => {
      expect(state.embeds)
        .toBeDefined();
    });
  });
});
