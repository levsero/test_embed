describe('chat reducer tags', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/settings/reducer/chat/chat-tags');
    const actionTypesPath = buildSrcPath('redux/modules/settings/settings-action-types');

    reducer = requireUncached(reducerPath).default;

    initialState = reducer(undefined, { type: '' });
    actionTypes = requireUncached(actionTypesPath);
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('initial state', () => {
    it('is set to empty array', () => {
      expect(initialState)
        .toEqual([]);
    });
  });

  describe('when an UPDATE_SETTINGS action is dispatched', () => {
    let someSettings,
      state,
      currentState;

    beforeEach(() => {
      state = reducer(currentState, {
        type: actionTypes.UPDATE_SETTINGS,
        payload: someSettings
      });
    });

    describe('when tags exist', () => {
      beforeAll(() => {
        someSettings = {
          webWidget: {
            chat: {
              tags: ['yolo', 'yolo2']
            }
          }
        };
        currentState = initialState;
      });

      it('set the state to true', () => {
        expect(state)
          .toEqual(['yolo', 'yolo2']);
      });
    });

    describe('when tags do not exist', () => {
      beforeAll(() => {
        someSettings = {
          webWidget: {
            chat: {
              suppress: false
            }
          }
        };
        currentState = ['old', 'tags'];
      });

      it('does not change state', () => {
        expect(state)
          .toEqual(currentState);
      });
    });
  });
});
