describe('helpCenter reducer activeArticle', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/helpCenter/reducer/helpCenter-activeArticle');
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
    it('is set to null', () => {
      expect(initialState)
        .toEqual(null);
    });
  });

  describe('when an UPDATE_ACTIVE_ARTICLE action is dispatched', () => {
    let state,
      mockArticle;

    beforeEach(() => {
      mockArticle = {
        id: 123,
        body: 'bogan ipsum'
      };

      state = reducer(initialState, {
        type: actionTypes.UPDATE_ACTIVE_ARTICLE,
        payload: mockArticle
      });
    });

    it('sets the state to the article passed from the payload', () => {
      expect(state)
        .toEqual(mockArticle);
    });
  });

  describe('when an RESET_ACTIVE_ARTICLE action is dispatched', () => {
    let state;

    beforeEach(() => {
      initialState = {
        id: 123,
        body: 'bogan ipsum'
      };

      state = reducer(initialState, { type: actionTypes.RESET_ACTIVE_ARTICLE });
    });

    it('sets the state to null from the payload', () => {
      expect(state)
        .toEqual(null);
    });
  });
});
