describe('helpCenter reducer activeArticle', () => {
  let reducer,
    actionTypes,
    baseActionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/helpCenter/reducer/helpCenter-activeArticle');
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
    it('is set to null', () => {
      expect(initialState)
        .toEqual(null);
    });
  });

  describe('when an ARTICLE_CLICKED action is dispatched', () => {
    let state,
      mockArticle;

    beforeEach(() => {
      mockArticle = {
        id: 123,
        body: 'bogan ipsum'
      };

      state = reducer(initialState, {
        type: actionTypes.ARTICLE_CLICKED,
        payload: mockArticle
      });
    });

    it('sets the state to the article passed from the payload', () => {
      expect(state)
        .toEqual(mockArticle);
    });
  });

  describe('when an GET_ARTICLE_REQUEST_SUCCESS action is dispatched', () => {
    let state,
      mockArticle;

    beforeEach(() => {
      mockArticle = {
        id: 123,
        body: 'bogan ipsum'
      };

      state = reducer(initialState, {
        type: actionTypes.GET_ARTICLE_REQUEST_SUCCESS,
        payload: mockArticle
      });
    });

    it('sets the state to the article passed from the payload', () => {
      expect(state)
        .toEqual(mockArticle);
    });
  });

  describe('when an ARTICLE_CLOSED action is dispatched', () => {
    let state;

    beforeEach(() => {
      initialState = {
        id: 123,
        body: 'bogan ipsum'
      };

      state = reducer(initialState, { type: actionTypes.ARTICLE_CLOSED });
    });

    it('sets the state to null', () => {
      expect(state)
        .toEqual(null);
    });
  });

  describe('when an API_CLEAR_HC_SEARCHES action is dispatched', () => {
    let state;

    beforeAll(() => {
      initialState = {
        id: 123,
        body: 'bogan ipsum'
      };
      state = reducer(initialState, {
        type: baseActionTypes.API_CLEAR_HC_SEARCHES
      });
    });

    it('resets to default, regardless of input', () => {
      expect(state)
        .toEqual(null);
    });
  });
});
