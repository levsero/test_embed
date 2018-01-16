describe('onStateChange middleware', () => {
  let stateChangeFn,
    mockUserSoundSetting;
  const updateAccountSettingsSpy = jasmine.createSpy('updateAccountSettings');
  const audioPlaySpy = jasmine.createSpy('audioPlay');

  beforeAll(() => {
    mockery.enable();

    const path = buildSrcPath('redux/middleware/onStateChange');

    mockUserSoundSetting = false;

    initMockRegistry({
      'src/redux/modules/chat': {
        updateAccountSettings: updateAccountSettingsSpy
      },
      'service/audio': {
        audio: {
          play: audioPlaySpy
        }
      },
      'src/redux/modules/chat/chat-selectors': {
        getUserSoundSettings: () => mockUserSoundSetting,
        getConnection: _.identity,
        getChatsByAgent: _.identity
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

        it('does not dispatch the updateAccountSettings action', () => {
          expect(updateAccountSettingsSpy)
            .not.toHaveBeenCalled();
        });
      });

      describe('when chat has connected', () => {
        beforeEach(() => {
          stateChangeFn(connectingState, connectedState, {}, dispatchSpy);
        });

        it('dispatches the updateAccountSettings action', () => {
          expect(updateAccountSettingsSpy)
            .toHaveBeenCalled();
        });
      });
    });

    describe('onNewChatMessage', () => {
      const prevState = [{ nick: 'agent' }];
      const nextState = [{ nick: 'agent' }, { nick: 'agent' }];

      describe('when audio settings are off', () => {
        beforeEach(() => {
          mockUserSoundSetting = false;

          stateChangeFn(prevState, nextState);
        });

        it('does not call sound', () => {
          expect(audioPlaySpy)
            .not.toHaveBeenCalled();
        });
      });

      describe('when audio settings are on', () => {
        beforeEach(() => {
          mockUserSoundSetting = true;
        });

        describe('when there are no new messages', () => {
          beforeEach(() => {
            stateChangeFn(prevState, prevState);
          });

          it('does not call sound', () => {
            expect(audioPlaySpy)
              .not.toHaveBeenCalled();
          });
        });

        describe('when there are new messages', () => {
          beforeEach(() => {
            stateChangeFn(prevState, nextState);
          });

          it('calls sound', () => {
            expect(audioPlaySpy)
              .toHaveBeenCalled();
          });
        });
      });
    });
  });
});
