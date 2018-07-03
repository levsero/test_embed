describe('talk reducer vendor', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/talk/reducer/talk-vendor');
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
      it('io is set to null', () => {
        expect(initialState.io)
          .toEqual(null);
      });

      it('libphonenumber is set to null', () => {
        expect(initialState.libphonenumber)
          .toEqual(null);
      });
    });

    describe('when a TALK_VENDOR_LOADED action is dispatched', () => {
      let mockIo,
        mockLibPhoneNumber;

      beforeEach(() => {
        mockIo = { io: 'socket.io-client' };
        mockLibPhoneNumber = { libphonenumber: 'libphonenumber-js' };

        state = reducer(initialState, {
          type: actionTypes.TALK_VENDOR_LOADED,
          payload: { io: mockIo, libphonenumber: mockLibPhoneNumber }
        });
      });

      it('sets the action payload as the state', () => {
        expect(state.io)
          .toEqual(mockIo);

        expect(state.libphonenumber)
          .toEqual(mockLibPhoneNumber);
      });
    });
  });
});
