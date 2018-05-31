describe('analytics middleware', () => {
  let trackAnalytics,
    GASpy;
  const UPDATE_ACTIVE_EMBED = 'widget/base/UPDATE_ACTIVE_EMBED';

  beforeEach(() => {
    const blipPath = buildSrcPath('redux/middleware/analytics');

    GASpy = jasmine.createSpyObj('GA', ['track']);

    mockery.enable();
    initMockRegistry({
      'service/analytics/googleAnalytics': {
        GA: GASpy
      },
      'src/redux/modules/chat/chat-selectors': {
        getIsChatting: (prevState) => prevState.isChatting
      },
      'src/redux/modules/base/base-action-types': {
        UPDATE_ACTIVE_EMBED: UPDATE_ACTIVE_EMBED
      }
    });

    trackAnalytics = requireUncached(blipPath).trackAnalytics;
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('trackAnalytics', () => {
    let action,
      nextSpy;

    describe('next', () => {
      beforeEach(() => {
        const flatState = {};

        nextSpy = jasmine.createSpy('nextSpy');
        action = { type: 'random_type'};
        trackAnalytics({ getState: () => flatState })(nextSpy)(action);
      });

      it('calls next function', () => {
        expect(nextSpy)
          .toHaveBeenCalledWith({ type: 'random_type'});
      });
    });

    describe('action has type UPDATE_ACTIVE_EMBED', () => {
      let flatState,
        mockIsChatting,
        payload;

      beforeEach(() => {
        flatState = {
          isChatting: mockIsChatting
        };

        GASpy.track.calls.reset();
        nextSpy = jasmine.createSpy('nextSpy');

        action = {
          type: UPDATE_ACTIVE_EMBED,
          payload
        };
        trackAnalytics({ getState: () => flatState })(nextSpy)(action);
      });

      describe('when chatting', () => {
        beforeAll(() => {
          mockIsChatting = true;
        });

        it('does not call GA.track', () => {
          expect(GASpy.track)
            .not
            .toHaveBeenCalled();
        });
      });

      describe('when not chatting', () => {
        beforeAll(() => {
          mockIsChatting = false;
        });

        describe('payload is not chat', () => {
          beforeAll(() => {
            payload = 'zopimChat';
          });

          it('does not call GA.track', () => {
            expect(GASpy.track)
              .not
              .toHaveBeenCalled();
          });
        });

        describe('payload is chat', () => {
          beforeAll(() => {
            payload = 'chat';
          });

          it('calls GA.track with the correct name', () => {
            expect(GASpy.track)
              .toHaveBeenCalledWith('Chat Opened');
          });
        });
      });
    });
  });
});
