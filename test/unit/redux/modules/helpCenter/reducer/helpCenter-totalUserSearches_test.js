describe('helpCenter reducer totalUserSearches', () => {
  let reducer,
    actionTypes,
    baseActionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/helpCenter/reducer/helpCenter-totalUserSearches');
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

  describe('when an SEARCH_REQUEST_SUCCESS action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.SEARCH_REQUEST_SUCCESS
      });
    });

    it('sets the state to 1', () => {
      expect(state)
        .toEqual(1);
    });
  });

  describe('when a SEARCH_REQUEST_FAILURE action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.SEARCH_REQUEST_FAILURE
      });
    });

    it('sets the state to 1', () => {
      expect(state)
        .toEqual(1);
    });
  });

  describe('when an irrelevant action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: 'blah'
      });
    });

    it('sets the state to 0', () => {
      expect(state)
        .toEqual(0);
    });
  });

  describe('when a API_CLEAR_HC_SEARCHES action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(4, {
        type: baseActionTypes.API_CLEAR_HC_SEARCHES
      });
    });

    it('resets to default, regardless of input', () => {
      expect(state)
        .toEqual(0);
    });
  });
});
