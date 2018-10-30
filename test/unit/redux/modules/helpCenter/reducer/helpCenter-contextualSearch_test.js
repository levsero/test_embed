describe('helpCenter reducer contextualSearch', () => {
  let reducer,
    actionTypes,
    baseActionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/helpCenter/reducer/helpCenter-contextualSearch');
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
    it('is set to an expected object', () => {
      const expected = {
        hasSearched: false,
        screen: ''
      };

      expect(initialState)
        .toEqual(expected);
    });
  });

  describe('when actions are dispatched', () => {
    let state,
      mockAction;

    beforeEach(() => {
      state = reducer(initialState, mockAction);
    });

    describe('CONTEXTUAL_SEARCH_REQUEST_SENT', () => {
      beforeAll(() => {
        mockAction = { type: actionTypes.CONTEXTUAL_SEARCH_REQUEST_SENT };
      });

      it('sets the state to an expected value', () => {
        const expected = {
          hasSearched: true,
          screen: actionTypes.CONTEXTUAL_SEARCH_REQUEST_SENT
        };

        expect(state)
          .toEqual(jasmine.objectContaining(expected));
      });
    });

    describe('CONTEXTUAL_SEARCH_REQUEST_SUCCESS', () => {
      beforeAll(() => {
        mockAction = { type: actionTypes.CONTEXTUAL_SEARCH_REQUEST_SUCCESS };
      });

      it('sets the state to an expected value', () => {
        const expected = {
          ...initialState,
          screen: actionTypes.CONTEXTUAL_SEARCH_REQUEST_SUCCESS
        };

        expect(state)
          .toEqual(jasmine.objectContaining(expected));
      });
    });

    describe('CONTEXTUAL_SEARCH_REQUEST_FAILURE', () => {
      beforeAll(() => {
        mockAction = { type: actionTypes.CONTEXTUAL_SEARCH_REQUEST_FAILURE };
      });

      it('sets the state to an expected value', () => {
        const expected = {
          ...initialState,
          screen: actionTypes.CONTEXTUAL_SEARCH_REQUEST_FAILURE
        };

        expect(state)
          .toEqual(jasmine.objectContaining(expected));
      });
    });

    describe('SEARCH_REQUEST_SUCCESS', () => {
      beforeAll(() => {
        mockAction = { type: actionTypes.SEARCH_REQUEST_SUCCESS };
      });

      it('sets the state to the initial state', () => {
        expect(state)
          .toEqual(jasmine.objectContaining(initialState));
      });
    });
  });

  describe('API_CLEAR_HC_SEARCHES', () => {
    let mockState,
      mockAction,
      state;

    beforeAll(() => {
      mockState = {
        hasSearched: true,
        screen: 'asd'
      };

      mockAction = {
        type: baseActionTypes.API_CLEAR_HC_SEARCHES
      };
      state = reducer(mockState, mockAction);
    });

    it('resets to default, regardless of input', () => {
      expect(state)
        .toEqual(jasmine.objectContaining(initialState));
    });
  });
});
