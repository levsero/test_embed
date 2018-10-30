describe('helpCenter reducer searchFieldValue', () => {
  let reducer,
    actionTypes,
    baseActionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/helpCenter/reducer/helpCenter-searchFieldValue');
    const actionTypesPath = buildSrcPath('redux/modules/helpCenter/helpCenter-action-types');
    const baseActionTypesPath = buildSrcPath('redux/modules/base/base-action-types');

    reducer = requireUncached(reducerPath).default;
    actionTypes = requireUncached(actionTypesPath);
    baseActionTypes = requireUncached(baseActionTypesPath);

    initialState = reducer(undefined, { type: '' });
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('initial state', () => {
    it('is set to an empty string', () => {
      expect(initialState)
        .toEqual('');
    });
  });

  describe('when an SEARCH_FIELD_CHANGED action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.SEARCH_FIELD_CHANGED,
        payload: 'dsfdsfdss sdfds fsd fdsf'
      });
    });

    it('sets the state to the search field value from the payload', () => {
      expect(state)
        .toEqual('dsfdsfdss sdfds fsd fdsf');
    });
  });

  describe('when an API_CLEAR_HC_SEARCHES action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer('"Oh My" - George Takei', {
        type: baseActionTypes.API_CLEAR_HC_SEARCHES,
        payload: 'dsfdsfdss sdfds fsd fdsf'
      });
    });

    it('resets to default, regardless of input', () => {
      expect(state)
        .toEqual('');
    });
  });
});
