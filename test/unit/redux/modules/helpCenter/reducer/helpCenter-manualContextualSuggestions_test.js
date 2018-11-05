describe('helpCenter reducer manualContextualSuggestions', () => {
  let reducer,
    actionTypes,
    baseActionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/helpCenter/reducer/helpCenter-manualContextualSuggestions');
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
        query: '',
        labels: [],
        url: false
      };

      expect(initialState)
        .toEqual(expected);
    });
  });

  describe('when CONTEXTUAL_SUGGESTIONS_MANUALLY_SET', () => {
    let mockAction,
      state;

    beforeEach(() => {
      state = reducer(initialState, mockAction);
    });

    describe('search string provided', () => {
      beforeAll(() => {
        mockAction = {
          type: actionTypes.CONTEXTUAL_SUGGESTIONS_MANUALLY_SET,
          payload: {
            search: 'yolo search',
            labels: ['y', 'o', 'l', 'o']
          }
        };
      });

      it('sets the query state correctly', () => {
        expect(state)
          .toEqual({
            query: 'yolo search',
            labels: [],
            url: false
          });
      });
    });

    describe('labels provided', () => {
      beforeAll(() => {
        mockAction = {
          type: actionTypes.CONTEXTUAL_SUGGESTIONS_MANUALLY_SET,
          payload: {
            labels: ['yo', 'this', 'a', 'label'],
            url: true
          }
        };
      });

      it('sets the query state correctly', () => {
        expect(state)
          .toEqual({
            query: '',
            labels: ['yo', 'this', 'a', 'label'],
            url: false
          });
      });
    });

    describe('url provided', () => {
      beforeAll(() => {
        mockAction = {
          type: actionTypes.CONTEXTUAL_SUGGESTIONS_MANUALLY_SET,
          payload: {
            url: true
          }
        };
      });

      it('sets the query state correctly', () => {
        expect(state)
          .toEqual({
            query: '',
            labels: [],
            url: true
          });
      });
    });
  });

  describe('when API_CLEAR_HC_SEARCHES', () => {
    let mockAction,
      mockState,
      state;

    beforeEach(() => {
      mockState = {
        query: 'Hello David, my name is HAL',
        labels: ['destroy', 'all', 'humans'],
        url: 'DoYouTrustMe.com'
      };

      state = reducer(mockState, mockAction);
    });

    describe('labels provided', () => {
      beforeAll(() => {
        mockAction = {
          type: baseActionTypes.API_CLEAR_HC_SEARCHES,
          payload: {
            labels: ['yo', 'this', 'a', 'label'],
            url: true
          }
        };
      });

      it('resets to default, regardless of input', () => {
        const expected = {
          query: '',
          labels: [],
          url: false
        };

        expect(state)
          .toEqual(expected);
      });
    });
  });
});
