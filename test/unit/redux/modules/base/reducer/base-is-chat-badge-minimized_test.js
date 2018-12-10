describe('base reducer isChatBadgeMinimized', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/base/reducer/base-is-chat-badge-minimized');
    const actionTypesPath = buildSrcPath('redux/modules/base/base-action-types');

    initMockRegistry({
      'src/redux/modules/chat/chat-action-types': {
        CHAT_MSG_REQUEST_SUCCESS: 'CHAT_MSG_REQUEST_SUCCESS'
      }
    });

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

  describe('when an CHAT_BADGE_MINIMIZED action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.CHAT_BADGE_MINIMIZED
      });
    });

    it('sets state to true', () => {
      expect(state)
        .toEqual(true);
    });
  });

  describe('when an CHAT_MSG_REQUEST_SUCCESS action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: 'CHAT_MSG_REQUEST_SUCCESS'
      });
    });

    it('sets state to true', () => {
      expect(state)
        .toEqual(true);
    });
  });

  describe('when an BADGE_HIDE_RECEIVED action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.BADGE_HIDE_RECEIVED
      });
    });

    it('sets state to true', () => {
      expect(state)
        .toEqual(true);
    });
  });

  describe('when an BADGE_SHOW_RECEIVED action is dispatched', () => {
    let state;

    beforeEach(() => {
      state = reducer(true, {
        type: actionTypes.BADGE_SHOW_RECEIVED
      });
    });

    it('sets state to false', () => {
      expect(state)
        .toEqual(false);
    });
  });
});
