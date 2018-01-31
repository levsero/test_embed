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
});
