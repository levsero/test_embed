describe('onStateChange middleware', () => {
  let stateChangeFn,
    mockUserSoundSetting,
    mockActiveEmbed,
    mockwidgetShown,
    mockOfflineFormSettings,
    mockStoreValue,
    incrementNewAgentMessageCounterSpy;
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
    mockOfflineFormSettings = { enabled: false };
    incrementNewAgentMessageCounterSpy = jasmine.createSpy('incrementNewAgentMessageCounter');

    initMockRegistry({
      'src/redux/modules/chat': {
        getAccountSettings: getAccountSettingsSpy,
        newAgentMessageReceived: newAgentMessageReceivedSpy,
        incrementNewAgentMessageCounter: incrementNewAgentMessageCounterSpy,
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
        getChatOnline: (status) => status === 'online',
        getChatStatus: (status) => status === 'online',
        getOfflineFormSettings: () => mockOfflineFormSettings
      },
      'src/redux/modules/chat/chat-action-types': {
        IS_CHATTING: 'IS_CHATTING'
      },
      'src/constants/chat': {
        CONNECTION_STATUSES: {
          CONNECTING: 'connecting'
        }
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

        describe('when the chat connects for a second time', () => {
          beforeEach(() => {
            getAccountSettingsSpy.calls.reset();
            getIsChattingSpy.calls.reset();
            broadcastSpy.calls.reset();
            stateChangeFn(connectingState, connectedState, {}, dispatchSpy);
          });

          it('does not dispatch the getAccountSettings action creator', () => {
            expect(getAccountSettingsSpy)
              .not.toHaveBeenCalled();
          });

          it('does not dispatch the getIsChatting action creator', () => {
            expect(getIsChattingSpy)
              .not.toHaveBeenCalled();
          });

          it('does not call mediator with newChat.connected with the store value', () => {
            expect(broadcastSpy)
              .not.toHaveBeenCalledWith('newChat.connected', false);
          });
        });
      });
    });

    describe('onNewChatMessage', () => {
      const prevState = [{ nick: 'agent' }];
      const nextState = [{ nick: 'agent' }, { nick: 'agent' }, { nick: 'agent:007', msg: 'latest' }];
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

          it('does not dispatch incrementNewAgentMessageCounter', () => {
            expect(incrementNewAgentMessageCounterSpy)
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

          it('dispatches incrementNewAgentMessageCounterSpy', () => {
            expect(incrementNewAgentMessageCounterSpy)
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
            broadcastSpy.calls.reset();

            stateChangeFn(prevState, nextState, {}, dispatchSpy);
          });

          it('dispatches incrementNewAgentMessageCounterSpy', () => {
            expect(incrementNewAgentMessageCounterSpy)
              .toHaveBeenCalled();
          });

          it('dispatches newAgentMessageReceived with new agent message', () => {
            expect(newAgentMessageReceivedSpy)
              .toHaveBeenCalledWith({ nick: 'agent:007', msg: 'latest' });
          });

          it('does not call mediator', () => {
            expect(broadcastSpy)
              .not.toHaveBeenCalled();
          });
        });

        describe('when the embed is shown and the active embed is chat', () => {
          beforeEach(() => {
            mockwidgetShown = true;
            mockActiveEmbed = 'chat';
            newAgentMessageReceivedSpy.calls.reset();
            incrementNewAgentMessageCounterSpy.calls.reset();

            stateChangeFn(prevState, nextState, {}, dispatchSpy);
          });

          it('does not dispatch newAgentMessageReceived', () => {
            expect(newAgentMessageReceivedSpy)
              .not.toHaveBeenCalled();
          });

          it('does not dispatch incrementNewAgentMessageCounter', () => {
            expect(incrementNewAgentMessageCounterSpy)
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
          const action = {
            type: 'IS_CHATTING',
            payload: true
          };

          beforeEach(() => {
            mockStoreValue = { activeEmbed: 'helpCenter' };
            stateChangeFn = requireUncached(path).default;

            stateChangeFn(null, null, action, dispatchSpy);
          });

          it('dispatches updateActiveEmbed with the value from the store', () => {
            expect(updateActiveEmbedSpy)
              .toHaveBeenCalledWith('helpCenter');
          });

          describe('when the value in the store is zopimChat', () => {
            beforeEach(() => {
              mockStoreValue = { activeEmbed: 'zopimChat' };
              stateChangeFn = requireUncached(path).default;

              stateChangeFn(null, null, action, dispatchSpy);
            });

            it('dispatches updateActiveEmbed with the chat', () => {
              expect(updateActiveEmbedSpy)
                .toHaveBeenCalledWith('chat');
            });
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
        describe('when offline form is disabled', () => {
          beforeEach(() => {
            stateChangeFn('online', 'offline');
          });

          it('calls mediator with newChat.offline and true', () => {
            expect(broadcastSpy)
              .toHaveBeenCalledWith('newChat.offline', true);
          });
        });

        describe('when offline form is enabled', () => {
          beforeEach(() => {
            mockOfflineFormSettings = { enabled: true };
            stateChangeFn('online', 'offline');
          });

          it('calls mediator with newChat.offline and false', () => {
            expect(broadcastSpy)
              .toHaveBeenCalledWith('newChat.offline', false);
          });
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
