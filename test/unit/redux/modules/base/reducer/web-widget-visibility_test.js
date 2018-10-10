describe('base reducer web widget visibility', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/base/reducer/web-widget-visibility');
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

  describe('when an LAUNCHER_CLICKED action is dispatched', () => {
    let state;

    beforeEach(() => {
      const action = {
        type: actionTypes.LAUNCHER_CLICKED
      };

      state = reducer(initialState, action);
    });

    it('is set to true', () => {
      expect(state)
        .toEqual(true);
    });
  });

  describe('when an CLOSE_BUTTON_CLICKED action is dispatched', () => {
    let state;

    beforeEach(() => {
      const action = {
        type: actionTypes.CLOSE_BUTTON_CLICKED
      };

      state = reducer(initialState, action);
    });

    it('is set to false', () => {
      expect(state)
        .toEqual(false);
    });
  });
});
