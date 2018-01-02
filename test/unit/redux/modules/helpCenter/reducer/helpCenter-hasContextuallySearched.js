describe('helpCenter reducer hasContextuallySearched', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/helpCenter/reducer/helpCenter-hasContextuallySearched');
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

  describe('when an CONTEXTUAL_SEARCH_SUCCESS action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.CONTEXTUAL_SEARCH_SUCCESS
      });
    });

    it('sets the state to true', () => {
      expect(state)
        .toEqual(true);
    });
  });

  describe('when an CONTEXTUAL_SEARCH_SUCCESS_NO_RESULTS action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.CONTEXTUAL_SEARCH_SUCCESS_NO_RESULTS
      });
    });

    it('sets the state to false', () => {
      expect(state)
        .toEqual(false);
    });
  });

  describe('when an SEARCH_SUCCESS action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.SEARCH_SUCCESS
      });
    });

    it('sets the state to false', () => {
      expect(state)
        .toEqual(false);
    });
  });
});
