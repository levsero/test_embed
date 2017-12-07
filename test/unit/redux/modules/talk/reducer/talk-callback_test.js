describe('talk reducer callback', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/talk/reducer/talk-callback');
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
      it('callback is set to falsy values', () => {
        expect(initialState)
          .toEqual({
            isSending: false,
            error: {},
            phoneNumber: ''
          });
      });
    });

    describe('when a TALK_CALLBACK_REQUEST action is dispatched', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.TALK_CALLBACK_REQUEST,
          payload: {
            phone: '+61412345678'
          }
        });
      });

      it('sets the action payload as the state', () => {
        expect(state)
          .toEqual({
            isSending: true,
            error: {},
            phoneNumber: '+61412345678'
          });
      });
    });

    describe('when a TALK_CALLBACK_SUCCESS action is dispatched', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.TALK_CALLBACK_SUCCESS,
          payload: {
            phone: '+61412345678'
          }
        });
      });

      it('sets the action payload as the state', () => {
        expect(state)
          .toEqual({
            isSending: false,
            error: {},
            phoneNumber: '+61412345678'
          });
      });
    });

    describe('when a TALK_CALLBACK_FAILURE action is dispatched', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.TALK_CALLBACK_FAILURE,
          payload: { 'error': 'Keyword is required.' }
        });
      });

      it('sets the action payload as the state', () => {
        expect(state)
          .toEqual({
            isSending: false,
            error: { 'error': 'Keyword is required.' },
            phoneNumber: ''
          });
      });
    });
  });
});
