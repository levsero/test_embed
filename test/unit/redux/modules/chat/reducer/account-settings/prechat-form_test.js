describe('chat reducer accountSettings prechatForm', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/account-settings/prechat-form');
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
      it('form is set to an object with default field props', () => {
        expect(initialState.form)
          .toEqual({
            name: { name: 'name', required: false },
            email: { name: 'email', required: false },
            phone: { name: 'phone', required: false },
            message: { name: 'message', required: false }
          });
      });

      it('message is set to an empty string', () => {
        expect(initialState.message)
          .toEqual('');
      });

      it('profile_required is set to false', () => {
        expect(initialState.profile_required)
          .toEqual(false);
      });

      it('required is set to false', () => {
        expect(initialState.required)
          .toEqual(false);
      });
    });

    describe('when a GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS action is dispatched', () => {
      let settings;
      const mockForm = {
        0: { name: 'name', required: true },
        1: { name: 'email', required: true }
      };

      beforeEach(() => {
        settings = {
          forms: {
            pre_chat_form: {
              form: mockForm,
              message: 'Hello, World!',
              profile_required: false,
              required: true
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
          .toEqual(settings.forms.pre_chat_form);
      });
    });

    describe('when a UPDATE_PREVIEWER_SETTINGS action is dispatched', () => {
      let settings;
      const mockForm = {
        0: { name: 'name', required: true },
        1: { name: 'email', required: true }
      };

      beforeEach(() => {
        settings = {
          forms: {
            pre_chat_form: {
              form: mockForm,
              message: 'Hello, World!',
              profile_required: false,
              required: true
            }
          }
        };

        state = reducer(initialState, {
          type: actionTypes.UPDATE_PREVIEWER_SETTINGS,
          payload: settings
        });
      });

      it('sets the action payload as the state', () => {
        expect(state)
          .toEqual(settings.forms.pre_chat_form);
      });
    });
  });
});
