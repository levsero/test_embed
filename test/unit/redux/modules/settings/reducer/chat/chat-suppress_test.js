describe('chat reducer suppress', () => {
  let reducer,
    actionTypes,
    zopimActionTypes,
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
    const zopimActionTypesPath = buildSrcPath('redux/modules/zopimChat/zopimChat-action-types');

    reducer = requireUncached(reducerPath).default;

    initialState = reducer(undefined, { type: '' });
    actionTypes = requireUncached(actionTypesPath);
    zopimActionTypes = requireUncached(zopimActionTypesPath);
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

  describe('when an UPDATE_SETTINGS action is dispatched', () => {
    let payload, state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.UPDATE_SETTINGS,
        payload: payload
      });
    });

    describe('when valid properties are set', () => {
      beforeAll(() => {
        payload = {
          webWidget: {
            chat: {
              suppress: true
            }
          }
        };
      });

      it('updates the value', () => {
        expect(state).toEqual(true);
      });
    });

    describe('when invalid properties are set', () => {
      beforeAll(() => {
        payload = {
          webWidget: {
            yeah: 'nah'
          }
        };
      });

      it('does nothing', () => {
        expect(state).toEqual(initialState);
      });
    });
  });

  describe('when an ZOPIM_IS_CHATTING action is dispatched', () => {
    let payload, state;

    beforeEach(() => {
      state = reducer(true, {
        type: zopimActionTypes.ZOPIM_IS_CHATTING,
        payload: payload
      });
    });

    it('sets the state to false', () => {
      expect(state).toEqual(false);
    });
  });

  describe('when an ZOPIM_END_CHAT action is dispatched', () => {
    let payload, state;

    beforeEach(() => {
      state = reducer(true, {
        type: zopimActionTypes.ZOPIM_END_CHAT,
        payload: payload
      });
    });

    it('sets the state to the initialState', () => {
      expect(state).toEqual(initialState);
    });
  });
});
