describe('base reducer on api listeners', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/base/reducer/base-on-api-listeners');
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
    it('is set to an empty object', () => {
      expect(initialState)
        .toEqual({});
    });
  });

  describe('when an API_ON_RECEIVED action is dispatched', () => {
    let action,
      state,
      oldState;

    beforeEach(() => {
      action = {
        type: actionTypes.API_ON_RECEIVED,
        payload: {
          actions: [ 'LAUNCHER_CLICK' ],
          callback: () => {}
        }
      };

      state = reducer(oldState, action);
    });

    describe('when state does not contain the new action in the payload', () => {
      beforeAll(() => {
        oldState = { WIDGET_CLOSE_BUTTON_CLICKED: [() => {}] };
      });

      it('sets the new action as a key on the state', () => {
        expect(state.LAUNCHER_CLICK.length)
          .toEqual(1);
      });

      it('does not change any other keys', () => {
        expect(state.WIDGET_CLOSE_BUTTON_CLICKED.length)
          .toEqual(1);
      });
    });

    describe('when state already contains the new action in the payload', () => {
      beforeAll(() => {
        oldState = { LAUNCHER_CLICK: [() => {}] };
      });

      it('adds the new function to the old ones', () => {
        expect(state.LAUNCHER_CLICK.length)
          .toEqual(2);
      });
    });
  });
});
