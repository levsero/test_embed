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
      payloadTransformerSpy = jasmine.createSpy('transformer'),
      oldState;

    beforeEach(() => {
      action = {
        type: actionTypes.API_ON_RECEIVED,
        payload: {
          actionType: 'LAUNCHER_CLICK',
          selectors: [],
          callback: () => {},
          payloadTransformer: payloadTransformerSpy
        }
      };

      state = reducer(oldState, action);
    });

    describe('when state does not contain the new action in the payload', () => {
      beforeAll(() => {
        oldState = {
          WIDGET_CLOSE_BUTTON_CLICKED: {
            callbackList: [() => {}],
            selectors: []
          }
        };
      });

      it('sets the new action as a key on the state', () => {
        expect(state.LAUNCHER_CLICK)
          .toBeTruthy();

        expect(state.LAUNCHER_CLICK.callbackList.length)
          .toEqual(1);
      });

      it('sets the payload transformer', () => {
        expect(state.LAUNCHER_CLICK.payloadTransformer)
          .toEqual(payloadTransformerSpy);
      });

      it('does not change any other keys', () => {
        expect(state.WIDGET_CLOSE_BUTTON_CLICKED)
          .toBeTruthy();

        expect(state.WIDGET_CLOSE_BUTTON_CLICKED.callbackList.length)
          .toEqual(1);
      });
    });

    describe('when state already contains the new action in the payload', () => {
      beforeAll(() => {
        oldState = {
          LAUNCHER_CLICK: {
            callbackList: [() => {}],
            selectors: []
          }
        };
      });

      it('adds the new function to the old ones', () => {
        expect(state.LAUNCHER_CLICK.callbackList.length)
          .toEqual(2);
      });
    });
  });
});
