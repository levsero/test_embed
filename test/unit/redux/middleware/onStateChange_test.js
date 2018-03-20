describe('onStateChange middleware', () => {
  let stateChangeFn,
    mockUserSoundSetting,
    mockActiveEmbed,
    mockwidgetShown,
    mockStoreValue;
  const getAccountSettingsSpy = jasmine.createSpy('updateAccountSettings');
  const getIsChattingSpy = jasmine.createSpy('getIsChatting');
  const newAgentMessageReceivedSpy = jasmine.createSpy('newAgentMessageReceived');
  const updateActiveEmbedSpy = jasmine.createSpy('updateActiveEmbed');
  const audioPlaySpy = jasmine.createSpy('audioPlay');
  const broadcastSpy = jasmine.createSpy('broadcast');
  const path = buildSrcPath('redux/middleware/onStateChange');

  beforeAll(() => {
    mockery.enable();

    mockUserSoundSetting = false;
    mockActiveEmbed = '';
    mockwidgetShown = false;
    mockStoreValue = { widgetShown: false };

    initMockRegistry({
      'src/redux/modules/chat': {
        getAccountSettings: getAccountSettingsSpy,
        newAgentMessageReceived: newAgentMessageReceivedSpy,
        getIsChatting: getIsChattingSpy
      },
      'src/redux/modules/base': {
        updateActiveEmbed: updateActiveEmbedSpy
      },
      'service/audio': {
        audio: {
          play: audioPlaySpy
        }
      },
      'service/mediator': {
        mediator: {
          channel: {
            broadcast: broadcastSpy
          }
        }
      },
      'src/redux/modules/chat/chat-selectors': {
        getUserSoundSettings: () => mockUserSoundSetting,
        getConnection: _.identity,
        getChatMessagesByAgent: (val) => {
          if (val) {
            return _.identity(val);
          }
          return [];
        },
        getChatOnline: (status) => status === 'online'
      },
      'src/redux/modules/chat/chat-action-types': {
        IS_CHATTING: 'IS_CHATTING'
      },
      'src/redux/modules/helpCenter/helpCenter-selectors': {
        getArticleDisplayed: _.identity
      },
      'src/redux/modules/base/base-selectors': {
        getActiveEmbed: () => mockActiveEmbed,
        getWidgetShown: () => mockwidgetShown
      },
      'service/persistence': {
        store: {
          get: () => mockStoreValue
        }
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

        it('does not call mediator with newChat.connected', () => {
          expect(broadcastSpy)
            .not.toHaveBeenCalledWith('newChat.connected');
        });
      });

      describe('when chat has connected', () => {
        beforeEach(() => {
          stateChangeFn(connectingState, connectedState, {}, dispatchSpy);
        });

        it('dispatches the getAccountSettings action creator', () => {
          expect(getAccountSettingsSpy)
            .toHaveBeenCalled();
        });

        it('dispatches the getIsChatting action creator', () => {
          expect(getIsChattingSpy)
            .toHaveBeenCalled();
        });

        it('calls mediator with newChat.connected with the store value', () => {
          expect(broadcastSpy)
            .toHaveBeenCalledWith('newChat.connected', false);
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
            broadcastSpy.calls.reset();

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

          it('does not call mediator', () => {
            expect(broadcastSpy)
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

          it('calls mediator with newChat.newMessage', () => {
            expect(broadcastSpy)
              .toHaveBeenCalledWith('newChat.newMessage');
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

    describe('onArticleDisplayed', () => {
      beforeEach(() => {
        broadcastSpy.calls.reset();
      });

      describe('articleDisplayed goes from false to true', () => {
        beforeEach(() => {
          stateChangeFn(false, true);
        });

        it('calls mediator', () => {
          expect(broadcastSpy)
            .toHaveBeenCalledWith('.hide', true);

          expect(broadcastSpy)
            .toHaveBeenCalledWith('ipm.webWidget.show');
        });
      });

      describe('articleDisplayed goes from true to true', () => {
        beforeEach(() => {
          stateChangeFn(true, true);
        });

        it('does not call mediator', () => {
          expect(broadcastSpy)
            .not.toHaveBeenCalled();
        });
      });

      describe('articleDisplayed goes from true to false', () => {
        beforeEach(() => {
          stateChangeFn(true, false);
        });

        it('does not call mediator', () => {
          expect(broadcastSpy)
            .not.toHaveBeenCalled();
        });
      });
    });

    describe('onChatStatus', () => {
      const dispatchSpy = jasmine.createSpy('dispatch').and.callThrough();

      beforeEach(() => {
        broadcastSpy.calls.reset();
      });

      describe('when the action is IS_CHATTING', () => {
        beforeEach(() => {
          const action = {
            type: 'IS_CHATTING',
            payload: false
          };

          stateChangeFn(null, null, action, dispatchSpy);
        });

        it('calls mediator with isChatting and the value from the payload and store', () => {
          expect(broadcastSpy)
            .toHaveBeenCalledWith('newChat.isChatting', false, false);
        });

        describe('when the payload is false', () => {
          it('does not dispatches updateActiveEmbed', () => {
            expect(updateActiveEmbedSpy)
              .not.toHaveBeenCalled();
          });
        });

        describe('when the payload is true', () => {
          beforeEach(() => {
            const action = {
              type: 'IS_CHATTING',
              payload: true
            };

            mockStoreValue = { activeEmbed: 'chat' };
            stateChangeFn = requireUncached(path).default;

            stateChangeFn(null, null, action, dispatchSpy);
          });

          it('dispatches updateActiveEmbed with the value from the store', () => {
            expect(updateActiveEmbedSpy)
              .toHaveBeenCalledWith('chat');
          });
        });
      });

      describe('when the action is not IS_CHATTING', () => {
        beforeEach(() => {
          const action = {
            type: 'something_else'
          };

          stateChangeFn(null, null, action, dispatchSpy);
        });

        it('does not call mediator', () => {
          expect(broadcastSpy)
            .not.toHaveBeenCalled();
        });
      });
    });

    describe('onChatStatusChange', () => {
      beforeEach(() => {
        broadcastSpy.calls.reset();
      });

      describe('chatStatus goes from online to offline', () => {
        beforeEach(() => {
          stateChangeFn('online', 'offline');
        });

        it('calls mediator with newChat.offline', () => {
          expect(broadcastSpy)
            .toHaveBeenCalledWith('newChat.offline');
        });
      });

      describe('chatStatus goes from offline to online', () => {
        beforeEach(() => {
          stateChangeFn('offline', 'online');
        });

        it('calls mediator with newChat.online', () => {
          expect(broadcastSpy)
            .toHaveBeenCalledWith('newChat.online');
        });
      });

      describe('no chatStatus change', () => {
        beforeEach(() => {
          stateChangeFn('offline', 'offline');
        });

        it('does not call mediator', () => {
          expect(broadcastSpy)
            .not.toHaveBeenCalled();
        });
      });
    });
  });
});
