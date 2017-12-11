describe('blip middleware', () => {
  let sendBlips,
    beaconSpy,
    i18nSpy;
  const TALK_CALLBACK_SUCCESS = 'widget/talk/TALK_CALLBACK_SUCCESS';
  const UPDATE_ACTIVE_EMBED = 'widget/base/UPDATE_ACTIVE_EMBED';

  beforeEach(() => {
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
      },
      'src/redux/modules/base/base-action-types': {
        UPDATE_ACTIVE_EMBED: UPDATE_ACTIVE_EMBED
      }
    });

    sendBlips = requireUncached(blipPath).sendBlips;
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('sendBlips', () => {
    let action,
      nextSpy;

    describe('next', () => {
      beforeEach(() => {
        const flatState = {};

        nextSpy = jasmine.createSpy('nextSpy');
        action = { type: 'random_type'};
        sendBlips({ getState: () => flatState })(nextSpy)(action);
      });

      it('calls next function', () => {
        expect(nextSpy)
          .toHaveBeenCalledWith({ type: 'random_type'});
      });
    });

    describe('action has type TALK_CALLBACK_SUCCESS', () => {
      beforeEach(() => {
        beaconSpy.trackUserAction.calls.reset();
        action = { type: TALK_CALLBACK_SUCCESS };
        nextSpy = jasmine.createSpy('nextSpy');
        const flatState = {
          phone: '+61430919721',
          name: 'Johnny',
          email: 'Johnny@john.com',
          description: 'Please help me.',
          keywords: ['Support'],
          groupName: 'Support',
          supportedCountries: '1, 10, 9, 89',
          averageWaitTime: 10,
          agentAvailability: true
        };

        sendBlips({ getState: () => flatState })(nextSpy)(action);
      });
    });

    describe('action has type UPDATE_ACTIVE_EMBED', () => {
      let flatState;

      beforeEach(() => {
        flatState = {
          phoneNumber: '+61430919721',
          keywords: ['Support'],
          groupName: 'Support',
          supportedCountries: '1, 10, 9, 89',
          averageWaitTime: 10,
          agentAvailability: true
        };

        beaconSpy.trackUserAction.calls.reset();
        nextSpy = jasmine.createSpy('nextSpy');
      });

      describe('payload is talk', () => {
        beforeEach(() => {
          action = {
            type: UPDATE_ACTIVE_EMBED,
            payload: 'talk'
          };
          sendBlips({ getState: () => flatState })(nextSpy)(action);
        });

        it('calls trackUserAction with the correct params', () => {
          const expectedValue = {
            supportedCountries: '1, 10, 9, 89',
            groupName: 'Support',
            keywords: ['Support'],
            phoneNumber: '+61430919721',
            averageWaitTime: 10,
            agentAvailability: true,
            locale: 'US'
          };

          expect(beaconSpy.trackUserAction)
            .toHaveBeenCalledWith('talk', 'opened', 'phoneNumber', expectedValue);
        });
      });

      describe('payload is not talk', () => {
        beforeEach(() => {
          action = {
            type: UPDATE_ACTIVE_EMBED,
            payload: 'chat'
          };
          sendBlips({ getState: () => flatState })(nextSpy)(action);
        });

        it('does not call trackUserAction', () => {
          expect(beaconSpy.trackUserAction)
            .not.toHaveBeenCalled();
        });
      });
    });

    describe('action does not have any relevant action type', () => {
      beforeEach(() => {
        beaconSpy.trackUserAction.calls.reset();
        action = { type: 'random_type' };
        sendBlips({ getState: () => ({}) })(nextSpy)(action);
      });

      it('does not call trackUserAction', () => {
        expect(beaconSpy.trackUserAction)
          .not.toHaveBeenCalled();
      });
    });
  });
});
