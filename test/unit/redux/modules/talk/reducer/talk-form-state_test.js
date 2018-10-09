describe('talk reducer form state', () => {
  let reducer,
    actionTypes,
    baseActionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/talk/reducer/talk-form-state');
    const actionTypesPath = buildSrcPath('redux/modules/talk/talk-action-types');
    const baseActionTypesPath = buildSrcPath('redux/modules/base/base-action-types');

    reducer = requireUncached(reducerPath).default;
    actionTypes = requireUncached(actionTypesPath);
    baseActionTypes = requireUncached(baseActionTypesPath);

    initialState = reducer(undefined, { type: '' });
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('reducer', () => {
    let state;

    describe('initial state', () => {
      const expected = {
        name: '',
        phone: ''
      };

      it('is set to an object with expected structure', () => {
        expect(initialState)
          .toEqual(expected);
      });
    });

    describe('when a UPDATE_CALLBACK_FORM action is dispatched', () => {
      let mockFormState;

      beforeEach(() => {
        mockFormState = { phone: '+61412345678' };

        state = reducer(initialState, {
          type: actionTypes.UPDATE_CALLBACK_FORM,
          payload: mockFormState
        });
      });

      it('sets the state to the payload merged with the initial state', () => {
        expect(state)
          .toEqual({
            ...mockFormState,
            name: ''
          });
      });
    });

    describe('when an API_CLEAR_FORM action is dispatched', () => {
      beforeEach(() => {
        const mockState = {
          name: 'Frodo Baggins',
          phone: '+61412369874'
        };

        state = reducer(mockState, {
          type: baseActionTypes.API_CLEAR_FORM
        });
      });

      it('resets the formState to initialState', () => {
        expect(state).toEqual(initialState);
      });
    });
  });
});
