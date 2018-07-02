describe('helpCenter reducer contextualSearch', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/helpCenter/reducer/helpCenter-contextualSearch');
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
});
