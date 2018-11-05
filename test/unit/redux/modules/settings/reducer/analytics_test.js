describe('analytics reducer', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/settings/reducer/analytics');
    const actionTypesPath = buildSrcPath('redux/modules/settings/settings-action-types');

    reducer = requireUncached(reducerPath).default;

    initialState = reducer(undefined, { type: '' });
    actionTypes = requireUncached(actionTypesPath);
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('reducer', () => {
    describe('initial state', () => {
      it('is set to true', () => {
        expect(initialState)
          .toEqual(true);
      });
    });

    describe('when a UPDATE_SETTINGS action is dispatched', () => {
      let state;

      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.UPDATE_SETTINGS,
          payload: {
            webWidget: {
              analytics: false
            }
          }
        });
      });

      it('sets it to the state passed in from analytics', () => {
        expect(state)
          .toEqual(false);
      });
    });
  });
});
