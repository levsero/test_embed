describe('talk reducer embeddable-config', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/talk/reducer/talk-embeddable-config');
    const actionTypesPath = buildSrcPath('redux/modules/talk/talk-action-types');

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
      it('config is set to an object with default properties', () => {
        expect(initialState)
          .toEqual({
            averageWaitTimeSetting: null,
            capability: '0',
            enabled: 'false',
            groupName: '',
            keywords: '',
            phoneNumber: ''
          });
      });
    });

    describe('when a TALK_EMBEDDABLE_CONFIG action is dispatched', () => {
      let config;

      beforeEach(() => {
        config = {
          averageWaitTimeSetting: null,
          capability: '0',
          enabled: 'true',
          groupName: 'Support',
          keywords: 'keyword',
          phoneNumber: '+61412345678'
        };

        state = reducer(initialState, {
          type: actionTypes.TALK_EMBEDDABLE_CONFIG,
          payload: config
        });
      });

      it('sets the action payload as the state', () => {
        expect(state)
          .toEqual(config);
      });
    });
  });
});
