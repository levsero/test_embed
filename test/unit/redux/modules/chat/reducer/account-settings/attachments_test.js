describe('chat reducer accountSettings attachment', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/account-settings/attachments');
    const actionTypesPath = buildSrcPath('redux/modules/chat/chat-action-types');

    reducer = requireUncached(reducerPath).default;
    actionTypes = requireUncached(actionTypesPath);

    initialState = reducer(undefined, { type: '' });
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('reducer', () => {
    let state;

    describe('initial state', () => {
      it('enabled is true', () => {
        expect(initialState.enabled)
          .toEqual(true);
      });

      it('allowed_extensions is an array containing some extensions', () => {
        expect(initialState.allowed_extensions)
          .toEqual('png,jpg,jpeg,gif,txt,pdf');
      });
    });

    describe('when a GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS action is dispatched', () => {
      let settings;

      beforeEach(() => {
        settings = {
          file_sending: {
            allowed_extensions: 'exe',
            enabled: false
          }
        };

        state = reducer(initialState, {
          type: actionTypes.GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS,
          payload: settings
        });
      });

      it('sets the action payload as the state', () => {
        expect(state)
          .toEqual(settings.file_sending);
      });
    });

    describe('when a UPDATE_PREVIEWER_SETTINGS action is dispatched', () => {
      let settings;

      beforeEach(() => {
        settings = {
          file_sending: {
            allowed_extensions: 'exe',
            enabled: false
          }
        };

        state = reducer(initialState, {
          type: actionTypes.UPDATE_PREVIEWER_SETTINGS,
          payload: settings
        });
      });

      it('sets the action payload as the state', () => {
        expect(state)
          .toEqual(settings.file_sending);
      });
    });
  });
});
