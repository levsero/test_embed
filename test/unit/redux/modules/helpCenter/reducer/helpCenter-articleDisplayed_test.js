describe('helpCenter reducer articleDisplayed', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/helpCenter/reducer/helpCenter-articleDisplayed');
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
    it('is set to false', () => {
      expect(initialState)
        .toEqual(false);
    });
  });

  describe('when an GET_ARTICLE_REQUEST_SUCCESS action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.GET_ARTICLE_REQUEST_SUCCESS
      });
    });

    it('sets the state to true', () => {
      expect(state)
        .toEqual(true);
    });
  });

  describe('when an GET_ARTICLE_REQUEST_FAILURE action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.GET_ARTICLE_REQUEST_FAILURE
      });
    });

    it('sets the state to false', () => {
      expect(state)
        .toEqual(false);
    });
  });

  describe('when an GET_ARTICLE_REQUEST_SENT action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.GET_ARTICLE_REQUEST_SENT
      });
    });

    it('sets the state to false', () => {
      expect(state)
        .toEqual(false);
    });
  });
});
