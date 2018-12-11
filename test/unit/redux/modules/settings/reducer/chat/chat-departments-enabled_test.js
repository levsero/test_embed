describe('chat reducer departments enabled', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/settings/reducer/chat/chat-departments-enabled');
    const actionTypesPath = buildSrcPath('redux/modules/settings/settings-action-types');

    reducer = requireUncached(reducerPath).default;

    initialState = reducer(undefined, { type: '' });
    actionTypes = requireUncached(actionTypesPath);
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('initial state', () => {
    it('is set to null', () => {
      expect(initialState).toEqual(null);
    });
  });

  describe('when an UPDATE_SETTINGS action is dispatched', () => {
    let someSettings,
      state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.UPDATE_SETTINGS,
        payload: someSettings
      });
    });

    describe('when departments enabled has not been set', () => {
      beforeAll(() => {
        someSettings = {
          webWidget: {
            chat: {
              suppress: true
            }
          }
        };
      });

      it('sets the action payload to the initial state', () => {
        expect(state).toEqual(null);
      });
    });

    describe('when departments enabled has been set', () => {
      beforeAll(() => {
        someSettings = {
          webWidget: {
            chat: {
              departments: {
                enabled: ['Dep']
              }
            }
          }
        };
      });

      it('sets the action payload as the state', () => {
        expect(state)
          .toEqual(['Dep']);
      });
    });
  });
});
