describe('talk reducer form state', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/talk/reducer/talk-form-state');
    const actionTypesPath = buildSrcPath('redux/modules/talk/talk-action-types');

    reducer = requireUncached(reducerPath).default;
    actionTypes = requireUncached(actionTypesPath);

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
      let formState;

      beforeEach(() => {
        formState = { phone: '+61412345678' };

        state = reducer(initialState, {
          type: actionTypes.UPDATE_CALLBACK_FORM,
          payload: formState
        });
      });

      it('sets the action payload as the state', () => {
        expect(state)
          .toEqual(formState);
      });
    });
  });
});
