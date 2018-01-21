describe('helpCenter reducer articleViewActive', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/helpCenter/reducer/helpCenter-articleViewActive');
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
    it('is set to false', () => {
      expect(initialState)
        .toEqual(false);
    });
  });

  describe('when an UPDATE_RESULTS action is dispatched', () => {
    let state,
      mockPayload;

    beforeEach(() => {
      mockPayload = {
        articles: [{ id: 123 }],
        articleViewActive: false,
        resultsCount: 1,
        viewMoreClicked: false
      };

      state = reducer(initialState, {
        type: actionTypes.UPDATE_RESULTS,
        payload: mockPayload
      });
    });

    it('sets the state false from the payload', () => {
      expect(state)
        .toEqual(false);
    });
  });

  describe('when an UPDATE_ARTICLE_VIEW_ACTIVE action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.UPDATE_ARTICLE_VIEW_ACTIVE,
        payload: true
      });
    });

    it('sets the state true from the payload', () => {
      expect(state)
        .toEqual(true);
    });
  });
});
