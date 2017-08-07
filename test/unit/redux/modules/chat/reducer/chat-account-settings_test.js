describe('chat reducer accountSettings', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-account-settings');
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
      it('is set to an empty object', () => {
        expect(initialState)
          .toEqual({});
      });
    });

    describe('when a UPDATE_ACCOUNT_SETTINGS action is dispatched', () => {
      let settings;

      beforeEach(() => {
        settings = { foo: 'bar' };

        state = reducer(initialState, {
          type: actionTypes.UPDATE_ACCOUNT_SETTINGS,
          payload: settings
        });
      });

      it('sets the action payload as the state', () => {
        expect(state)
          .toEqual(settings);
      });
    });
  });
});
