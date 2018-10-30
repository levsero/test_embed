describe('helpCenter reducer resultsCount', () => {
  let reducer,
    actionTypes,
    baseActionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/helpCenter/reducer/helpCenter-resultsCount');
    const actionTypesPath = buildSrcPath('redux/modules/helpCenter/helpCenter-action-types');
    const baseActionTypesPath = buildSrcPath('redux/modules/base/base-action-types');

    reducer = requireUncached(reducerPath).default;

    initialState = reducer(undefined, { type: '' });
    actionTypes = requireUncached(actionTypesPath);
    baseActionTypes = requireUncached(baseActionTypesPath);
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

  describe('when an API_CLEAR_HC_SEARCHES action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(4, {
        type: baseActionTypes.API_CLEAR_HC_SEARCHES,
        payload: {
          resultsCount: 4
        }
      });
    });

    it('resets to default, regardless of input', () => {
      expect(state)
        .toEqual(0);
    });
  });
});
