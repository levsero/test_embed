describe('helpCenter reducer lastSearchTimestamp', () => {
  let reducer,
    actionTypes,
    baseActionTypes,
    initialState;

  beforeEach(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/helpCenter/reducer/helpCenter-lastSearchTimestamp');
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
    it('is set to -1', () => {
      expect(initialState)
        .toEqual(-1);
    });
  });

  describe('when an SEARCH_REQUEST_SENT action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.SEARCH_REQUEST_SENT,
        payload: { timestamp: 2 }
      });
    });

    it('sets the state to the payload timestamp', () => {
      expect(state)
        .toEqual(2);
    });
  });

  describe('when a CONTEXTUAL_SEARCH_REQUEST_SENT action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.CONTEXTUAL_SEARCH_REQUEST_SENT,
        payload: {
          timestamp: 3
        }
      });
    });

    it('sets the state to the payload timestamp', () => {
      expect(state)
        .toEqual(3);
    });
  });

  describe('when an API_CLEAR_HC_SEARCHES action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(3, {
        type: baseActionTypes.API_CLEAR_HC_SEARCHES,
        payload: {
          timestamp: 3
        }
      });
    });

    it('resets to default, regardless of input', () => {
      expect(state)
        .toEqual(-1);
    });
  });
});
