describe('helpCenter reducer resultsLocale', () => {
  let reducer,
    actionTypes,
    baseActionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/helpCenter/reducer/helpCenter-resultsLocale');
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
    it('is set to and empty string', () => {
      expect(initialState)
        .toEqual('');
    });
  });

  describe('when an CONTEXTUAL_SEARCH_REQUEST_SUCCESS action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.CONTEXTUAL_SEARCH_REQUEST_SUCCESS,
        payload: { locale: 'fr' }
      });
    });

    it('sets the state to the locale from the payload', () => {
      expect(state)
        .toEqual('fr');
    });
  });

  describe('when an SEARCH_REQUEST_SUCCESS action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.SEARCH_REQUEST_SUCCESS,
        payload: { locale: 'he' }
      });
    });

    it('sets the state to the locale from the payload', () => {
      expect(state)
        .toEqual('he');
    });
  });

  describe('when an API_CLEAR_HC_SEARCHES action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer('taipan', {
        type: baseActionTypes.API_CLEAR_HC_SEARCHES,
        payload: {
          locale: 'he'
        }
      });
    });

    it('resets to default, regardless of input', () => {
      expect(state)
        .toEqual('');
    });
  });
});
