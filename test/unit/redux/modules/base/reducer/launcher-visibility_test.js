describe('base reducer launcher visibility', () => {
  let reducer,
    state,
    initialState,
    actionTypes,
    zopimActionTypes,
    chatActionTypes,
    falseReturns,
    trueReturns,
    variableReturns,
    mockIsMobileBrowser = false,
    mockIsPopout = false;

  const reducerPath = buildSrcPath('redux/modules/base/reducer/launcher-visibility');
  const zopimActionTypesPath = buildSrcPath('redux/modules/zopimChat/zopimChat-action-types');
  const chatActionTypesPath = buildSrcPath('redux/modules/chat/chat-action-types');
  const actionTypesPath = buildSrcPath('redux/modules/base/base-action-types');

  actionTypes = requireUncached(actionTypesPath);
  zopimActionTypes = requireUncached(zopimActionTypesPath);
  chatActionTypes = requireUncached(chatActionTypesPath);

  falseReturns = [
    actionTypes.LAUNCHER_CLICKED,
    actionTypes.CHAT_BADGE_CLICKED,
    actionTypes.ACTIVATE_RECEIVED,
    chatActionTypes.PROACTIVE_CHAT_RECEIVED,
    chatActionTypes.CHAT_WINDOW_OPEN_ON_NAVIGATE,
    actionTypes.OPEN_RECEIVED
  ];

  trueReturns = [
    actionTypes.CLOSE_BUTTON_CLICKED,
    zopimActionTypes.ZOPIM_HIDE,
    actionTypes.LEGACY_SHOW_RECEIVED,
    actionTypes.CANCEL_BUTTON_CLICKED,
    zopimActionTypes.ZOPIM_ON_CLOSE,
    chatActionTypes.PROACTIVE_CHAT_NOTIFICATION_DISMISSED,
    actionTypes.CLOSE_RECEIVED,
    chatActionTypes.CHAT_BANNED,
    actionTypes.POPOUT_BUTTON_CLICKED
  ];

  variableReturns = [
    zopimActionTypes.ZOPIM_SHOW,
    actionTypes.NEXT_BUTTON_CLICKED
  ];

  beforeAll(() => {
    mockery.enable();

    initMockRegistry({
      'utility/devices': {
        isMobileBrowser: () => mockIsMobileBrowser
      },
      'utility/globals': {
        isPopout: () => mockIsPopout
      }
    });

    reducer = requireUncached(reducerPath).default;

    initialState = reducer(undefined, {
      type: ''
    });
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('initial state', () => {
    it('is set to true', () => {
      expect(initialState)
        .toEqual(true);
    });
  });

  describe('expected false returns', () => {
    falseReturns.forEach((element) => {
      describe(`when ${element} is passed`, () => {
        beforeEach(() => {
          state = reducer(undefined,{
            type: element
          });
        });

        it(`testing: ${element}`, () => {
          expect(state).toEqual(false);
        });
      });
    });
  });

  describe('expected true returns', () => {
    trueReturns.forEach((element) => {
      describe(`when ${element} is passed`, () => {
        beforeEach(() => {
          state = reducer(undefined, {
            type: element
          });
        });

        it(`testing: ${element}`, () => {
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
        mockState = true;
      });

      it('return false', () => {
        expect(state).toEqual(false);
      });
    });

    describe('when the window is not a popout', () => {
      beforeAll(() => {
        mockIsPopout = false;
        mockState = false;
      });

      it('return true', () => {
        expect(state).toEqual(true);
      });
    });
  });

  describe('When platform is Mobile', () => {
    variableReturns.forEach((element) => {
      describe(`when an ${element} action is dispatched`, () => {
        beforeEach(() => {
          mockIsMobileBrowser = true;
          state = reducer(undefined, {
            type: element
          });
        });

        it('is set to true', () => {
          expect(state)
            .toEqual(true);
        });
      });
    });
  });

  describe('When platform is Desktop', () => {
    variableReturns.forEach((element) => {
      describe(`when an ${element} action is dispatched`, () => {
        beforeEach(() => {
          mockIsMobileBrowser = false;
          state = reducer(undefined, {
            type: element
          });
        });

        it('is set to false', () => {
          expect(state)
            .toEqual(false);
        });
      });
    });
  });
});
