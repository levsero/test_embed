describe('chat reducer screens', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    initMockRegistry({
      '../chat-screen-types': {
        CHATTING_SCREEN: 'chatting_screen'
      }
    });

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-screen');
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

    describe('initial state', () => {
      it('is set to the chatting screen', () => {
        expect(initialState)
          .toEqual('chatting_screen');
      });
    });

    describe('when a UPDATE_CHAT_SCREEN action is dispatched', () => {
      let payload;

      beforeEach(() => {
        payload = { screen: 'prechat_screen' };

        state = reducer(initialState, {
          type: actionTypes.UPDATE_CHAT_SCREEN,
          payload: payload
        });
      });

      it('updates the state with the payload', () => {
        expect(state)
          .toEqual('prechat_screen');
      });
    });

    describe('when a UPDATE_PREVIEWER_SCREEN action is dispatched', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.UPDATE_PREVIEWER_SCREEN,
          payload: { screen: 'prechat_screen' }
        });
      });

      it('updates the state with the payload', () => {
        expect(state)
          .toEqual('prechat_screen');
      });
    });

    describe('when a CHAT_NOTIFICATION_RESPONDED action is dispatched', () => {
      beforeEach(() => {
        state = reducer('prechat_screen', {
          type: actionTypes.CHAT_NOTIFICATION_RESPONDED
        });
      });

      it('sets the state to chatting screen', () => {
        expect(state)
          .toEqual('chatting_screen');
      });
    });

    describe('when a PRE_CHAT_FORM_SUBMIT action is dispatched', () => {
      beforeEach(() => {
        state = reducer('prechat_screen', {
          type: actionTypes.PRE_CHAT_FORM_SUBMIT
        });
      });

      it('sets the state to chatting screen', () => {
        expect(state)
          .toEqual('chatting_screen');
      });
    });

    describe('when a SDK_CHAT_MEMBER_JOIN action is dispatched', () => {
      beforeEach(() => {
        state = reducer('prechat_screen', {
          type: actionTypes.SDK_CHAT_MEMBER_JOIN
        });
      });

      it('sets the state to chatting screen', () => {
        expect(state)
          .toEqual('chatting_screen');
      });
    });
  });
});
