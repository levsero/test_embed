describe('base reducer authenticated', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/base/reducer/base-authenticated');
    const actionTypesPath = buildSrcPath('redux/modules/base/base-action-types');

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

  describe('when an UPDATE_AUTHENTICATED action is dispatched', () => {
    let payload,
      state;

    beforeEach(() => {
      payload = true;

      state = reducer(initialState, {
        type: actionTypes.UPDATE_AUTHENTICATED,
        payload: payload
      });
    });

    it('sets the action payload as the state', () => {
      expect(state)
        .toEqual(payload);
    });
  });
});
