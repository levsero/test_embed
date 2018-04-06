describe('chat reducer notification', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-notification');
    const actionTypesPath = buildSrcPath('redux/modules/chat/chat-action-types');

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
    const mockInitialState = {
      nick: '',
      display_name: '',
      msg: '',
      show: false,
      count: 0,
      proactive: false
    };

    describe('initial state', () => {
      it('is set to an expected object', () => {
        expect(initialState)
          .toEqual(mockInitialState);
      });
    });

    describe('when a NEW_AGENT_MESSAGE_RECEIVED action is dispatched', () => {
      let payload;

      beforeEach(() => {
        payload = {
          nick: '123',
          display_name: 'Terence',
          msg: 'Hello there!',
          proactive: true
        };

        const action = { type: actionTypes.NEW_AGENT_MESSAGE_RECEIVED, payload };

        state = reducer(initialState, action);
      });

      it('updates the state with payload', () => {
        const { nick, display_name, msg } = payload;
        const expected = {
          ...mockInitialState,
          nick,
          display_name,
          msg,
          show: true,
          proactive: true,
          count: 1
        };

        expect(state)
          .toEqual(expected);
      });
    });

    describe('when a CHAT_NOTIFICATION_DISMISSED action is dispatched', () => {
      beforeEach(() => {
        const action = { type: actionTypes.CHAT_NOTIFICATION_DISMISSED };

        state = reducer(initialState, action);
      });

      it('updates the state with payload', () => {
        expect(state.show)
          .toEqual(false);
      });
    });

    describe('when a CHAT_OPENED action is dispatched', () => {
      beforeEach(() => {
        const action = { type: actionTypes.CHAT_OPENED };

        initialState.count = 1;

        state = reducer(initialState, action);
      });

      it('resets the state for count to 0', () => {
        expect(state.count)
          .toEqual(0);
      });
    });
  });
});
