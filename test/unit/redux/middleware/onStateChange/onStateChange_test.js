describe('onStateChange middleware', () => {
  let stateChangeFn,
    mockUserSoundSetting,
    mockActiveEmbed,
    mockOfflineFormSettings,
    mockStoreValue,
    mockLastAgentMessageSeenTimestamp,
    mockIsProactiveSession,
    mockChatScreen,
    mockSubmitTicketAvailable,
    mockIsChatting,
    mockHasSearched;
  const getAccountSettingsSpy = jasmine.createSpy('updateAccountSettings');
  const getIsChattingSpy = jasmine.createSpy('getIsChatting');
  const newAgentMessageReceivedSpy = jasmine.createSpy('newAgentMessageReceived');
  const getOperatingHoursSpy = jasmine.createSpy('getOperatingHours');
  const updateActiveEmbedSpy = jasmine.createSpy('updateActiveEmbed');
  const updateBackButtonVisibilitySpy = jasmine.createSpy('updateBackButtonVisibility');
  const audioPlaySpy = jasmine.createSpy('audioPlay');
  const broadcastSpy = jasmine.createSpy('broadcast');
  const updateLastAgentMessageSeenTimestampSpy = jasmine.createSpy('updateLastAgentMessageSeenTimestamp');
  const getActiveAgentsSpy = jasmine.createSpy('getActiveAgents').and.callFake(_.identity);
  const clearDepartmentSpy = jasmine.createSpy('clearDepartment');
  const setDepartmentSpy = jasmine.createSpy('setDepartment');
  const handleIsChattingSpy = jasmine.createSpy('handleIsChatting');
  const handleChatConnectedSpy = jasmine.createSpy('handleChatConnected');
  const chatConnectedSpy = jasmine.createSpy('chatConnected');
  const chatWindowOpenOnNavigateSpy = jasmine.createSpy('chatWindowOpenOnNavigateSpy');
  const activateRecievedSpy = jasmine.createSpy('activateRecieved');
  const path = buildSrcPath('redux/middleware/onStateChange/onStateChange');
  let initialTimestamp = 80;
  let mockDepartmentLists = [];
  let mockGetSettingsChatDepartment = '';
  let mockWidgetShown = false;
  let mockIPMWidget = false;
  let mockHelpCenterEmbed = false;
  let mockMobileNotificationsDisabled = false;
  let mockIsMobileBrowser = false;

  beforeEach(() => {
    mockery.enable();
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(initialTimestamp));

    mockUserSoundSetting = false;
    mockActiveEmbed = '';
    mockStoreValue = { widgetShown: false };
    mockOfflineFormSettings = { enabled: false };
    mockLastAgentMessageSeenTimestamp = 123;
    mockChatScreen = '';
    mockIsProactiveSession = false;
    mockSubmitTicketAvailable = false;
    mockIsChatting = false;

    initMockRegistry({
      'src/redux/modules/chat': {
        getAccountSettings: getAccountSettingsSpy,
        newAgentMessageReceived: newAgentMessageReceivedSpy,
        getOperatingHours: getOperatingHoursSpy,
        getIsChatting: getIsChattingSpy,
        updateLastAgentMessageSeenTimestamp: updateLastAgentMessageSeenTimestampSpy,
        clearDepartment: clearDepartmentSpy,
        setDepartment: setDepartmentSpy,
        handleChatConnected: handleChatConnectedSpy,
        handleIsChatting: handleIsChattingSpy,
        chatConnected: chatConnectedSpy,
        chatWindowOpenOnNavigate: chatWindowOpenOnNavigateSpy
      },
      'src/redux/modules/base': {
        updateActiveEmbed: updateActiveEmbedSpy,
        updateBackButtonVisibility: updateBackButtonVisibilitySpy,
        activateRecieved: activateRecievedSpy
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
        getOfflineFormSettings: () => mockOfflineFormSettings,
        getLastAgentMessageSeenTimestamp: () => mockLastAgentMessageSeenTimestamp,
        getChatScreen: () => mockChatScreen,
        getIsProactiveSession: () => mockIsProactiveSession,
        getIsChatting: (state) => _.get(state, 'isChatting', mockIsChatting),
        getActiveAgents: getActiveAgentsSpy,
        getDepartmentsList: () => mockDepartmentLists,
        getNotificationCount: (array) => _.get(_.last(array), 'notificationCount')
      },
      'src/redux/modules/settings/settings-selectors': {
        getSettingsChatDepartment: () => mockGetSettingsChatDepartment,
        getSettingsMobileNotificationsDisabled: () => mockMobileNotificationsDisabled
      },
      'src/redux/modules/chat/chat-action-types': {
        IS_CHATTING: 'IS_CHATTING',
        END_CHAT_REQUEST_SUCCESS: 'END_CHAT_REQUEST_SUCCESS',
        SDK_CHAT_MEMBER_LEAVE: 'SDK_CHAT_MEMBER_LEAVE',
        CHAT_AGENT_INACTIVE: 'CHAT_AGENT_INACTIVE',
        CHAT_SOCIAL_LOGIN_SUCCESS: 'CHAT_SOCIAL_LOGIN_SUCCESS',
        SDK_VISITOR_UPDATE: 'SDK_VISITOR_UPDATE',
        CHAT_STARTED: 'CHAT_STARTED',
        CHAT_CONNECTED: 'CHAT_CONNECTED'
      },
      'src/constants/chat': {
        CONNECTION_STATUSES: {
          CONNECTING: 'connecting'
        }
      },
      'src/redux/modules/helpCenter/helpCenter-selectors': {
        getArticleDisplayed: _.identity,
        getHasSearched: () => mockHasSearched
      },
      'src/redux/modules/base/base-selectors': {
        getActiveEmbed: () => mockActiveEmbed,
        getWidgetShown: () => mockWidgetShown,
        getSubmitTicketEmbed: () => mockSubmitTicketAvailable,
        getHelpCenterEmbed: () => mockHelpCenterEmbed,
        getIPMWidget: () => mockIPMWidget
      },
      'service/persistence': {
        store: {
          get: () => mockStoreValue
        }
      },
      'src/redux/modules/chat/chat-screen-types': {
        CHATTING_SCREEN: 'chatting'
      },
      'utility/devices': {
        isMobileBrowser() { return mockIsMobileBrowser; }
      },
      'src/redux/middleware/onStateChange/onWidgetOpen': noop,
      'src/redux/middleware/onStateChange/onChatOpen': noop
    });

    stateChangeFn = requireUncached(path).default;
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  afterEach(() => {
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

        it('does dispatch the event CHAT_CONNECTED', () => {
          expect(dispatchSpy)
            .not.toHaveBeenCalledWith({ type: 'CHAT_CONNECTED' });
        });

        it('does not dispatch the getAccountSettings action', () => {
          expect(getAccountSettingsSpy)
            .not.toHaveBeenCalled();
        });

        it('does not dispatch the getOperatingHours action', () => {
          expect(getOperatingHoursSpy)
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

        it('dispatches the event CHAT_CONNECTED', () => {
          expect(dispatchSpy)
            .toHaveBeenCalledWith({ type: 'CHAT_CONNECTED' });
        });

        it('dispatches the getAccountSettings action creator', () => {
          expect(getAccountSettingsSpy)
            .toHaveBeenCalled();
        });

        it('dispatches the getIsChatting action creator', () => {
          expect(getIsChattingSpy)
            .toHaveBeenCalled();
        });

        it('dispatches the getOperatingHours action creator', () => {
          expect(getOperatingHoursSpy)
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

        describe('when department supplied via settings', () => {
          beforeAll(() => {
            setDepartmentSpy.calls.reset();
            clearDepartmentSpy.calls.reset();
            mockGetSettingsChatDepartment = 'Department';
            mockDepartmentLists = [
              {
                name: 'Department',
                id: 10
              }
            ];
          });

          it('calls setDepartment with correct args', () => {
            expect(setDepartmentSpy)
              .toHaveBeenCalledWith(10);
          });

          it('does not call clearDepartment', () => {
            expect(clearDepartmentSpy)
              .not
              .toHaveBeenCalled();
          });
        });

        describe('when department not supplied via settings', () => {
          beforeAll(() => {
            setDepartmentSpy.calls.reset();
            clearDepartmentSpy.calls.reset();
            mockGetSettingsChatDepartment = '';
            mockDepartmentLists = [
              {
                name: 'Department',
                id: 10
              }
            ];
          });

          it('does not call setDepartment', () => {
            expect(setDepartmentSpy)
              .not
              .toHaveBeenCalled();
          });

          it('calls clearDepartment', () => {
            expect(clearDepartmentSpy)
              .toHaveBeenCalled();
          });
        });
      });
    });

    describe('onNewChatMessage', () => {
      let prevState = [{ nick: 'agent', timestamp: 50 }];
      let nextState = [{ nick: 'agent', timestamp: 30 }, { nick: 'agent', timestamp: 60 }, { nick: 'agent:007', msg: 'latest', timestamp: 70 }];
      const dispatchSpy = jasmine.createSpy('dispatch').and.callThrough();

      beforeEach(() => {
        broadcastSpy.calls.reset();
        newAgentMessageReceivedSpy.calls.reset();
        audioPlaySpy.calls.reset();
        updateActiveEmbedSpy.calls.reset();
      });

      describe('when there are no new messages', () => {
        beforeAll(() => {
          initialTimestamp = 80;
        });

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

          it('does not call mediator', () => {
            expect(broadcastSpy)
              .not.toHaveBeenCalled();
          });
        });
      });

      describe('when there are new messages', () => {
        beforeAll(() => {
          initialTimestamp = 60;
        });

        describe('when there are no unseen messages', () => {
          beforeEach(() => {
            mockStoreValue = { lastAgentMessageSeenTimestamp: 80 };
            mockUserSoundSetting = true;

            stateChangeFn(prevState, nextState, {}, dispatchSpy);
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

        describe('when there are unseen messages', () => {
          beforeEach(() => {
            mockStoreValue = { lastAgentMessageSeenTimestamp: 65 };
          });

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
            });

            describe('messages are recent', () => {
              beforeAll(() => {
                initialTimestamp = 60;
              });

              beforeEach(() => {
                stateChangeFn(prevState, nextState, {}, dispatchSpy);
              });

              it('calls sound', () => {
                expect(audioPlaySpy)
                  .toHaveBeenCalled();
              });
            });

            describe('messages are not recent', () => {
              beforeEach(() => {
                stateChangeFn(prevState, nextState, {}, dispatchSpy);
              });

              beforeAll(() => {
                initialTimestamp = 80;
              });

              it('does not call sound', () => {
                expect(audioPlaySpy)
                  .not.toHaveBeenCalled();
              });
            });
          });

          describe('when the embed is not shown', () => {
            beforeEach(() => {
              mockWidgetShown = false;
            });

            describe('messages are recent', () => {
              beforeAll(() => {
                initialTimestamp = 60;
              });

              describe('is proactive session', () => {
                beforeEach(() => {
                  mockIsProactiveSession = true;
                  mockIsMobileBrowser = false;
                  stateChangeFn(prevState, nextState, {}, dispatchSpy);
                });

                it('calls mediator with newChat.newMessage', () => {
                  expect(broadcastSpy)
                    .toHaveBeenCalledWith('newChat.newMessage', dispatchSpy);
                });
              });

              describe('is not proactive session', () => {
                beforeEach(() => {
                  mockIsProactiveSession = false;
                  stateChangeFn(prevState, nextState, {}, dispatchSpy);
                });

                it('does not call mediator with newChat.newMessage', () => {
                  expect(broadcastSpy)
                    .not.toHaveBeenCalled();
                });
              });

              describe('when isMobileNotificationsDisabled is true', () => {
                beforeEach(() => {
                  mockIsProactiveSession = true;
                  mockWidgetShown = false;
                  mockIsMobileBrowser = true;
                  mockMobileNotificationsDisabled = true;
                  stateChangeFn(prevState, nextState, {}, dispatchSpy);
                });

                it('does not call mediator with newChat.newMessage', () => {
                  expect(broadcastSpy)
                    .not.toHaveBeenCalled();
                });
              });

              describe('when isMobileNotificationsDisabled is false', () => {
                beforeEach(() => {
                  mockIsProactiveSession = true;
                  mockWidgetShown = false;
                  mockIsMobileBrowser = true;
                  mockMobileNotificationsDisabled = false;
                  stateChangeFn(prevState, nextState, {}, dispatchSpy);
                });

                it('does call mediator with newChat.newMessage', () => {
                  expect(broadcastSpy)
                    .toHaveBeenCalled();
                });
              });
            });

            describe('messages are not recent', () => {
              beforeEach(() => {
                stateChangeFn(prevState, nextState, {}, dispatchSpy);
              });

              it('calls mediator with newChat.newMessage', () => {
                expect(broadcastSpy)
                  .not.toHaveBeenCalledWith('newChat.newMessage');
              });
            });

            describe('when the first message comes from the first agent', () => {
              describe('when user has not made a search', () => {
                beforeEach(() => {
                  prevState = [];
                  nextState = [{ nick: 'agent', timestamp: 90, msg: 'yolo' }];
                  mockHasSearched = false;
                  mockWidgetShown = false;
                  mockIsMobileBrowser = true;
                  mockMobileNotificationsDisabled = false;
                  stateChangeFn(prevState, nextState, {}, dispatchSpy);
                });

                afterEach(() => {
                  prevState = [{ nick: 'agent', timestamp: 50 }];
                  nextState = [{ nick: 'agent', timestamp: 30 }, { nick: 'agent', timestamp: 60 }, { nick: 'agent:007', msg: 'latest', timestamp: 70 }];
                });

                it('calls updateActiveEmbed with chat', () => {
                  expect(updateActiveEmbedSpy)
                    .toHaveBeenCalledWith('chat');
                });
              });
            });
          });

          describe('when the embed is shown and the active embed is not chat', () => {
            beforeEach(() => {
              mockWidgetShown = true;
              mockActiveEmbed = 'helpCenterForm';
              mockUserSoundSetting = true;

              stateChangeFn(prevState, nextState, {}, dispatchSpy);
            });

            it('dispatches newAgentMessageReceived with new agent message', () => {
              expect(newAgentMessageReceivedSpy)
                .toHaveBeenCalledWith({ proactive: mockIsProactiveSession, nick: 'agent:007', msg: 'latest', timestamp: 70 });
            });

            it('does not call mediator', () => {
              expect(broadcastSpy)
                .not.toHaveBeenCalled();
            });
          });

          describe('when the embed is shown and the active embed is chat', () => {
            beforeEach(() => {
              mockWidgetShown = true;
              mockActiveEmbed = 'chat';

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

    describe('onArticleDisplayed', () => {
      const dispatchSpy = jasmine.createSpy('dispatch').and.callThrough();

      beforeEach(() => {
        broadcastSpy.calls.reset();
        dispatchSpy.calls.reset();
        updateBackButtonVisibilitySpy.calls.reset();
      });

      describe('articleDisplayed goes from false to true', () => {
        beforeEach(() => {
          stateChangeFn(false, true, dispatchSpy);
        });

        describe('ipm widget', () => {
          beforeAll(() => {
            mockIPMWidget = true;
          });

          it('hides back button', () => {
            expect(updateBackButtonVisibilitySpy)
              .toHaveBeenCalledWith(false);
          });
        });

        describe('main widget', () => {
          beforeAll(() => {
            mockIPMWidget = false;
          });

          describe('widget is not shown', () => {
            beforeAll(() => {
              mockWidgetShown = false;
            });

            it('calls activate', () => {
              expect(activateRecievedSpy)
                .toHaveBeenCalled();
            });
          });

          describe('widget is shown', () => {
            beforeAll(() => {
              mockWidgetShown = true;
            });

            it('does not call mediator', () => {
              expect(broadcastSpy)
                .not.toHaveBeenCalled();
            });
          });

          describe('hc is not available', () => {
            beforeAll(() => {
              mockHelpCenterEmbed = false;
            });

            it('hides the back button', () => {
              expect(updateBackButtonVisibilitySpy)
                .toHaveBeenCalledWith(false);
            });
          });

          describe('hc is available', () => {
            beforeAll(() => {
              mockHelpCenterEmbed = true;
            });

            it('shows the back button', () => {
              expect(updateBackButtonVisibilitySpy)
                .toHaveBeenCalledWith(true);
            });
          });
        });
      });

      describe('articleDisplayed goes from true to true', () => {
        beforeEach(() => {
          stateChangeFn(true, true, dispatchSpy);
        });

        it('does not call mediator', () => {
          expect(broadcastSpy)
            .not.toHaveBeenCalled();
        });
      });

      describe('articleDisplayed goes from true to false', () => {
        beforeEach(() => {
          stateChangeFn(true, false, dispatchSpy);
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
            updateActiveEmbedSpy.calls.reset();

            stateChangeFn(null, null, action, dispatchSpy);
          });

          it('dispatches updateActiveEmbed with the value from the store', () => {
            expect(updateActiveEmbedSpy)
              .toHaveBeenCalledWith('helpCenter');
          });

          describe('when the value in the store is zopimChat', () => {
            beforeEach(() => {
              mockStoreValue = { activeEmbed: 'zopimChat', widgetShown: true };
              stateChangeFn = requireUncached(path).default;

              stateChangeFn(null, null, action, dispatchSpy);
            });

            it('dispatches updateActiveEmbed with the chat', () => {
              expect(updateActiveEmbedSpy)
                .toHaveBeenCalledWith('chat');
            });

            it('dispatches chatWindowOpenOnNavigate', () => {
              expect(chatWindowOpenOnNavigateSpy)
                .toHaveBeenCalled();
            });
          });

          describe('when the store has lastAgentMessageSeenTimestamp', () => {
            beforeEach(() => {
              mockStoreValue = { lastAgentMessageSeenTimestamp: 123 };
              stateChangeFn = requireUncached(path).default;

              stateChangeFn(null, null, action, dispatchSpy);
            });

            it('dispatches updateLastAgentMessageSeenTimestamp with the timestamp', () => {
              expect(updateLastAgentMessageSeenTimestampSpy)
                .toHaveBeenCalledWith(123);
            });
          });
        });
      });

      describe('when the action is not IS_CHATTING', () => {
        beforeEach(() => {
          const action = {
            type: 'something_else'
          };

          broadcastSpy.calls.reset();
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
        updateActiveEmbedSpy.calls.reset();
      });

      describe('chatStatus goes from online to offline', () => {
        describe('when submit ticket available', () => {
          describe('when chatting', () => {
            beforeEach(() => {
              mockSubmitTicketAvailable = true;
              mockIsChatting = true;
              mockActiveEmbed = 'chat';
              stateChangeFn('online', 'offline');
            });

            it('does not update active embed', () => {
              expect(updateActiveEmbedSpy)
                .not
                .toHaveBeenCalled();
            });
          });

          describe('when not chatting', () => {
            describe('when active embed is chat', () => {
              beforeEach(() => {
                mockSubmitTicketAvailable = true;
                mockIsChatting = false;
                mockActiveEmbed = 'chat';
                stateChangeFn('online', 'offline');
              });

              it('updates active embed to submit ticket', () => {
                expect(updateActiveEmbedSpy)
                  .toHaveBeenCalledWith('ticketSubmissionForm');
              });
            });

            describe('when active embed is not chat', () => {
              beforeEach(() => {
                mockSubmitTicketAvailable = true;
                mockIsChatting = false;
                mockActiveEmbed = 'helpCenterForm';
                stateChangeFn('online', 'offline');
              });

              it('does not update active embed', () => {
                expect(updateActiveEmbedSpy)
                  .not
                  .toHaveBeenCalled();
              });
            });
          });
        });

        describe('when submit ticket not available', () => {
          beforeEach(() => {
            mockSubmitTicketAvailable = false;
            stateChangeFn('online', 'offline');
          });

          it('does not update active embed', () => {
            expect(updateActiveEmbedSpy)
              .not
              .toHaveBeenCalled();
          });
        });
      });
    });

    describe('onChatScreenInteraction', () => {
      const nextState = [{ nick: 'agent', timestamp: 160 }];
      const dispatchSpy = jasmine.createSpy('dispatch').and.callThrough();

      beforeEach(() => {
        mockChatScreen = 'chatting';
        mockWidgetShown = true;
        mockActiveEmbed = 'chat';
        mockLastAgentMessageSeenTimestamp = 100;

        updateLastAgentMessageSeenTimestampSpy.calls.reset();
      });

      describe('when in chatting screen', () => {
        describe('when new agent message timestamp is larger than stored timestamp', () => {
          beforeEach(() => {
            stateChangeFn([], nextState, {}, dispatchSpy);
          });

          it('dispatches updateLastAgentMessageSeenTimestamp', () => {
            expect(updateLastAgentMessageSeenTimestampSpy)
              .toHaveBeenCalledWith(160);
          });
        });

        describe('when new agent message timestamp is smaller than stored timestamp', () => {
          beforeEach(() => {
            mockLastAgentMessageSeenTimestamp = 180;

            stateChangeFn([], nextState, {}, dispatchSpy);
          });

          it('does not dispatch updateLastAgentMessageSeenTimestamp', () => {
            expect(updateLastAgentMessageSeenTimestampSpy)
              .not.toHaveBeenCalled();
          });
        });
      });

      describe('when not in chatting screen', () => {
        describe('when chat screen is not chat', () => {
          beforeEach(() => {
            mockChatScreen = 'something';

            stateChangeFn([], nextState, {}, dispatchSpy);
          });

          it('does not dispatch updateLastAgentMessageSeenTimestamp', () => {
            expect(updateLastAgentMessageSeenTimestampSpy)
              .not.toHaveBeenCalled();
          });
        });

        describe('when widget is not shown', () => {
          beforeEach(() => {
            mockWidgetShown = false;

            stateChangeFn([], nextState, {}, dispatchSpy);
          });

          it('does not dispatch updateLastAgentMessageSeenTimestamp', () => {
            expect(updateLastAgentMessageSeenTimestampSpy)
              .not.toHaveBeenCalled();
          });
        });

        describe('when active embed is not chat', () => {
          beforeEach(() => {
            mockActiveEmbed = 'not_chat';

            stateChangeFn([], nextState, {}, dispatchSpy);
          });

          it('does not dispatch updateLastAgentMessageSeenTimestamp', () => {
            expect(updateLastAgentMessageSeenTimestampSpy)
              .not.toHaveBeenCalled();
          });
        });
      });
    });

    describe('onChatEnd', () => {
      let actionType;

      beforeEach(() => {
        updateActiveEmbedSpy.calls.reset();
      });

      describe('when action type is END_CHAT_REQUEST_SUCCESS', () => {
        beforeAll(() => {
          actionType = 'END_CHAT_REQUEST_SUCCESS';
        });

        describe('when not offline', () => {
          beforeEach(() => {
            mockSubmitTicketAvailable = true;
            stateChangeFn(null, 'online', { type: actionType });
          });

          it('does not update active embed', () => {
            expect(updateActiveEmbedSpy)
              .not
              .toHaveBeenCalled();
          });
        });

        describe('when submit ticket is not available', () => {
          beforeEach(() => {
            mockSubmitTicketAvailable = false;
            stateChangeFn(null, 'offline', { type: actionType });
          });

          it('does not update active embed', () => {
            expect(updateActiveEmbedSpy)
              .not
              .toHaveBeenCalled();
          });
        });

        describe('when all conditions are met', () => {
          beforeEach(() => {
            mockSubmitTicketAvailable = true;
            stateChangeFn(null, 'offline', { type: actionType });
          });

          it('update active embed to submit ticket', () => {
            expect(updateActiveEmbedSpy)
              .toHaveBeenCalledWith('ticketSubmissionForm');
          });
        });
      });

      describe('when action type is not END_CHAT_REQUEST_SUCCESS', () => {
        beforeAll(() => {
          actionType = 'yolo';
        });

        beforeEach(() => {
          stateChangeFn(null, null, { type: actionType });
        });

        it('does not update active embed', () => {
          expect(updateActiveEmbedSpy)
            .not
            .toHaveBeenCalled();
        });
      });
    });

    describe('onAgentLeave', () => {
      let prevState,
        action,
        dispatchSpy;

      beforeEach(() => {
        dispatchSpy = jasmine.createSpy('dispatch');

        stateChangeFn(prevState, {}, action, dispatchSpy);
      });

      describe('when the type of action is not SDK_CHAT_MEMBER_LEAVE', () => {
        beforeAll(() => {
          prevState = {};
          action = {
            type: 'some_type_that_is_not_member_leave',
            payload: { detail: { nick: 'agent:terence' } }
          };
        });

        it('does not call getActiveAgents', () => {
          expect(getActiveAgentsSpy)
            .not.toHaveBeenCalled();
        });
      });

      describe('when the type of user is not an agent', () => {
        beforeAll(() => {
          prevState = {};
          action = {
            type: 'SDK_CHAT_MEMBER_LEAVE',
            payload: { detail: { nick: 'visitor' } }
          };
        });

        it('does not call getActiveAgents', () => {
          expect(getActiveAgentsSpy)
            .not.toHaveBeenCalled();
        });
      });

      describe('when the action type is SDK_CHAT_MEMBER_LEAVE and the user is an agent', () => {
        beforeAll(() => {
          prevState = {
            'agent:terence': { nick: 'agent:terence' }
          };
          action = {
            type: 'SDK_CHAT_MEMBER_LEAVE',
            payload: { detail: { nick: 'agent:terence' } }
          };
        });

        it('calls getActiveAgents with previous state', () => {
          expect(getActiveAgentsSpy)
            .toHaveBeenCalledWith(prevState);
        });

        it('dispatches CHAT_AGENT_INACTIVE with expected payload', () => {
          const expected = {
            type: 'CHAT_AGENT_INACTIVE',
            payload: { nick: 'agent:terence' }
          };

          expect(dispatchSpy)
            .toHaveBeenCalledWith(expected);
        });
      });
    });

    describe('onVisitorUpdate', () => {
      let action,
        dispatchSpy,
        avatarPath;

      beforeEach(() => {
        dispatchSpy = jasmine.createSpy('dispatch');

        stateChangeFn({}, {}, action, dispatchSpy);
      });

      describe('when the type of action is SDK_VISITOR_UPDATE', () => {
        describe('when the user is authenticated to a social media', () => {
          beforeAll(() => {
            avatarPath = 'www.terence.com/myAvatar.jpeg';

            action = {
              type: 'SDK_VISITOR_UPDATE',
              payload: {
                detail: {
                  auth: {
                    'avatar$string': avatarPath,
                    'verified$bool': true
                  }
                }
              }
            };
          });

          it('calls dispatch with expected args', () => {
            const expected = {
              type: 'CHAT_SOCIAL_LOGIN_SUCCESS',
              payload: avatarPath
            };

            expect(dispatchSpy)
              .toHaveBeenCalledWith(expected);
          });
        });

        describe('when the user is not authenticated to a social media', () => {
          beforeAll(() => {
            avatarPath = 'www.terence.com/myAvatar.jpeg';

            action = {
              type: 'SDK_VISITOR_UPDATE',
              payload: {
                detail: {
                  auth: {
                    'avatar$string': avatarPath,
                    'verified$bool': false
                  }
                }
              }
            };
          });

          it('does not call dispatch', () => {
            expect(dispatchSpy)
              .not.toHaveBeenCalled();
          });
        });
      });

      describe('when the type of action is not SDK_VISITOR_UPDATE', () => {
        beforeAll(() => {
          avatarPath = 'www.terence.com/myAvatar.jpeg';

          action = {
            type: 'END_CHAT_REQUEST_SUCCESS',
            payload: {
              detail: {
                auth: {
                  'avatar$string': avatarPath,
                  'verified$bool': true
                }
              }
            }
          };
        });

        it('does not call dispatch', () => {
          expect(dispatchSpy)
            .not.toHaveBeenCalled();
        });
      });
    });

    describe('onChatStarted', () => {
      let prevState,
        currState,
        dispatchSpy;

      beforeEach(() => {
        dispatchSpy = jasmine.createSpy('dispatch').and.callThrough();
      });

      describe('when chat has previously initiated', () => {
        beforeEach(() => {
          prevState = { isChatting: true };
          currState = { isChatting: true };

          stateChangeFn(prevState, currState, {}, dispatchSpy);
        });

        it('does not call handleIsChatting', () => {
          expect(handleIsChattingSpy)
            .not.toHaveBeenCalled();
        });
      });

      describe('when chat has not been previously initiated', () => {
        beforeAll(() => {
          prevState = { isChatting: false };
        });

        describe('when chat is being initiated', () => {
          beforeEach(() => {
            currState = { isChatting: true };

            stateChangeFn(prevState, currState, {}, dispatchSpy);
          });

          it('dispatches the event CHAT_STARTED', () => {
            expect(dispatchSpy)
              .toHaveBeenCalledWith({ type: 'CHAT_STARTED' });
          });
        });

        describe('when chat is not being initiated', () => {
          beforeEach(() => {
            currState = { isChatting: false };

            stateChangeFn(prevState, currState, {}, dispatchSpy);
          });

          it('does not dispatch the event CHAT_STARTED', () => {
            expect(dispatchSpy)
              .not.toHaveBeenCalledWith({ type: 'CHAT_STARTED' });
          });
        });
      });
    });
  });
});
