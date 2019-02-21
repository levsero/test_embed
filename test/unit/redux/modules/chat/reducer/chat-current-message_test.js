describe('chat reducer currentMessage', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-current-message');
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
      it('is set to an empty string', () => {
        expect(initialState)
          .toEqual('');
      });
    });

    describe('when a CHAT_BOX_CHANGED action is dispatched', () => {
      let payload;

      beforeEach(() => {
        payload = 'im typing here';

        state = reducer(initialState, {
          type: actionTypes.CHAT_BOX_CHANGED,
          payload: payload
        });
      });

      it('updates the state with payload', () => {
        expect(state)
          .toEqual(payload);
      });
    });

    describe('when a CHAT_BADGE_MESSAGE_CHANGED action is dispatched', () => {
      let payload;

      beforeEach(() => {
        payload = 'im typing here';

        state = reducer(initialState, {
          type: actionTypes.CHAT_BADGE_MESSAGE_CHANGED,
          payload: payload
        });
      });

      it('updates the state with payload', () => {
        expect(state)
          .toEqual(payload);
      });
    });

    describe('when a PRE_CHAT_FORM_ON_CHANGE action is dispatched', () => {
      let payload;

      beforeEach(() => {
        payload = {
          message: 'im typing here',
          name: 'some_name',
          email: 'yeah@yeah.com'
        };

        state = reducer(initialState, {
          type: actionTypes.PRE_CHAT_FORM_ON_CHANGE,
          payload: payload
        });
      });

      it('updates the state with payload', () => {
        expect(state)
          .toEqual(payload.message);
      });
    });

    describe('when a RESET_CURRENT_MESSAGE action is dispatched', () => {
      let payload;

      beforeEach(() => {
        state = reducer('yolo', {
          type: actionTypes.RESET_CURRENT_MESSAGE,
          payload: payload
        });
      });

      it('updates the state with payload', () => {
        expect(state)
          .toEqual('');
      });
    });
  });
});
