describe('chat reducer accountSettings offlineForm', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/account-settings/offline-form');
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
      const defaultFieldProps = { name: '', required: false };

      it('form is set to an object with default field props', () => {
        const expected = {
          name: defaultFieldProps,
          email: defaultFieldProps,
          phone: defaultFieldProps,
          message: defaultFieldProps
        };

        expect(initialState.form)
          .toEqual(expected);
      });
    });

    describe('when a GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS action is dispatched', () => {
      let settings;

      beforeEach(() => {
        settings = {
          forms: {
            offline_form: {
              form: {
                0: { name: 'name', required: true },
                1: { name: 'email', required: true },
                2: { name: 'phone', label: 'Phone Number', required: true },
                3: { name: 'message', label: 'Message', required: false }
              }
            }
          }
        };

        state = reducer(initialState, {
          type: actionTypes.GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS,
          payload: settings
        });
      });

      it('sets the action payload as the state', () => {
        expect(state)
          .toEqual(settings.forms.offline_form);
      });
    });
  });
});
