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
      count: 0
    };

    describe('initial state', () => {
      it('is set to an expected object', () => {
        expect(initialState)
          .toEqual(mockInitialState);
      });
    });

    describe('when a SDK_CHAT_MSG action is dispatched', () => {
      let payload;

      beforeEach(() => {
        payload = {
          detail: {
            nick: '123',
            display_name: 'Terence',
            msg: 'Hello there!'
          }
        };

        const action = { type: actionTypes.SDK_CHAT_MSG, payload };

        state = reducer(initialState, action);
      });

      it('updates the state with payload', () => {
        const { nick, display_name, msg } = payload.detail;
        const expected = _.merge(
          {},
          mockInitialState,
          { nick, display_name, msg },
          { show: true }
        );

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
        const expected = _.merge({}, mockInitialState, { show: false });

        expect(state)
          .toEqual(expected);
      });
    });

    describe('when a NEW_AGENT_MESSAGE_RECEIVED action is dispatched', () => {
      beforeEach(() => {
        const action = { type: actionTypes.NEW_AGENT_MESSAGE_RECEIVED };

        state = reducer(initialState, action);
      });

      it('updates the state with payload', () => {
        const expected = _.merge({}, mockInitialState, { count: 1 });

        expect(state)
          .toEqual(expected);
      });
    });

    describe('when a CHAT_OPENED action is dispatched', () => {
      beforeEach(() => {
        const action = { type: actionTypes.CHAT_OPENED };

        initialState.count = 1;

        state = reducer(initialState, action);
      });

      it('resets the state for count to 0', () => {
        const expected = _.merge({}, mockInitialState, { count: 0 });

        expect(state)
          .toEqual(expected);
      });
    });
  });
});
