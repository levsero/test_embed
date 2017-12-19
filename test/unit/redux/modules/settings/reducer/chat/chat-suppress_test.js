describe('chat reducer suppress', () => {
  let reducer,
    actionTypes,
    initialState,
    settingsGetSpy;

  beforeAll(() => {
    mockery.enable();

    settingsGetSpy = jasmine.createSpy('settings.get');

    initMockRegistry({
      'service/settings': {
        settings: {
          get: settingsGetSpy
        }
      }
    });

    const reducerPath = buildSrcPath('redux/modules/settings/reducer/chat/chat-suppress');
    const actionTypesPath = buildSrcPath('redux/modules/settings/settings-action-types');

    reducer = requireUncached(reducerPath).default;
    actionTypes = requireUncached(actionTypesPath);

    initialState = reducer(undefined, { type: '' });
    actionTypes = requireUncached(actionTypesPath);
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('initial state', () => {
    it('calls get on settings with "chat.suppress"', () => {
      expect(settingsGetSpy)
        .toHaveBeenCalledWith('chat.suppress');
    });

    it('is set to false', () => {
      expect(initialState)
        .toEqual(false);
    });
  });

  describe('when an UPDATE_SETTINGS_CHAT_SUPPRESS action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.UPDATE_SETTINGS_CHAT_SUPPRESS,
        payload: true
      });
    });

    it('sets the action payload as the state', () => {
      expect(state)
        .toEqual(true);
    });
  });

  describe('when an RESET_SETTINGS_CHAT_SUPPRESS action is dispatched', () => {
    let state;

    beforeEach(() => {
      const mockCurrentState = true;

      state = reducer(mockCurrentState, { type: actionTypes.RESET_SETTINGS_CHAT_SUPPRESS });
    });

    it('resets the state to its initial value', () => {
      expect(state)
        .toEqual(false);
    });
  });
});
