describe('base reducer widgetShown', () => {
  let reducer,
    actionTypes,
    initialState,
    mockIsPopout = false;

  beforeAll(() => {
    mockery.enable();

    initMockRegistry({
      'utility/globals': {
        isPopout: () => mockIsPopout
      }
    });

    const reducerPath = buildSrcPath('redux/modules/base/reducer/base-embed-shown');
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

  describe('when an UPDATE_WIDGET_SHOWN action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.UPDATE_WIDGET_SHOWN,
        payload: true
      });
    });

    it('sets the action payload as the state', () => {
      expect(state)
        .toEqual(true);
    });
  });

  describe('when an API_CLEAR_HC_SEARCHES action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.API_CLEAR_HC_SEARCHES,
        payload: true
      });
    });

    it('return initial state (false) as the state has been reset', () => {
      expect(state)
        .toEqual(false);
    });
  });

  describe('when a WIDGET_INITIALISED action is dispatched', () => {
    let state, mockState;

    beforeEach(() => {
      state = reducer(mockState, { type: actionTypes.WIDGET_INITIALISED });
    });

    describe('when the window is a popout', () => {
      beforeAll(() => {
        mockIsPopout = true;
        mockState = false;
      });

      it('return true', () => {
        expect(state).toEqual(true);
      });
    });

    describe('when the window is not a popout', () => {
      beforeAll(() => {
        mockIsPopout = false;
        mockState = true;
      });

      it('return false', () => {
        expect(state).toEqual(false);
      });
    });
  });
});
