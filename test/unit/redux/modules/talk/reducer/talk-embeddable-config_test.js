describe('talk reducer embeddable-config', () => {
  let reducer,
    actionTypes,
    capabilityTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/talk/reducer/talk-embeddable-config');
    const actionTypesPath = buildSrcPath('redux/modules/talk/talk-action-types');
    const capabilityTypesPath = buildSrcPath('redux/modules/talk/talk-capability-types');

    reducer = requireUncached(reducerPath).default;
    actionTypes = requireUncached(actionTypesPath);
    capabilityTypes = requireUncached(capabilityTypesPath);

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
            capability: capabilityTypes.CALLBACK_ONLY,
            enabled: 'false',
            groupName: '',
            keywords: '',
            phoneNumber: '',
            supportedCountries: []
          });
      });
    });

    describe('when an UPDATE_EMBEDDABLE_CONFIG action is dispatched', () => {
      let config,
        expected;

      beforeEach(() => {
        config = {
          averageWaitTimeSetting: null,
          capability: '0',
          enabled: 'true',
          groupName: 'Support',
          keywords: 'keyword',
          phoneNumber: '+61412345678'
        };
      });

      describe('when the capability is callback form', () => {
        beforeEach(() => {
          expected = { ...config, capability: capabilityTypes.CALLBACK_ONLY };

          state = reducer(initialState, {
            type: actionTypes.UPDATE_EMBEDDABLE_CONFIG,
            payload: config
          });
        });

        it('sets the action payload with CALLBACK_ONLY capability as the state', () => {
          expect(state)
            .toEqual(expected);
        });
      });

      describe('when the capability is phone only', () => {
        beforeEach(() => {
          config.capability = '1';
          expected = { ...config, capability: capabilityTypes.PHONE_ONLY };

          state = reducer(initialState, {
            type: actionTypes.UPDATE_EMBEDDABLE_CONFIG,
            payload: config
          });
        });

        it('sets the action payload with PHONE_ONLY capability as the state', () => {
          expect(state)
            .toEqual(expected);
        });
      });

      describe('when the capability is callback form and phone', () => {
        beforeEach(() => {
          config.capability = '2';
          expected = { ...config, capability: capabilityTypes.CALLBACK_AND_PHONE };

          state = reducer(initialState, {
            type: actionTypes.UPDATE_EMBEDDABLE_CONFIG,
            payload: config
          });
        });

        it('sets the action payload with CALLBACK_AND_PHONE capability as the state', () => {
          expect(state)
            .toEqual(expected);
        });
      });
    });
  });
});
