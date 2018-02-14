describe('onStateChange middleware', () => {
  let stateChangeFn,
    mockUserSoundSetting,
    mockActiveEmbed,
    mockwidgetShown;
  const getAccountSettingsSpy = jasmine.createSpy('updateAccountSettings');
  const newAgentMessageReceivedSpy = jasmine.createSpy('newAgentMessageReceived');
  const audioPlaySpy = jasmine.createSpy('audioPlay');

  beforeAll(() => {
    mockery.enable();

    const path = buildSrcPath('redux/middleware/onStateChange');

    mockUserSoundSetting = false;
    mockActiveEmbed = '';
    mockwidgetShown = false;

    initMockRegistry({
      'src/redux/modules/chat': {
        getAccountSettings: getAccountSettingsSpy,
        newAgentMessageReceived: newAgentMessageReceivedSpy
      },
      'service/audio': {
        audio: {
          play: audioPlaySpy
        }
      },
      'src/redux/modules/chat/chat-selectors': {
        getUserSoundSettings: () => mockUserSoundSetting,
        getConnection: _.identity,
        getChatMessagesByAgent: _.identity
      },
      'src/redux/modules/base/base-selectors': {
        getActiveEmbed: () => mockActiveEmbed,
        getWidgetShown: () => mockwidgetShown
      }
    });

    stateChangeFn = requireUncached(path).default;
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('onStateChange', () => {
    describe('onChatConnected', () => {
      const connectingState = 'connecting';
      const connectedState = 'connected';
      const dispatchSpy = jasmine.createSpy('dispatch').and.callThrough();

      describe('when chat has not connected', () => {
        beforeEach(() => {
          stateChangeFn(connectingState, connectingState, {}, dispatchSpy);
        });

        it('does not dispatch the getAccountSettings action', () => {
          expect(getAccountSettingsSpy)
            .not.toHaveBeenCalled();
        });
      });

      describe('when chat has connected', () => {
        beforeEach(() => {
          stateChangeFn(connectingState, connectedState, {}, dispatchSpy);
        });

        it('dispatches the getAccountSettings action', () => {
          expect(getAccountSettingsSpy)
            .toHaveBeenCalled();
        });
      });
    });

    describe('onNewChatMessage', () => {
      const prevState = [{ nick: 'agent' }];
      const nextState = [{ nick: 'agent' }, { nick: 'agent' }];
      const dispatchSpy = jasmine.createSpy('dispatch').and.callThrough();

      describe('when there are no new messages', () => {
        describe('when audio settings are on', () => {
          beforeEach(() => {
            mockUserSoundSetting = true;

            stateChangeFn(prevState, prevState);
          });

          it('does not call sound', () => {
            expect(audioPlaySpy)
              .not.toHaveBeenCalled();
          });

          it('does not dispatch newAgentMessageReceived', () => {
            expect(newAgentMessageReceivedSpy)
              .not.toHaveBeenCalled();
          });
        });
      });

      describe('when there are new messages', () => {
        describe('when audio settings are off', () => {
          beforeEach(() => {
            mockUserSoundSetting = false;

            stateChangeFn(prevState, nextState, {}, dispatchSpy);
          });

          it('does not call sound', () => {
            expect(audioPlaySpy)
              .not.toHaveBeenCalled();
          });
        });

        describe('when audio settings are on', () => {
          beforeEach(() => {
            mockUserSoundSetting = true;

            stateChangeFn(prevState, nextState, {}, dispatchSpy);
          });

          it('calls sound', () => {
            expect(audioPlaySpy)
              .toHaveBeenCalled();
          });
        });

        describe('when the embed is not shown', () => {
          beforeEach(() => {
            mockwidgetShown = false;

            stateChangeFn(prevState, nextState, {}, dispatchSpy);
          });

          it('dispatches newAgentMessageReceived', () => {
            expect(newAgentMessageReceivedSpy)
              .toHaveBeenCalled();
          });
        });

        describe('when the embed is shown and the active embed is not chat', () => {
          beforeEach(() => {
            mockwidgetShown = true;
            mockActiveEmbed = 'helpCenterForm';

            stateChangeFn(prevState, nextState, {}, dispatchSpy);
          });

          it('dispatches newAgentMessageReceived', () => {
            expect(newAgentMessageReceivedSpy)
              .toHaveBeenCalled();
          });
        });

        describe('when the embed is shown and the active embed is chat', () => {
          beforeEach(() => {
            mockwidgetShown = true;
            mockActiveEmbed = 'chat';
            newAgentMessageReceivedSpy.calls.reset();

            stateChangeFn(prevState, nextState, {}, dispatchSpy);
          });

          it('does not dispatch newAgentMessageReceived', () => {
            expect(newAgentMessageReceivedSpy)
              .not.toHaveBeenCalled();
          });
        });
      });
    });
  });
});
