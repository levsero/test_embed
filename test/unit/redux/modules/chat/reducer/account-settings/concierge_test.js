describe('chat reducer accountSettings concierge', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/account-settings/concierge');
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
      it('avatar_path is set to an empty string', () => {
        expect(initialState.avatar_path)
          .toEqual('');
      });

      it('display_name is set to an empty string', () => {
        expect(initialState.display_name)
          .toEqual('');
      });

      it('title is set to an empty string', () => {
        expect(initialState.title)
          .toEqual('');
      });
    });

    describe('when a GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS action is dispatched', () => {
      let settings;

      beforeEach(() => {
        settings = {
          concierge: {
            avatar_path: 'r.m',
            display_name: 'Rick',
            title: 'Rickiest Rick'
          }
        };

        state = reducer(initialState, {
          type: actionTypes.GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS,
          payload: settings
        });
      });

      it('sets the action payload as the state', () => {
        expect(state)
          .toEqual(settings.concierge);
      });
    });
  });
});
