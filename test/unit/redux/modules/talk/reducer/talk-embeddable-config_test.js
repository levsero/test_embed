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
            enabled: false,
            nickname: '',
            phoneNumber: '',
            supportedCountries: [],
            connected: false
          });
      });
    });

    describe('when an TALK_DISCONNECT_SOCKET_EVENT action is received', () => {
      beforeEach(() => {
        state = reducer({ enabled: true }, {
          type: actionTypes.TALK_DISCONNECT_SOCKET_EVENT
        });
      });

      it('sets the enabled state to false', () => {
        expect(state.enabled)
          .toEqual(false);
      });
    });

    describe('when an TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT action is received', () => {
      let config,
        expected;

      beforeEach(() => {
        config = {
          averageWaitTimeSetting: null,
          capability: '0',
          enabled: true,
          nickname: 'nickname',
          phoneNumber: '+61412345678',
          supportedCountries: 'CA,ID'
        };
      });

      describe('when the capability is callback form', () => {
        beforeEach(() => {
          expected = {
            ...config,
            supportedCountries: ['CA', 'ID'],
            capability: capabilityTypes.CALLBACK_ONLY,
            enabled: true,
            connected: true
          };

          state = reducer(initialState, {
            type: actionTypes.TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT,
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
          expected = {
            ...config,
            supportedCountries: ['CA', 'ID'],
            capability: capabilityTypes.PHONE_ONLY,
            enabled: true,
            connected: true
          };

          state = reducer(initialState, {
            type: actionTypes.TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT,
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
          expected = {
            ...config,
            supportedCountries: ['CA', 'ID'],
            capability: capabilityTypes.CALLBACK_AND_PHONE,
            enabled: true,
            connected: true
          };

          state = reducer(initialState, {
            type: actionTypes.TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT,
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
