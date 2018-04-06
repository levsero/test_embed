describe('chat reducer: operatingHours', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-operating-hours');
    const actionTypesPath = buildSrcPath('redux/modules/chat/chat-action-types');

    reducer = requireUncached(reducerPath).default;
    actionTypes = requireUncached(actionTypesPath);

    initialState = reducer(undefined, { type: '' });
  });

  describe('reducer', () => {
    let state;

    describe('initial state', () => {
      it('is set to null', () => {
        expect(initialState)
          .toBeNull();
      });
    });

    describe('when a GET_OPERATING_HOURS_REQUEST_SUCCESS action is dispatched', () => {
      let payload;

      beforeEach(() => {
        payload = { account_schedule: [[456]] };

        state = reducer(initialState, {
          type: actionTypes.GET_OPERATING_HOURS_REQUEST_SUCCESS,
          payload: payload
        });
      });

      it('updates the state with payload', () => {
        expect(state)
          .toEqual(payload);
      });
    });
  });
});
