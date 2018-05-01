describe('chat reducer accountSettings login', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/account-settings/login');
    const actionTypesPath = buildSrcPath('redux/modules/chat/chat-action-types');

    reducer = requireUncached(reducerPath).default;
    actionTypes = requireUncached(actionTypesPath);

    initialState = reducer(undefined, { });
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('reducer', () => {
    let state;

    describe('initial state', () => {
      it('sets the initial state to an empty object', () => {
        const expected = { };

        expect(initialState)
          .toEqual(expected);
      });
    });

    describe('when a GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS action is dispatched', () => {
      const restrictProfile = true;
      const phoneDisplay = true;
      const allowedTypes = { loginMethod1: 'method1', loginMethod2: 'method2' };

      beforeEach(() => {
        const mockSettings = {
          login: {
            restrict_profile: restrictProfile,
            phone_display: phoneDisplay,
            allowed_types: allowedTypes
          }
        };

        state = reducer(initialState, {
          type: actionTypes.GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS,
          payload: mockSettings
        });
      });

      it('sets the state correctly', () => {
        const expected = {
          enabled: !restrictProfile,
          phoneEnabled: phoneDisplay,
          loginTypes: allowedTypes
        };

        expect(state)
          .toEqual(expected);
      });
    });

    describe('when a UPDATE_PREVIEWER_SETTINGS action is dispatched', () => {
      const restrictProfile = true;
      const phoneDisplay = true;
      const allowedTypes = { loginMethod1: 'method1', loginMethod2: 'method2' };

      beforeEach(() => {
        const mockSettings = {
          login: {
            restrict_profile: restrictProfile,
            phone_display: phoneDisplay,
            allowed_types: allowedTypes
          }
        };

        state = reducer(initialState, {
          type: actionTypes.UPDATE_PREVIEWER_SETTINGS,
          payload: mockSettings
        });
      });

      it('sets the state correctly', () => {
        const expected = {
          enabled: !restrictProfile,
          phoneEnabled: phoneDisplay,
          loginTypes: allowedTypes
        };

        expect(state)
          .toEqual(expected);
      });
    });
  });
});
