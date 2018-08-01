describe('base reducer is authentication pending', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/base/reducer/base-is-authentication-pending');
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

  describe('when an AUTHENTICATION_PENDING action is dispatched', () => {
    let action,
      state;

    beforeEach(() => {
      action = {
        type: actionTypes.AUTHENTICATION_PENDING
      };

      state = reducer(initialState, action);
    });

    it('is set to true', () => {
      expect(state)
        .toEqual(true);
    });
  });

  describe('when authentication is complete', () => {
    let action,
      state;

    beforeEach(() => {
      initialState = true;
      action = {
        type: actionTypes.AUTHENTICATION_SUCCESS
      };

      state = reducer(initialState, action);
    });

    it('is set to false', () => {
      expect(state)
        .toEqual(false);
    });
  });

  describe('when an irrelevant action is dispatched', () => {
    let action,
      state;

    beforeEach(() => {
      initialState = true;
      action = {
        type: 'yoloAction'
      };

      state = reducer(initialState, action);
    });

    it('does not change state', () => {
      expect(state)
        .toEqual(true);
    });
  });
});
