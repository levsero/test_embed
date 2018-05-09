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
    mockIsChatting;
  const getAccountSettingsSpy = jasmine.createSpy('updateAccountSettings');
  const getIsChattingSpy = jasmine.createSpy('getIsChatting');
  const newAgentMessageReceivedSpy = jasmine.createSpy('newAgentMessageReceived');
  const getOperatingHoursSpy = jasmine.createSpy('getOperatingHours');
  const updateActiveEmbedSpy = jasmine.createSpy('updateActiveEmbed');
  const audioPlaySpy = jasmine.createSpy('audioPlay');
  const broadcastSpy = jasmine.createSpy('broadcast');
  const updateLastAgentMessageSeenTimestampSpy = jasmine.createSpy('updateLastAgentMessageSeenTimestamp');
  const getActiveAgentsSpy = jasmine.createSpy('getActiveAgents').and.callFake(_.identity);
  const clearDepartmentSpy = jasmine.createSpy('clearDepartment');
  const setDepartmentSpy = jasmine.createSpy('setDepartment');
  const path = buildSrcPath('redux/middleware/onStateChange');
  let initialTimestamp = 80;
  let mockDepartmentLists = [];
  let mockGetSettingsChatDepartment = '';
  let mockWidgetShown = false;

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
        setDepartment: setDepartmentSpy
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
        getOfflineFormSettings: () => mockOfflineFormSettings,
        getLastAgentMessageSeenTimestamp: () => mockLastAgentMessageSeenTimestamp,
        getChatScreen: () => mockChatScreen,
        getIsProactiveSession: () => mockIsProactiveSession,
        getIsChatting: () => mockIsChatting,
        getActiveAgents: getActiveAgentsSpy,
        getDepartmentsList: () => mockDepartmentLists
      },
      'src/redux/modules/settings/settings-selectors': {
        getSettingsChatDepartment: () => mockGetSettingsChatDepartment
      },
      'src/redux/modules/chat/chat-action-types': {
        IS_CHATTING: 'IS_CHATTING',
        END_CHAT_REQUEST_SUCCESS: 'END_CHAT_REQUEST_SUCCESS',
        SDK_CHAT_MEMBER_LEAVE: 'SDK_CHAT_MEMBER_LEAVE',
        CHAT_AGENT_INACTIVE: 'CHAT_AGENT_INACTIVE'
      },
      'src/constants/chat': {
        CONNECTION_STATUSES: {
          CONNECTING: 'connecting'
        }
      },
      'src/redux/modules/helpCenter/helpCenter-selectors': {
        getArticleDisplayed: (state) => state && state.articleDisplayed
      },
      'src/redux/modules/base/base-selectors': {
        getActiveEmbed: () => mockActiveEmbed,
        getWidgetShown: () => mockWidgetShown,
        getSubmitTicketEmbed: () => mockSubmitTicketAvailable
      },
      'service/persistence': {
        store: {
          get: () => mockStoreValue
        }
      },
      'src/redux/modules/chat/chat-screen-types': {
        CHATTING_SCREEN: 'chatting'
      }
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
      const prevState = [{ nick: 'agent', timestamp: 50 }];
      const nextState = [{ nick: 'agent', timestamp: 30 }, { nick: 'agent', timestamp: 60 }, { nick: 'agent:007', msg: 'latest', timestamp: 70 }];
      const dispatchSpy = jasmine.createSpy('dispatch').and.callThrough();

      beforeEach(() => {
        broadcastSpy.calls.reset();
        newAgentMessageReceivedSpy.calls.reset();
        audioPlaySpy.calls.reset();
      });

      afterEach(() => {
        initialTimestamp = 80;
      });

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

          it('does not call mediator', () => {
            expect(broadcastSpy)
              .not.toHaveBeenCalled();
          });
        });
      });

      describe('when there are new messages', () => {
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
                  stateChangeFn(prevState, nextState, {}, dispatchSpy);
                });

                it('calls mediator with newChat.newMessage', () => {
                  expect(broadcastSpy)
                    .toHaveBeenCalledWith('newChat.newMessage');
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
          });

          describe('when the embed is shown and the active embed is not chat', () => {
            beforeEach(() => {
              mockWidgetShown = true;
              mockActiveEmbed = 'helpCenterForm';

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
      beforeEach(() => {
        broadcastSpy.calls.reset();
      });

      describe('articleDisplayed goes from false to true', () => {
        let ipmWidget;

        beforeEach(() => {
          stateChangeFn({ articleDisplayed: false, base: { embeds: { ipmWidget } } }, { articleDisplayed: true });
        });

        describe('ipm widget', () => {
          beforeAll(() => {
            ipmWidget = true;
          });

          it('calls mediator to show ipm widget', () => {
            expect(broadcastSpy)
              .toHaveBeenCalledWith('ipm.webWidget.show');
          });
        });

        describe('main widget', () => {
          beforeAll(() => {
            ipmWidget = false;
          });

          describe('widget is not shown', () => {
            beforeAll(() => {
              mockWidgetShown = false;
            });

            it('calls mediator to show main widget', () => {
              expect(broadcastSpy)
                .toHaveBeenCalledWith('.activate');
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
        });
      });

      describe('articleDisplayed goes from true to true', () => {
        beforeEach(() => {
          stateChangeFn({ articleDisplayed: true }, { articleDisplayed: true });
        });

        it('does not call mediator', () => {
          expect(broadcastSpy)
            .not.toHaveBeenCalled();
        });
      });

      describe('articleDisplayed goes from true to false', () => {
        beforeEach(() => {
          stateChangeFn({ articleDisplayed: true }, { articleDisplayed: false });
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
            updateActiveEmbedSpy.calls.reset();

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
  });
});
