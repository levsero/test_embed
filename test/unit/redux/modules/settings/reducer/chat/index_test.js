describe('settings chat reducer', () => {
  let reducer;

  beforeAll(() => {
    mockery.enable();

    initMockRegistry({
      'service/settings': {
        settings : {
          get: noop
        }
      }
    });

    const reducerPath = buildSrcPath('redux/modules/settings/reducer/chat/index');

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

    it('has the suppress sub state', () => {
      expect(state.suppress)
        .toBeDefined();
    });

    it('has the department sub state', () => {
      expect(state.department)
        .toBeDefined();
    });

    it('has the departments enabled sub state', () => {
      expect(state.departments.enabled)
        .toBeDefined();
    });

    it('has the concierge sub state', () => {
      expect(state.concierge).toBeDefined();
    });

    it('has the mobile notifications disabled state', () => {
      expect(state.mobileNotificationsDisabled)
        .toBeDefined();
    });

    it('has the tags state', () => {
      expect(state.tags)
        .toBeDefined();
    });

    it('has the title state', () => {
      expect(state.title).toBeDefined();
    });

    it('has the prechat form sub state', () => {
      expect(state.prechatForm).toBeDefined();
    });

    it('has the offline form sub state', () => {
      expect(state.offlineForm).toBeDefined();
    });
  });
});
