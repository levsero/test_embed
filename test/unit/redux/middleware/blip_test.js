describe('blip middleware', () => {
  let sendBlips,
    beaconSpy,
    i18nSpy;
  const TALK_CALLBACK_SUCCESS = 'widget/talk/TALK_CALLBACK_SUCCESS';

  beforeAll(() => {
    const blipPath = buildSrcPath('redux/middleware/blip');

    beaconSpy = jasmine.createSpyObj('beacon', ['trackUserAction']);
    i18nSpy = jasmine.createSpyObj('i18n', ['getLocale']);
    i18nSpy.getLocale.and.callFake(() => 'US');

    mockery.enable();
    initMockRegistry({
      'service/beacon': {
        beacon: beaconSpy
      },
      'service/i18n': {
        i18n: i18nSpy
      },
      'src/redux/modules/talk/talk-selectors': {
        getEmbeddableConfig: _.identity,
        getAgentAvailability: (prevState) => prevState.agentAvailability,
        getFormState: _.identity,
        getAverageWaitTime: (prevState) => prevState.averageWaitTime
      },
      'src/redux/modules/talk/talk-action-types': {
        TALK_CALLBACK_SUCCESS: TALK_CALLBACK_SUCCESS
      }
    });
    sendBlips = requireUncached(blipPath).sendBlips;
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('sendTalkCallbackRequestBlip', () => {
    let action,
      nextSpy;

    beforeAll(() => {
      nextSpy = jasmine.createSpy('nextSpy');
    });

    describe('action has type TALK_CALLBACK_SUCCESS', () => {
      beforeAll(() => {
        beaconSpy.trackUserAction.calls.reset();
        action = { type: TALK_CALLBACK_SUCCESS };

        const flatState = {
          phone: '+61430919721',
          name: 'Johnny',
          email: 'Johnny@john.com',
          description: 'Please help me.',
          keywords: ['Support'],
          groupName: 'Support',
          supportedCountries: [1, 10, 9, 89],
          averageWaitTime: 10,
          agentAvailability: true
        };

        sendBlips({ getState: () => flatState })(nextSpy)(action);
      });

      it('calls trackUserAction with the correct params', () => {
        const expectedValue = {
          supportedCountries: [1, 10, 9, 89],
          groupName: 'Support',
          keywords: ['Support'],
          phoneNumber: '+61430919721',
          averageWaitTime: 10,
          agentAvailability: true,
          user: {
            name: 'Johnny',
            email: 'Johnny@john.com',
            description: 'Please help me.'
          },
          locale: 'US'
        };

        expect(beaconSpy.trackUserAction)
          .toHaveBeenCalledWith('talk', 'request', 'callbackForm', expectedValue);
      });

      it('calls next function', () => {
        expect(nextSpy)
         .toHaveBeenCalledWith({ type: 'widget/talk/TALK_CALLBACK_SUCCESS'});
      });
    });

    describe('action does not have type TALK_CALLBACK_SUCCESS ', () => {
      beforeAll(() => {
        beaconSpy.trackUserAction.calls.reset();
        action = { type: 'random_type' };
        sendBlips({ getState: () => ({}) })(nextSpy)(action);
      });

      it('does not call trackUserAction', () => {
        expect(beaconSpy.trackUserAction)
         .not.toHaveBeenCalled();
      });

      it('calls next function', () => {
        expect(nextSpy)
         .toHaveBeenCalledWith({ type: 'random_type'});
      });
    });
  });
});
