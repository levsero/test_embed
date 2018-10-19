describe('base reducer web widget visibility', () => {
  let reducer,
    state,
    actionTypes,
    zopimActionTypes,
    chatActionTypes,
    initialState;

  const actionTypesPath = buildSrcPath('redux/modules/base/base-action-types');
  const zopimActionTypesPath = buildSrcPath('redux/modules/zopimChat/zopimChat-action-types');
  const chatActionTypesPath = buildSrcPath('redux/modules/chat/chat-action-types');

  actionTypes = requireUncached(actionTypesPath);
  zopimActionTypes = requireUncached(zopimActionTypesPath);
  chatActionTypes = requireUncached(chatActionTypesPath);

  const falseReturns = [
    actionTypes.CLOSE_BUTTON_CLICKED,
    zopimActionTypes.ZOPIM_HIDE,
    actionTypes.LEGACY_SHOW_RECIEVED,
    actionTypes.CANCEL_BUTTON_CLICKED,
    zopimActionTypes.ZOPIM_ON_CLOSE
  ];

  const trueReturns = [
    actionTypes.LAUNCHER_CLICKED,
    actionTypes.ACTIVATE_RECIEVED,
    chatActionTypes.PROACTIVE_CHAT_RECEIVED,
    chatActionTypes.CHAT_WINDOW_OPEN_ON_NAVIGATE,
  ];

  beforeEach(() => {
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
});
