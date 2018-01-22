describe('helpCenter reducer articles', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/helpCenter/reducer/helpCenter-articles');
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
    it('is set to an empty array', () => {
      expect(initialState)
        .toEqual([]);
    });
  });

  describe('when an UPDATE_RESULTS action is dispatched', () => {
    let state,
      mockPayload;

    beforeEach(() => {
      mockPayload = {
        articles: [{ id: 123 }, { id: 347865 }, { id: 238957 }],
        articleViewActive: false,
        resultsCount: 1,
        viewMoreClicked: false
      };

      state = reducer(initialState, {
        type: actionTypes.UPDATE_RESULTS,
        payload: mockPayload
      });
    });

    it('sets the state to the article array from the payload', () => {
      const expected = [{ id: 123 }, { id: 347865 }, { id: 238957 }];

      expect(state)
        .toEqual(expected);
    });
  });
});
