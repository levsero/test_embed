describe('helpCenter reducer searchFieldValue', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/helpCenter/reducer/helpCenter-searchFieldValue');
    const actionTypesPath = buildSrcPath('redux/modules/helpCenter/helpCenter-action-types');

    reducer = requireUncached(reducerPath).default;
    actionTypes = requireUncached(actionTypesPath);

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

  describe('when an UPDATE_SEARCH_FIELD_VALUE action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.UPDATE_SEARCH_FIELD_VALUE,
        payload: 'dsfdsfdss sdfds fsd fdsf'
      });
    });

    it('sets the state to the search field value from the payload', () => {
      expect(state)
        .toEqual('dsfdsfdss sdfds fsd fdsf');
    });
  });
});
