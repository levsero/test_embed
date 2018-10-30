describe('helpCenter reducer articles', () => {
  let reducer,
    actionTypes,
    baseActionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/helpCenter/reducer/helpCenter-articles');
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
    it('is set to an empty array', () => {
      expect(initialState)
        .toEqual([]);
    });
  });

  describe('when an CONTEXTUAL_SEARCH_REQUEST_SUCCESS action is dispatched', () => {
    let state,
      mockPayload;

    beforeEach(() => {
      mockPayload = {
        articles: [{ id: 123 }, { id: 347865 }, { id: 238957 }],
        articleViewActive: false,
        resultsCount: 1
      };

      state = reducer(initialState, {
        type: actionTypes.CONTEXTUAL_SEARCH_REQUEST_SUCCESS,
        payload: mockPayload
      });
    });

    it('sets the state to the article array from the payload', () => {
      const expected = [{ id: 123 }, { id: 347865 }, { id: 238957 }];

      expect(state)
        .toEqual(expected);
    });
  });

  describe('when an SEARCH_REQUEST_SUCCESS action is dispatched', () => {
    let state,
      mockPayload;

    beforeEach(() => {
      mockPayload = {
        articles: [{ id: 456 }, { id: 100000 }],
        articleViewActive: false,
        resultsCount: 1
      };

      state = reducer(initialState, {
        type: actionTypes.SEARCH_REQUEST_SUCCESS,
        payload: mockPayload
      });
    });

    it('sets the state to the article array from the payload', () => {
      const expected = [{ id: 456 }, { id: 100000 }];

      expect(state)
        .toEqual(expected);
    });
  });

  describe('when an SEARCH_REQUEST_FAILURE action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.SEARCH_REQUEST_FAILURE
      });
    });

    it('resets state', () => {
      expect(state)
        .toEqual([]);
    });
  });

  describe('when an API_CLEAR_HC_SEARCHES action is dispatched', () => {
    let state,
      mockState;

    beforeEach(() => {
      mockState = ['hello', 'david', 'how', 'are', 'you?'];

      state = reducer(mockState, {
        type: baseActionTypes.API_CLEAR_HC_SEARCHES
      });
    });

    it('resets to default, regardless of input', () => {
      expect(state)
        .toEqual([]);
    });
  });
});
