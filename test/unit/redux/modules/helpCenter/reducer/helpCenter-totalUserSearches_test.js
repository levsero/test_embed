fdescribe('helpCenter reducer totalUserSearches', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/helpCenter/reducer/helpCenter-totalUserSearches');
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
    it('is set to 0', () => {
      expect(initialState)
        .toEqual(0);
    });
  });

  describe('when an SEARCH_SUCCESS action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.SEARCH_SUCCESS
      });
    });

    it('sets the state to 1', () => {
      expect(state)
        .toEqual(1);
    });
  });

  describe('when a SEARCH_FAILURE action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.SEARCH_FAILURE
      });
    });

    it('sets the state to 1', () => {
      expect(state)
        .toEqual(1);
    });
  });

  describe('when an irrelevant action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: 'blah'
      });
    });

    it('sets the state to 0', () => {
      expect(state)
        .toEqual(0);
    });
  });
});
