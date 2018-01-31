describe('helpCenter reducer resultsCount', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/helpCenter/reducer/helpCenter-resultsCount');
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
    it('is set to 0', () => {
      expect(initialState)
        .toEqual(0);
    });
  });

  describe('when an CONTEXTUAL_SEARCH_REQUEST_SUCCESS action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.CONTEXTUAL_SEARCH_REQUEST_SUCCESS,
        payload: { resultsCount: 6 }
      });
    });

    it('sets the state to the counter from the payload', () => {
      expect(state)
        .toEqual(6);
    });
  });

  describe('when an SEARCH_REQUEST_SUCCESS action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.SEARCH_REQUEST_SUCCESS,
        payload: { resultsCount: 4 }
      });
    });

    it('sets the state to the counter from the payload', () => {
      expect(state)
        .toEqual(4);
    });
  });
});
