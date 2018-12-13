describe('base reducer web widget visibility', () => {
  let reducer,
    state,
    actionTypes,
    zopimActionTypes,
    chatActionTypes,
    initialState,
    mockIsPopout = false;

  const actionTypesPath = buildSrcPath('redux/modules/base/base-action-types');
  const zopimActionTypesPath = buildSrcPath('redux/modules/zopimChat/zopimChat-action-types');
  const chatActionTypesPath = buildSrcPath('redux/modules/chat/chat-action-types');

  actionTypes = requireUncached(actionTypesPath);
  zopimActionTypes = requireUncached(zopimActionTypesPath);
  chatActionTypes = requireUncached(chatActionTypesPath);

  const falseReturns = [
    actionTypes.CLOSE_BUTTON_CLICKED,
    zopimActionTypes.ZOPIM_HIDE,
    actionTypes.LEGACY_SHOW_RECEIVED,
    actionTypes.CANCEL_BUTTON_CLICKED,
    zopimActionTypes.ZOPIM_ON_CLOSE,
    chatActionTypes.PROACTIVE_CHAT_NOTIFICATION_DISMISSED,
    actionTypes.CLOSE_RECEIVED
  ];

  const trueReturns = [
    actionTypes.LAUNCHER_CLICKED,
    actionTypes.CHAT_BADGE_CLICKED,
    actionTypes.ACTIVATE_RECEIVED,
    chatActionTypes.PROACTIVE_CHAT_RECEIVED,
    chatActionTypes.CHAT_WINDOW_OPEN_ON_NAVIGATE,
    actionTypes.OPEN_RECEIVED,
    zopimActionTypes.ZOPIM_CHAT_GONE_OFFLINE
  ];

  beforeEach(() => {
    initMockRegistry({
      'utility/globals': {
        isPopout: () => mockIsPopout
      }
    });

    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/base/reducer/web-widget-visibility');

    reducer = requireUncached(reducerPath).default;

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

  describe('expected false returns', () => {
    falseReturns.forEach((element) => {
      describe(`when ${element} action is recieved`, () => {
        beforeEach(() => {
          state = reducer(undefined,{
            type: element
          });
        });

        it('returns false', () => {
          expect(state).toEqual(false);
        });
      });
    });
  });

  describe('expected true returns', () => {
    trueReturns.forEach((element) => {
      describe(`when ${element} action is recieved`, () => {
        beforeEach(() => {
          state = reducer(undefined, {
            type: element
          });
        });

        it('returns true', () => {
          expect(state).toEqual(true);
        });
      });
    });
  });

  describe('when action is TOGGLE_RECEIVED', () => {
    describe('when the state is set to true', () => {
      beforeEach(() => {
        state = reducer(true, {
          type: actionTypes.TOGGLE_RECEIVED
        });
      });

      it('inverts the state', () => {
        expect(state)
          .toEqual(false);
      });
    });

    describe('when the state is set to false', () => {
      beforeEach(() => {
        state = reducer(false, {
          type: actionTypes.TOGGLE_RECEIVED
        });
      });

      it('inverts the state', () => {
        expect(state)
          .toEqual(true);
      });
    });
  });

  describe('when a WIDGET_INITIALISED action is dispatched', () => {
    let mockState;

    beforeEach(() => {
      state = reducer(mockState, { type: actionTypes.WIDGET_INITIALISED });
    });

    describe('when the window is a popout', () => {
      beforeAll(() => {
        mockIsPopout = true;
        mockState = false;
      });

      it('return true', () => {
        expect(state).toEqual(true);
      });
    });

    describe('when the window is not a popout', () => {
      beforeAll(() => {
        mockIsPopout = false;
        mockState = true;
      });

      it('return false', () => {
        expect(state).toEqual(false);
      });
    });
  });
});
