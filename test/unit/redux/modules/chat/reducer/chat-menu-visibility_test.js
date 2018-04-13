describe('chat reducer menu visibility', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-menu-visibility');
    const actionTypesPath = buildSrcPath('redux/modules/chat/chat-action-types');

    reducer = requireUncached(reducerPath).default;
    actionTypes = requireUncached(actionTypesPath);

    initialState = reducer(undefined, { type: '' });
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('initial state', () => {
    it('is set to false', () => {
      expect(initialState)
        .toEqual(false);
    });
  });

  describe(`when an UPDATE_CHAT_MENU_VISIBILITY action is dispatched`, () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.UPDATE_CHAT_MENU_VISIBILITY,
        payload: false
      });
    });

    it('sets the action payload as the state', () => {
      expect(state)
        .toEqual(false);
    });
  });

  describe(`when an UPDATE_CHAT_CONTACT_DETAILS_VISIBILITY action is dispatched`, () => {
    let state;

    describe('when the payload is `true`', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.UPDATE_CHAT_CONTACT_DETAILS_VISIBILITY,
          payload: true
        });
      });

      it('sets state to `false`', () => {
        expect(state)
          .toEqual(false);
      });
    });

    describe('when the payload is `false`', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.UPDATE_CHAT_CONTACT_DETAILS_VISIBILITY,
          payload: false
        });
      });

      it('does not effect the state', () => {
        expect(state)
          .toEqual(initialState);
      });
    });
  });

  describe(`when an UPDATE_CHAT_EMAIL_TRANSCRIPT_VISIBILITY action is dispatched`, () => {
    let state;

    describe('when the payload is `true`', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.UPDATE_CHAT_EMAIL_TRANSCRIPT_VISIBILITY,
          payload: true
        });
      });

      it('sets state to `false`', () => {
        expect(state)
          .toEqual(false);
      });
    });

    describe('when the payload is `false`', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.UPDATE_CHAT_EMAIL_TRANSCRIPT_VISIBILITY,
          payload: false
        });
      });

      it('does not effect the state', () => {
        expect(state)
          .toEqual(initialState);
      });
    });
  });
});
