describe('helpCenter reducer resultsPerPage', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/helpCenter/reducer/helpCenter-resultsPerPage');
    const actionTypesPath = buildSrcPath('redux/modules/helpCenter/helpCenter-action-types');

    reducer = requireUncached(reducerPath).default;

    initialState = reducer(undefined, { type: '' });
    actionTypes = requireUncached(actionTypesPath);
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('initial state', () => {
    it('is set to the minimum search result value', () => {
      expect(initialState)
        .toEqual(3);
    });
  });

  describe('when an CONTEXTUAL_SEARCH_REQUEST_SUCCESS action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, { type: actionTypes.CONTEXTUAL_SEARCH_REQUEST_SUCCESS });
    });

    it('sets the state to the minimum search result value', () => {
      expect(state)
        .toEqual(3);
    });
  });

  describe('when an SEARCH_REQUEST_SUCCESS action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, { type: actionTypes.SEARCH_REQUEST_SUCCESS });
    });

    it('sets the state to the minimum search result value', () => {
      expect(state)
        .toEqual(3);
    });
  });

  describe('when an UPDATE_VIEW_MORE_CLICKED action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, { type: actionTypes.UPDATE_VIEW_MORE_CLICKED });
    });

    it('sets the state to the maximum search result value', () => {
      expect(state)
        .toEqual(9);
    });
  });
});
