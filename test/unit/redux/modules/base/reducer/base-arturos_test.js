describe('base reducer arturos', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/base/reducer/base-arturos');
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
    it('is set to a empty object', () => {
      expect(initialState)
        .toEqual({});
    });
  });

  describe('when an UPDATE_ARTUROS action is dispatched', () => {
    let mockArturos,
      state,
      currentState;

    beforeEach(() => {
      mockArturos = {
        newChat: true
      };
      state = reducer(currentState, {
        type: actionTypes.UPDATE_ARTUROS,
        payload: mockArturos
      });
    });

    describe('when currentState is initialState', () => {
      beforeAll(() => {
        currentState = {};
      });

      it('sets the action payload as the state', () => {
        expect(state)
          .toEqual(mockArturos);
      });
    });

    describe('when currentState has same attributes with different values', () => {
      beforeAll(() => {
        currentState = {
          newChat: false
        };
      });

      it('sets the action payload as the state', () => {
        expect(state)
          .toEqual(mockArturos);
      });
    });

    describe('when currentState has different attributes', () => {
      beforeAll(() => {
        currentState = {
          newDesign: true
        };
      });

      it('does not override existing attributes that are mutually exclusive from the payload properties', () => {
        expect(state)
          .toEqual({
            ...currentState,
            ...mockArturos
          });
      });
    });
  });
});
