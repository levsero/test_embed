describe('helpCenter reducer viewMoreClicked', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/helpCenter/reducer/helpCenter-viewMoreClicked');
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

  describe('when an UPDATE_RESULTS action is dispatched', () => {
    let state;

    describe('when a boolean value is given', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.UPDATE_RESULTS,
          payload: { viewMoreClicked: true }
        });
      });

      it('sets the state to true', () => {
        expect(state)
          .toEqual(true);
      });
    });

    describe('when a non-boolean value is given', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.UPDATE_RESULTS,
          payload: { viewMoreClicked: '' }
        });
      });

      it('casts and sets the state to its boolean equivalent', () => {
        expect(state)
          .toEqual(false);
      });
    });
  });
});
