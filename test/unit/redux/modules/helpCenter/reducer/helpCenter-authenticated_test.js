describe('helpCenter-authenticated', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/helpCenter/reducer/helpCenter-authenticated');
    const actionTypesPath = buildSrcPath('redux/modules/helpCenter/helpCenter-action-types');

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
    it('is set to false', () => {
      expect(initialState)
        .toEqual(false);
    });
  });

  describe('when an UPDATE_HELP_CENTER_AUTHENTICATED action is dispatched', () => {
    let action,
      state,
      newAction,
      newState;

    beforeEach(() => {
      action = {
        type: actionTypes.UPDATE_HELP_CENTER_AUTHENTICATED,
        payload: false
      };

      state = reducer(initialState, action);
    });

    describe('when payload contains true', () => {
      beforeEach(() => {
        newAction = {
          type: actionTypes.UPDATE_HELP_CENTER_AUTHENTICATED,
          payload: true
        };

        newState = reducer(state, newAction);
      });

      it('should return true for authenticated', () => {
        expect(newState)
          .toEqual(true);
      });
    });

    describe('when payload contains false', () => {
      beforeEach(() => {
        newAction = {
          type: actionTypes.UPDATE_HELP_CENTER_AUTHENTICATED,
          payload: false
        };

        newState = reducer(state, newAction);
      });

      it('should return false for authenticated', () => {
        expect(newState)
          .toEqual(false);
      });
    });
  });
});
