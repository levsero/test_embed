describe('analytics middleware', () => {
  let trackAnalytics,
    GASpy,
    loadtime;
  const UPDATE_ACTIVE_EMBED = 'widget/base/UPDATE_ACTIVE_EMBED';
  const SDK_CHAT_MEMBER_JOIN = 'widget/chat/SDK_CHAT_MEMBER_JOIN';

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
        UPDATE_ACTIVE_EMBED
      },
      'src/redux/modules/chat/chat-action-types': {
        SDK_CHAT_MEMBER_JOIN,
      }
    });

    loadtime = Date.now();
    trackAnalytics = requireUncached(blipPath).trackAnalytics;
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('trackAnalytics', () => {
    let action,
      nextSpy;

    afterEach(() => {
      GASpy.track.calls.reset();
    });

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

        action = {
          type: UPDATE_ACTIVE_EMBED,
          payload
        };
        trackAnalytics({ getState: () => flatState })(noop)(action);
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

    describe('action has type SDK_CHAT_MEMBER_JOIN', () => {
      let nick,
        timestamp;

      beforeEach(() => {
        const payload = {
          detail: {
            nick,
            timestamp,
            display_name: 'Bob Ross' // eslint-disable-line camelcase
          }
        };

        action = {
          type: SDK_CHAT_MEMBER_JOIN,
          payload
        };
        trackAnalytics({ getState: () => {} })(noop)(action);
      });

      describe('when payload is not from an agent', () => {
        beforeAll(() => {
          nick = 'visitor:234';
        });

        it('does not call GA.track', () => {
          expect(GASpy.track)
            .not
            .toHaveBeenCalled();
        });
      });

      describe('when payload is from an agent', () => {
        beforeAll(() => {
          nick = 'agent:123';
        });

        describe('when payload is recieved after initialization', () => {
          beforeAll(() => {
            timestamp = loadtime + 10000;
          });

          it('calls GA.track with the correct params', () => {
            expect(GASpy.track)
              .toHaveBeenCalledWith('Chat Served by Operator', 'Bob Ross');
          });
        });

        describe('when payload is recieved before initialization', () => {
          beforeAll(() => {
            timestamp = loadtime - 10000;
          });

          it('does not call GA.track', () => {
            expect(GASpy.track)
              .not
              .toHaveBeenCalled();
          });
        });
      });
    });
  });
});
