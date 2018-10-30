describe('base reducer has widget shown reducer', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/base/reducer/base-has-widget-shown');
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

  describe('when UPDATE_WIDGET_SHOWN action is dispatched', () => {
    let action,
      state,
      mockPayload,
      mockState = initialState;

    beforeEach(() => {
      action = {
        type: actionTypes.UPDATE_WIDGET_SHOWN,
        payload: mockPayload
      };

      state = reducer(mockState, action);
    });

    describe('when payload is true', () => {
      beforeAll(() => {
        mockPayload = true;
      });

      it('sets state to true', () => {
        expect(state)
          .toEqual(true);
      });
    });

    describe('when payload is false', () => {
      beforeAll(() => {
        mockPayload = false;
      });

      describe('when original state is already set to true', () => {
        beforeAll(() => {
          mockState = true;
        });

        it('does not affect state', () => {
          expect(state)
            .toEqual(true);
        });
      });

      describe('when original state is already set to false', () => {
        beforeAll(() => {
          mockState = false;
        });

        it('does not affect state', () => {
          expect(state)
            .toEqual(false);
        });
      });
    });
  });

  describe('when API_RESET_WIDGET action is dispatched', () => {
    let action,
      state,
      mockPayload,
      mockState = initialState;

    beforeEach(() => {
      action = {
        type: actionTypes.API_RESET_WIDGET,
        payload: mockPayload
      };

      state = reducer(mockState, action);
    });

    describe('when payload is true', () => {
      beforeAll(() => {
        mockPayload = true;
      });

      it('resets to default, regardless of input', () => {
        expect(state)
          .toEqual(false);
      });
    });
  });
});
