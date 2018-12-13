describe('settings reducer', () => {
  let reducer;

  beforeAll(() => {
    mockery.enable();

    initMockRegistry({
      'service/settings': {
        settings : {
          get: noop
        }
      },
      'src/redux/modules/settings/settings-action-types': {
        UPDATE_SETTINGS: 'UPDATE_SETTINGS'
      }
    });

    const reducerPath = buildSrcPath('redux/modules/settings/reducer/index');

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

    it('has the chat sub state', () => {
      expect(state.chat)
        .toBeDefined();
    });

    it('has the launcher sub state', () => {
      expect(state.launcher)
        .toBeDefined();
    });
  });
});
