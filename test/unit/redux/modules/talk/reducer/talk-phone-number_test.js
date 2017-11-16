describe('talk reducer phone number', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/talk/reducer/talk-phone-number');
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
      it('phoneNumber is set to an empty string', () => {
        expect(initialState)
          .toBe('');
      });
    });

    describe('when a UPDATE_PHONE_NUMBER action is dispatched', () => {
      let phoneNumber;

      beforeEach(() => {
        phoneNumber = '+61412345678';

        state = reducer(initialState, {
          type: actionTypes.UPDATE_PHONE_NUMBER,
          payload: phoneNumber
        });
      });

      it('sets the action payload as the state', () => {
        expect(state)
          .toEqual(phoneNumber);
      });
    });
  });
});
