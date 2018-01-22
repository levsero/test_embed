describe('helpCenter reducer articleClicked', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/helpCenter/reducer/helpCenter-articleClicked');
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

  describe('when an SEARCH_REQUEST action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.SEARCH_REQUEST
      });
    });

    it('sets the state to false', () => {
      expect(state)
        .toEqual(false);
    });
  });

  describe('when an UPDATE_ACTIVE_ARTICLE action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.UPDATE_ACTIVE_ARTICLE
      });
    });

    it('sets the state to true', () => {
      expect(state)
        .toEqual(true);
    });
  });

  describe('when an RESET_ACTIVE_ARTICLE action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.RESET_ACTIVE_ARTICLE
      });
    });

    it('sets the state to false', () => {
      expect(state)
        .toEqual(false);
    });
  });
});
