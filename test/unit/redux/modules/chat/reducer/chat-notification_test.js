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
      playSound: false
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

    describe('when a HIDE_CHAT_NOTIFICATION action is dispatched', () => {
      beforeEach(() => {
        const action = { type: actionTypes.HIDE_CHAT_NOTIFICATION };

        state = reducer(initialState, action);
      });

      it('updates the state with payload', () => {
        const expected = _.merge({}, mockInitialState, { show: false });

        expect(state)
          .toEqual(expected);
      });
    });

    describe('when a TOGGLE_CHAT_NOTIFICATION_SOUND action is dispatched', () => {
      let bool;

      beforeEach(() => {
        bool = true;

        const action = {
          type: actionTypes.TOGGLE_CHAT_NOTIFICATION_SOUND,
          payload: bool
        };

        state = reducer(initialState, action);
      });

      it('updates the state with payload', () => {
        const expected = _.merge({}, mockInitialState, { playSound: bool });

        expect(state)
          .toEqual(expected);
      });
    });
  });
});
