describe('helpCenter reducer manualContextualSuggestions', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/helpCenter/reducer/helpCenter-manualContextualSuggestions');
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
        query: '',
        labels: []
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
            search: 'yolo search'
          }
        };
      });

      it('sets the query state correctly', () => {
        expect(state)
          .toEqual({
            query: 'yolo search',
            labels: []
          });
      });
    });

    describe('labels provided', () => {
      beforeAll(() => {
        mockAction = {
          type: actionTypes.CONTEXTUAL_SUGGESTIONS_MANUALLY_SET,
          payload: {
            labels: ['yo', 'this', 'a', 'label']
          }
        };
      });

      it('sets the query state correctly', () => {
        expect(state)
          .toEqual({
            query: '',
            labels: ['yo', 'this', 'a', 'label']
          });
      });
    });
  });
});
