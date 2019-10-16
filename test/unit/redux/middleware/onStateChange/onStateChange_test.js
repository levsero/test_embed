describe('onStateChange middleware', () => {
  let stateChangeFn,
    mockUserSoundSetting,
    mockActiveEmbed,
    mockOfflineFormSettings,
    mockStoreValue,
    mockIsProactiveSession,
    mockChatScreen,
    mockSubmitTicketAvailable,
    mockIsChatting,
    mockHasSearched,
    mockAnswerBotAvailable = false,
    useArg,
    mockIsPopout = false,
    mockCookiesDisabled,
    mockChatEnabled
  const getAccountSettingsSpy = jasmine.createSpy('updateAccountSettings')
  const getIsChattingSpy = jasmine.createSpy('getIsChatting')
  const newAgentMessageReceivedSpy = jasmine.createSpy('newAgentMessageReceived')
  const getOperatingHoursSpy = jasmine.createSpy('getOperatingHours')
  const updateActiveEmbedSpy = jasmine.createSpy('updateActiveEmbed')
  const updateBackButtonVisibilitySpy = jasmine.createSpy('updateBackButtonVisibility')
  const audioPlaySpy = jasmine.createSpy('audioPlay')
  const broadcastSpy = jasmine.createSpy('broadcast')
  const chatNotificationResetSpy = jasmine.createSpy('chatNotificationReset')
  const getActiveAgentsSpy = jasmine.createSpy('getActiveAgents').and.callFake(_.identity)
  const clearDepartmentSpy = jasmine.createSpy('clearDepartment')
  const setDepartmentSpy = jasmine.createSpy('setDepartment')
  const handleIsChattingSpy = jasmine.createSpy('handleIsChatting')
  const handleChatConnectedSpy = jasmine.createSpy('handleChatConnected')
  const chatConnectedSpy = jasmine.createSpy('chatConnected')
  const updateChatSettingsSpy = jasmine.createSpy('updateChatSettings')
  const chatWindowOpenOnNavigateSpy = jasmine.createSpy('chatWindowOpenOnNavigateSpy')
  const activateReceivedSpy = jasmine.createSpy('activateReceived')
  const resetShouldWarnSpy = jasmine.createSpy('resetShouldWarn')
  const storeEnableSpy = jasmine.createSpy('enableStore')
  const storeDisableSpy = jasmine.createSpy('disableStore')
  const setUpChatSpy = jasmine.createSpy('setUpChat')
  const chatStartedSpy = jasmine.createSpy('chatStarted')
  const endChatSpy = jasmine.createSpy('endChat')
  const path = buildSrcPath('redux/middleware/onStateChange/onStateChange')
  let initialTimestamp = 80
  let mockDepartment
  let mockGetSettingsChatDepartment = ''
  let mockWidgetShown = false
  let mockIPMWidget = false
  let mockHelpCenterEmbed = false
  let mockMobileNotificationsDisabled = false
  let mockIsMobileBrowser = false
  let mockWin = 123456
  let mockHasUnseenAgentMessage
  let mockHasWidgetShown = false

  beforeEach(() => {
    mockery.enable()
    jasmine.clock().install()
    jasmine.clock().mockDate(new Date(initialTimestamp))

    mockUserSoundSetting = false
    mockActiveEmbed = ''
    mockStoreValue = { widgetShown: false }
    mockOfflineFormSettings = { enabled: false }
    mockChatScreen = ''
    mockIsProactiveSession = false
    mockSubmitTicketAvailable = false
    mockIsChatting = false
    mockHasUnseenAgentMessage = false
    useArg = false
    mockChatEnabled = true

    initMockRegistry({
      'src/redux/modules/chat/chat-actions/actions': {
        getAccountSettings: getAccountSettingsSpy,
        newAgentMessageReceived: newAgentMessageReceivedSpy,
        getOperatingHours: getOperatingHoursSpy,
        getIsChatting: getIsChattingSpy,
        clearDepartment: clearDepartmentSpy,
        setDepartment: setDepartmentSpy,
        handleChatConnected: handleChatConnectedSpy,
        handleIsChatting: handleIsChattingSpy,
        chatConnected: chatConnectedSpy,
        chatWindowOpenOnNavigate: chatWindowOpenOnNavigateSpy,
        chatNotificationReset: chatNotificationResetSpy,
        chatStarted: chatStartedSpy,
        endChat: endChatSpy
      },
      'src/redux/modules/chat/chat-actions/setUpChat': {
        setUpChat: setUpChatSpy
      },
      'src/redux/modules/chat/chat-actions/getIsChatting': {
        getIsChatting: getIsChattingSpy
      },
      'src/redux/modules/base': {
        updateActiveEmbed: updateActiveEmbedSpy,
        updateBackButtonVisibility: updateBackButtonVisibilitySpy,
        activateReceived: activateReceivedSpy
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
        getChatMessagesFromAgents: val => {
          if (val) {
            return _.identity(val)
          }
          return []
        },
        getChatOnline: status => status === 'online',
        getChatStatus: status => status === 'online',
        getChatScreen: () => mockChatScreen,
        getIsProactiveSession: () => mockIsProactiveSession,
        getIsChatting: state => _.get(state, 'isChatting', mockIsChatting),
        getActiveAgents: getActiveAgentsSpy,
        getNotificationCount: array => _.get(_.last(array), 'notificationCount'),
        getLastReadTimestamp: state => _.get(state, 'lastReadTimestamp'),
        hasUnseenAgentMessage: () => mockHasUnseenAgentMessage
      },
      'src/redux/modules/selectors': {
        getOfflineFormSettings: () => mockOfflineFormSettings,
        getDefaultSelectedDepartment: () => mockDepartment,
        getAnswerBotAvailable: () => mockAnswerBotAvailable
      },
      'src/redux/modules/settings/settings-selectors': {
        getSettingsChatDepartment: () => mockGetSettingsChatDepartment,
        getSettingsMobileNotificationsDisabled: () => mockMobileNotificationsDisabled,
        getCookiesDisabled: () => mockCookiesDisabled
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
      'src/redux/modules/base/base-action-types': {
        UPDATE_EMBEDDABLE_CONFIG: 'UPDATE_EMBEDDABLE_CONFIG',
        UPDATE_ACTIVE_EMBED: 'UPDATE_ACTIVE_EMBED'
      },
      'src/redux/modules/settings/settings-action-types': {
        UPDATE_SETTINGS: 'UPDATE_SETTINGS'
      },
      'src/constants/chat': {
        CONNECTION_STATUSES: {
          CONNECTING: 'connecting',
          CONNECTED: 'connected'
        }
      },
      'src/redux/middleware/onStateChange/onZopimStateChange': {
        onZopimChatStateChange: noop
      },
      'src/redux/middleware/onStateChange/onAgentLeave': noop,
      'embeds/helpCenter/selectors': {
        getArticleDisplayed: _.identity,
        getHasSearched: () => mockHasSearched
      },
      'src/redux/modules/base/base-selectors': {
        getActiveEmbed: arg => {
          if (useArg) return arg
          return mockActiveEmbed
        },
        getWidgetShown: () => mockWidgetShown,
        getSubmitTicketEmbed: () => mockSubmitTicketAvailable,
        getHelpCenterEmbed: () => mockHelpCenterEmbed,
        getIPMWidget: () => mockIPMWidget,
        getHasWidgetShown: () => mockHasWidgetShown,
        getChatEmbed: () => mockChatEnabled
      },
      'service/persistence': {
        store: {
          get: () => mockStoreValue,
          enable: storeEnableSpy,
          disable: storeDisableSpy
        }
      },
      'src/redux/modules/chat/chat-screen-types': {
        CHATTING_SCREEN: 'chatting'
      },
      'utility/devices': {
        isMobileBrowser() {
          return mockIsMobileBrowser
        }
      },
      'utility/globals': {
        win: mockWin,
        isPopout: () => mockIsPopout
      },
      'src/redux/middleware/onStateChange/onWidgetOpen': noop,
      'src/redux/middleware/onStateChange/onChatOpen': noop,
      'src/redux/middleware/onStateChange/onChannelChoiceTransition': noop,
      'src/util/nullZChat': {
        resetShouldWarn: resetShouldWarnSpy
      },
      'src/redux/modules/settings/settings-actions': {
        updateChatSettings: updateChatSettingsSpy
      },
      'src/redux/middleware/onStateChange/onChatConnectionClosed': noop,
      'src/redux/middleware/onStateChange/onChatConnectOnDemandTrigger': noop
    })

    stateChangeFn = requireUncached(path).default
  })

  afterEach(() => {
    jasmine.clock().uninstall()
  })

  afterEach(() => {
    mockery.disable()
    mockery.deregisterAll()
  })

  describe('onStateChange', () => {
    describe('onChatConnected', () => {
      const connectingState = 'connecting'
      const connectedState = 'connected'
      const dispatchSpy = jasmine.createSpy('dispatch').and.callThrough()

      describe('when chat has not connected', () => {
        beforeEach(() => {
          stateChangeFn(connectingState, connectingState, {}, dispatchSpy)
        })

        it('does not dispatch the event CHAT_CONNECTED', () => {
          expect(dispatchSpy).not.toHaveBeenCalledWith({
            type: 'CHAT_CONNECTED'
          })
        })

        it('does not dispatch the getAccountSettings action', () => {
          expect(getAccountSettingsSpy).not.toHaveBeenCalled()
        })

        it('does not dispatch the getOperatingHours action', () => {
          expect(getOperatingHoursSpy).not.toHaveBeenCalled()
        })

        it('does not call mediator with newChat.connected', () => {
          expect(broadcastSpy).not.toHaveBeenCalledWith('newChat.connected')
        })
      })

      describe('when chat has connected', () => {
        beforeEach(() => {
          stateChangeFn(connectingState, connectedState, {}, dispatchSpy)
        })

        it('dispatches the event CHAT_CONNECTED', () => {
          expect(chatConnectedSpy).toHaveBeenCalledTimes(1)
        })

        it('dispatches the getAccountSettings action creator', () => {
          expect(getAccountSettingsSpy).toHaveBeenCalled()
        })

        it('dispatches the updateChatSettings action creator', () => {
          expect(updateChatSettingsSpy).toHaveBeenCalled()
        })

        it('dispatches the getIsChatting action creator', () => {
          expect(getIsChattingSpy).toHaveBeenCalled()
        })

        it('dispatches the getOperatingHours action creator', () => {
          expect(getOperatingHoursSpy).toHaveBeenCalled()
        })

        describe('when the chat connects for a second time', () => {
          beforeEach(() => {
            getAccountSettingsSpy.calls.reset()
            getIsChattingSpy.calls.reset()
            broadcastSpy.calls.reset()
            stateChangeFn(connectingState, connectedState, {}, dispatchSpy)
          })

          it('does not dispatch the getAccountSettings action creator', () => {
            expect(getAccountSettingsSpy).not.toHaveBeenCalled()
          })

          it('does not dispatch the getIsChatting action creator', () => {
            expect(getIsChattingSpy).not.toHaveBeenCalled()
          })
        })
      })
    })

    describe('onNewChatMessage', () => {
      let prevState = [{ nick: 'agent', timestamp: 50 }]
      let nextState = [
        { nick: 'agent', timestamp: 30 },
        { nick: 'agent', timestamp: 60 },
        { nick: 'agent:007', msg: 'latest', timestamp: 70 }
      ]
      const dispatchSpy = jasmine.createSpy('dispatch').and.callThrough()

      beforeEach(() => {
        broadcastSpy.calls.reset()
        newAgentMessageReceivedSpy.calls.reset()
        audioPlaySpy.calls.reset()
        updateActiveEmbedSpy.calls.reset()
      })

      describe('when there are no new messages', () => {
        beforeAll(() => {
          initialTimestamp = 80
        })

        describe('when audio settings are on', () => {
          beforeEach(() => {
            mockUserSoundSetting = true

            stateChangeFn(prevState, prevState)
          })

          it('does not call sound', () => {
            expect(audioPlaySpy).not.toHaveBeenCalled()
          })

          it('does not dispatch newAgentMessageReceived', () => {
            expect(newAgentMessageReceivedSpy).not.toHaveBeenCalled()
          })

          it('does not call mediator', () => {
            expect(broadcastSpy).not.toHaveBeenCalled()
          })
        })
      })

      describe('when there are new messages', () => {
        beforeAll(() => {
          initialTimestamp = 60
        })

        describe('when there are no unseen messages', () => {
          beforeEach(() => {
            mockHasUnseenAgentMessage = false
            mockUserSoundSetting = true

            stateChangeFn(prevState, nextState, {}, dispatchSpy)
          })

          it('does not call sound', () => {
            expect(audioPlaySpy).not.toHaveBeenCalled()
          })

          it('does not dispatch newAgentMessageReceived', () => {
            expect(newAgentMessageReceivedSpy).not.toHaveBeenCalled()
          })

          it('does not call mediator', () => {
            expect(broadcastSpy).not.toHaveBeenCalled()
          })
        })

        describe('when there are unseen messages', () => {
          beforeEach(() => {
            mockHasUnseenAgentMessage = true
          })

          it('dispatches newAgentMessageReceived with new agent message', () => {
            stateChangeFn(prevState, nextState, {}, dispatchSpy)

            expect(newAgentMessageReceivedSpy).toHaveBeenCalledWith({
              proactive: mockIsProactiveSession,
              nick: 'agent:007',
              msg: 'latest',
              timestamp: 70
            })
          })

          describe('when the embed is not shown', () => {
            beforeEach(() => {
              mockWidgetShown = false
            })

            describe('messages are recent', () => {
              beforeAll(() => {
                initialTimestamp = 60
              })

              describe('when audio settings are off', () => {
                beforeEach(() => {
                  mockUserSoundSetting = false

                  stateChangeFn(prevState, nextState, {}, dispatchSpy)
                })

                it('does not call sound', () => {
                  expect(audioPlaySpy).not.toHaveBeenCalled()
                })
              })

              describe('when audio settings are on', () => {
                beforeEach(() => {
                  mockUserSoundSetting = true
                })

                describe('when widget has been shown', () => {
                  beforeEach(() => {
                    mockHasWidgetShown = true
                    stateChangeFn(prevState, nextState, {}, dispatchSpy)
                  })

                  it('calls sound', () => {
                    expect(audioPlaySpy).toHaveBeenCalled()
                  })
                })

                describe('when widget has not been shown', () => {
                  beforeEach(() => {
                    mockHasWidgetShown = false
                    stateChangeFn(prevState, nextState, {}, dispatchSpy)
                  })

                  it('does not call sound', () => {
                    expect(audioPlaySpy).not.toHaveBeenCalled()
                  })
                })
              })

              describe('is proactive session', () => {
                beforeEach(() => {
                  mockIsProactiveSession = true
                  mockIsMobileBrowser = false
                  stateChangeFn(prevState, nextState, {}, dispatchSpy)
                })

                it('calls mediator with newChat.newMessage', () => {
                  expect(broadcastSpy).toHaveBeenCalledWith('newChat.newMessage')
                })
              })

              describe('is not proactive session', () => {
                beforeEach(() => {
                  mockIsProactiveSession = false
                  stateChangeFn(prevState, nextState, {}, dispatchSpy)
                })

                it('does not call mediator with newChat.newMessage', () => {
                  expect(broadcastSpy).not.toHaveBeenCalled()
                })
              })

              describe('when isMobileNotificationsDisabled is true', () => {
                beforeEach(() => {
                  mockIsProactiveSession = true
                  mockWidgetShown = false
                  mockIsMobileBrowser = true
                  mockMobileNotificationsDisabled = true
                  stateChangeFn(prevState, nextState, {}, dispatchSpy)
                })

                it('does not call mediator with newChat.newMessage', () => {
                  expect(broadcastSpy).not.toHaveBeenCalled()
                })
              })

              describe('when isMobileNotificationsDisabled is false', () => {
                beforeEach(() => {
                  mockIsProactiveSession = true
                  mockWidgetShown = false
                  mockIsMobileBrowser = true
                  mockMobileNotificationsDisabled = false
                  stateChangeFn(prevState, nextState, {}, dispatchSpy)
                })

                it('does call mediator with newChat.newMessage', () => {
                  expect(broadcastSpy).toHaveBeenCalled()
                })
              })
            })

            describe('messages are not recent', () => {
              beforeEach(() => {
                stateChangeFn(prevState, nextState, {}, dispatchSpy)
              })

              it('calls mediator with newChat.newMessage', () => {
                expect(broadcastSpy).not.toHaveBeenCalledWith('newChat.newMessage')
              })

              it('does not call sound', () => {
                expect(audioPlaySpy).not.toHaveBeenCalled()
              })
            })

            describe('when the first message comes from the first agent', () => {
              describe('when user is not on help center', () => {
                beforeEach(() => {
                  prevState = []
                  nextState = [{ nick: 'agent', timestamp: 90, msg: 'yolo' }]
                  mockWidgetShown = false
                  mockMobileNotificationsDisabled = false
                })

                afterEach(() => {
                  prevState = [{ nick: 'agent', timestamp: 50 }]
                  nextState = [
                    { nick: 'agent', timestamp: 30 },
                    { nick: 'agent', timestamp: 60 },
                    { nick: 'agent:007', msg: 'latest', timestamp: 70 }
                  ]
                })

                describe('when user is not on help center', () => {
                  beforeEach(() => {
                    mockActiveEmbed = 'talk'
                    stateChangeFn(prevState, nextState, {}, dispatchSpy)
                  })

                  it('does not call updateActiveEmbed', () => {
                    expect(updateActiveEmbedSpy).not.toHaveBeenCalled()
                  })
                })

                describe('when user is on help center', () => {
                  beforeEach(() => {
                    mockActiveEmbed = 'helpCenterForm'
                  })

                  describe('when user has searched', () => {
                    beforeEach(() => {
                      mockHasSearched = true
                      stateChangeFn(prevState, nextState, {}, dispatchSpy)
                    })

                    it('does not call updateActiveEmbed', () => {
                      expect(updateActiveEmbedSpy).not.toHaveBeenCalled()
                    })
                  })

                  describe('when device is mobile', () => {
                    beforeEach(() => {
                      mockIsMobileBrowser = true
                      stateChangeFn(prevState, nextState, {}, dispatchSpy)
                    })

                    it('does not call updateActiveEmbed', () => {
                      expect(updateActiveEmbedSpy).not.toHaveBeenCalled()
                    })
                  })

                  describe('when device is not mobile and user has not searched', () => {
                    beforeEach(() => {
                      mockIsMobileBrowser = false
                      mockHasSearched = false
                      stateChangeFn(prevState, nextState, {}, dispatchSpy)
                    })

                    it('updates active embed to chat', () => {
                      expect(updateActiveEmbedSpy).toHaveBeenCalledWith('chat')
                    })
                  })
                })
              })
            })
          })

          describe('when the embed is shown and the active embed is not chat', () => {
            beforeEach(() => {
              mockWidgetShown = true
              mockActiveEmbed = 'helpCenterForm'
              mockUserSoundSetting = true

              stateChangeFn(prevState, nextState, {}, dispatchSpy)
            })

            it('does not call mediator', () => {
              expect(broadcastSpy).not.toHaveBeenCalled()
            })
          })

          describe('when the embed is shown and the active embed is chat', () => {
            beforeEach(() => {
              mockWidgetShown = true
              mockActiveEmbed = 'chat'

              stateChangeFn(prevState, nextState, {}, dispatchSpy)
            })

            it('does not dispatch updateActiveEmbed', () => {
              expect(updateActiveEmbedSpy).not.toHaveBeenCalled()
            })

            it('does not call mediator', () => {
              expect(broadcastSpy).not.toHaveBeenCalled()
            })
          })
        })
      })
    })

    describe('onArticleDisplayed', () => {
      const dispatchSpy = jasmine.createSpy('dispatch').and.callThrough()

      beforeEach(() => {
        broadcastSpy.calls.reset()
        dispatchSpy.calls.reset()
      })

      describe('articleDisplayed goes from false to true', () => {
        beforeEach(() => {
          stateChangeFn(false, true, dispatchSpy)
        })

        describe('main widget', () => {
          beforeAll(() => {
            mockIPMWidget = false
          })

          describe('widget is not shown', () => {
            beforeAll(() => {
              mockWidgetShown = false
            })

            it('calls activate', () => {
              expect(activateReceivedSpy).toHaveBeenCalled()
            })
          })

          describe('widget is shown', () => {
            beforeAll(() => {
              mockWidgetShown = true
            })

            it('does not call mediator', () => {
              expect(broadcastSpy).not.toHaveBeenCalled()
            })
          })
        })
      })

      describe('articleDisplayed goes from true to true', () => {
        beforeEach(() => {
          stateChangeFn(true, true, dispatchSpy)
        })

        it('does not call mediator', () => {
          expect(broadcastSpy).not.toHaveBeenCalled()
        })
      })

      describe('articleDisplayed goes from true to false', () => {
        beforeEach(() => {
          stateChangeFn(true, false, dispatchSpy)
        })

        it('does not call mediator', () => {
          expect(broadcastSpy).not.toHaveBeenCalled()
        })
      })
    })

    describe('onChatStatusChange', () => {
      beforeEach(() => {
        broadcastSpy.calls.reset()
        updateActiveEmbedSpy.calls.reset()
      })

      describe('chatStatus goes from online to offline', () => {
        describe('when submit ticket available', () => {
          describe('when chatting', () => {
            beforeEach(() => {
              mockSubmitTicketAvailable = true
              mockIsChatting = true
              mockActiveEmbed = 'chat'
              stateChangeFn('online', 'offline')
            })

            it('does not update active embed', () => {
              expect(updateActiveEmbedSpy).not.toHaveBeenCalled()
            })
          })

          describe('when not chatting', () => {
            describe('when active embed is chat', () => {
              beforeEach(() => {
                mockSubmitTicketAvailable = true
                mockIsChatting = false
                mockActiveEmbed = 'chat'
                stateChangeFn('online', 'offline')
              })

              it('updates active embed to submit ticket', () => {
                expect(updateActiveEmbedSpy).toHaveBeenCalledWith('ticketSubmissionForm')
              })
            })

            describe('when active embed is not chat', () => {
              beforeEach(() => {
                mockSubmitTicketAvailable = true
                mockIsChatting = false
                mockActiveEmbed = 'helpCenterForm'
                stateChangeFn('online', 'offline')
              })

              it('does not update active embed', () => {
                expect(updateActiveEmbedSpy).not.toHaveBeenCalled()
              })
            })

            describe('when window is Popout', () => {
              beforeEach(() => {
                mockSubmitTicketAvailable = true
                mockIsChatting = false
                mockActiveEmbed = 'chat'
                mockIsPopout = true
                stateChangeFn('online', 'offline')
              })

              it('does not update active embed', () => {
                expect(updateActiveEmbedSpy).not.toHaveBeenCalled()
              })
            })

            describe('when window is not Popout', () => {
              beforeEach(() => {
                mockSubmitTicketAvailable = true
                mockIsChatting = false
                mockActiveEmbed = 'chat'
                mockIsPopout = false
                stateChangeFn('online', 'offline')
              })

              it('does update active embed', () => {
                expect(updateActiveEmbedSpy).toHaveBeenCalled()
              })
            })
          })
        })

        describe('when submit ticket not available', () => {
          beforeEach(() => {
            mockSubmitTicketAvailable = false
            stateChangeFn('online', 'offline')
          })

          it('does not update active embed', () => {
            expect(updateActiveEmbedSpy).not.toHaveBeenCalled()
          })
        })
      })
    })

    describe('onChatEnd', () => {
      let actionType

      beforeEach(() => {
        updateActiveEmbedSpy.calls.reset()
        updateBackButtonVisibilitySpy.calls.reset()
        mockIsPopout = false
      })

      describe('when action type is END_CHAT_REQUEST_SUCCESS', () => {
        beforeAll(() => {
          actionType = 'END_CHAT_REQUEST_SUCCESS'
        })

        describe('when not offline', () => {
          beforeEach(() => {
            mockSubmitTicketAvailable = true
            stateChangeFn(null, 'online', { type: actionType })
          })

          it('does not update active embed', () => {
            expect(updateActiveEmbedSpy).not.toHaveBeenCalled()
          })
        })

        describe('when answer bot is available', () => {
          beforeEach(() => {
            mockAnswerBotAvailable = true
            stateChangeFn(null, 'offline', { type: actionType })
          })

          it('updates back button visibility to true', () => {
            expect(updateBackButtonVisibilitySpy).toHaveBeenCalledWith(true)
          })
        })

        describe('when answer bot is not available', () => {
          beforeEach(() => {
            mockIPMWidget = true
            mockAnswerBotAvailable = false
            stateChangeFn(null, 'offline', { type: actionType })
          })

          it('does not update back button visibility', () => {
            expect(updateBackButtonVisibilitySpy).not.toHaveBeenCalledWith(true)
          })
        })

        describe('when submit ticket is not available', () => {
          beforeEach(() => {
            mockSubmitTicketAvailable = false
            stateChangeFn(null, 'offline', { type: actionType })
          })

          it('does not update active embed', () => {
            expect(updateActiveEmbedSpy).not.toHaveBeenCalled()
          })
        })

        describe('when all conditions are met', () => {
          beforeEach(() => {
            mockSubmitTicketAvailable = true
            stateChangeFn(null, 'offline', { type: actionType })
          })

          it('update active embed to submit ticket', () => {
            expect(updateActiveEmbedSpy).toHaveBeenCalledWith('ticketSubmissionForm')
          })
        })
        describe('when screen is Popout', () => {
          beforeEach(() => {
            mockIsPopout = true
            stateChangeFn(null, 'offline', {
              type: actionType
            })
          })

          it('does not update active embed', () => {
            expect(updateActiveEmbedSpy).not.toHaveBeenCalledWith('ticketSubmissionForm')
          })
        })
      })

      describe('when action type is not END_CHAT_REQUEST_SUCCESS', () => {
        beforeAll(() => {
          actionType = 'yolo'
        })

        beforeEach(() => {
          stateChangeFn(null, null, { type: actionType })
        })

        it('does not update active embed', () => {
          expect(updateActiveEmbedSpy).not.toHaveBeenCalled()
        })
      })
    })

    describe('onVisitorUpdate', () => {
      let action, dispatchSpy, avatarPath

      beforeEach(() => {
        dispatchSpy = jasmine.createSpy('dispatch')

        stateChangeFn({}, {}, action, dispatchSpy)
      })

      describe('when the type of action is SDK_VISITOR_UPDATE', () => {
        describe('when the user is authenticated to a social media', () => {
          beforeAll(() => {
            avatarPath = 'www.terence.com/myAvatar.jpeg'

            action = {
              type: 'SDK_VISITOR_UPDATE',
              payload: {
                detail: {
                  auth: {
                    avatar$string: avatarPath,
                    type$string: 'facebook'
                  }
                }
              }
            }
          })

          it('calls dispatch with expected args', () => {
            const expected = {
              type: 'CHAT_SOCIAL_LOGIN_SUCCESS',
              payload: avatarPath
            }

            expect(dispatchSpy).toHaveBeenCalledWith(expected)
          })
        })

        describe('when the user is not authenticated to a social media', () => {
          beforeAll(() => {
            avatarPath = 'www.terence.com/myAvatar.jpeg'

            action = {
              type: 'SDK_VISITOR_UPDATE',
              payload: {
                detail: {
                  auth: {
                    avatar$string: avatarPath,
                    type$string: 'zopim'
                  }
                }
              }
            }
          })

          it('does not call dispatch', () => {
            expect(dispatchSpy).not.toHaveBeenCalled()
          })
        })
      })

      describe('when the type of action is not SDK_VISITOR_UPDATE', () => {
        beforeAll(() => {
          avatarPath = 'www.terence.com/myAvatar.jpeg'

          action = {
            type: 'END_CHAT_REQUEST_SUCCESS',
            payload: {
              detail: {
                auth: {
                  avatar$string: avatarPath,
                  verified$bool: true
                }
              }
            }
          }
        })

        it('does not call dispatch', () => {
          expect(dispatchSpy).not.toHaveBeenCalled()
        })
      })
    })

    describe('onChatStarted', () => {
      let prevState, currState, dispatchSpy

      beforeEach(() => {
        dispatchSpy = jasmine.createSpy('dispatch').and.callThrough()
        updateBackButtonVisibilitySpy.calls.reset()
      })

      describe('when chat has previously initiated', () => {
        beforeEach(() => {
          prevState = { isChatting: true }
          currState = { isChatting: true }

          stateChangeFn(prevState, currState, {}, dispatchSpy)
        })

        it('does not call handleIsChatting', () => {
          expect(handleIsChattingSpy).not.toHaveBeenCalled()
        })
      })

      describe('when chat has not been previously initiated', () => {
        beforeAll(() => {
          prevState = { isChatting: false }
        })

        describe('when chat is being initiated', () => {
          beforeEach(() => {
            currState = { isChatting: true }

            stateChangeFn(prevState, currState, {}, dispatchSpy)
          })

          it('calls chatStarted', () => {
            expect(chatStartedSpy).toHaveBeenCalled()
          })
        })

        describe('when chat is being initiated and answer bot is available', () => {
          beforeEach(() => {
            currState = { isChatting: true }
            mockAnswerBotAvailable = true

            stateChangeFn(prevState, currState, {}, dispatchSpy)
          })

          it('dispatches updateBackButtonVisibility with false', () => {
            expect(updateBackButtonVisibilitySpy).toHaveBeenCalledWith(false)
          })
        })

        describe('when chat is being initiated and answer bot is not available', () => {
          beforeEach(() => {
            currState = { isChatting: true }
            mockAnswerBotAvailable = false

            stateChangeFn(prevState, currState, {}, dispatchSpy)
          })

          it('does not dispatch updateBackButtonVisibility', () => {
            expect(updateBackButtonVisibilitySpy).not.toHaveBeenCalled()
          })
        })

        describe('when chat is not being initiated', () => {
          beforeEach(() => {
            currState = { isChatting: false }

            stateChangeFn(prevState, currState, {}, dispatchSpy)
          })

          it('does not dispatch the event CHAT_STARTED', () => {
            expect(dispatchSpy).not.toHaveBeenCalledWith({
              type: 'CHAT_STARTED'
            })
          })

          it('does not dispatch updateBackButtonVisibility', () => {
            expect(updateBackButtonVisibilitySpy).not.toHaveBeenCalled()
          })
        })
      })
    })

    describe('onUpdateEmbeddableConfig', () => {
      beforeEach(() => {
        resetShouldWarnSpy.calls.reset()
      })

      describe('when the action is not UPDATE_EMBEDDABLE_CONFIG', () => {
        beforeEach(() => {
          const action = {
            type: 'NOT_UPDATE_EMBEDDABLE_CONFIG',
            payload: {
              newChat: false
            }
          }

          stateChangeFn(null, null, action)
        })

        it('does not call resetShouldWarn', () => {
          expect(resetShouldWarnSpy).not.toHaveBeenCalled()
        })
      })

      describe('when the action is UPDATE_EMBEDDABLE_CONFIG', () => {
        describe('when newChat is not on', () => {
          beforeEach(() => {
            const action = {
              type: 'UPDATE_EMBEDDABLE_CONFIG',
              payload: {
                newChat: false
              }
            }

            stateChangeFn(null, null, action)
          })

          it('calls resetShouldWarn', () => {
            expect(resetShouldWarnSpy).toHaveBeenCalled()
          })
        })

        describe('when newChat is true', () => {
          beforeEach(() => {
            const action = {
              type: 'UPDATE_EMBEDDABLE_CONFIG',
              payload: {
                newChat: true
              }
            }

            stateChangeFn(null, null, action)
          })

          it('does not call resetShouldWarn', () => {
            expect(resetShouldWarnSpy).not.toHaveBeenCalled()
          })
        })
      })
    })
  })

  describe('onLastReadTimestampChange', () => {
    let prevState = { lastReadTimestamp: 100 },
      nextState = { lastReadTimestamp: 100 }

    describe('if timestamps are equal', () => {
      beforeEach(() => {
        stateChangeFn(prevState, nextState, {})
      })

      it('does not dispatch chatNotificationReset', () => {
        expect(chatNotificationResetSpy).not.toHaveBeenCalled()
      })
    })

    describe('if timestamps are different', () => {
      beforeAll(() => {
        nextState.lastReadTimestamp = 102
      })

      describe('if there are unseen messages', () => {
        beforeEach(() => {
          mockHasUnseenAgentMessage = true

          stateChangeFn(prevState, nextState, {})
        })

        it('does not dispatch chatNotificationReset', () => {
          expect(chatNotificationResetSpy).not.toHaveBeenCalled()
        })
      })

      describe('if there are no unseen messages', () => {
        beforeEach(() => {
          mockHasUnseenAgentMessage = false

          stateChangeFn(prevState, nextState, {})
        })

        it('does dispatch chatNotificationReset', () => {
          expect(chatNotificationResetSpy).toHaveBeenCalled()
        })
      })
    })
  })

  describe('onCookiePermissionsChange', () => {
    afterEach(() => {
      storeEnableSpy.calls.reset()
      storeDisableSpy.calls.reset()
      setUpChatSpy.calls.reset()
    })

    describe('when the action is UPDATE_SETTINGS', () => {
      let mockAction = { type: 'UPDATE_SETTINGS' },
        prevState

      describe('when the previous cookie value was true', () => {
        beforeEach(() => {
          prevState = true
          mockCookiesDisabled = false
        })

        describe('when cookie permission is denied', () => {
          beforeEach(() => {
            mockAction = {
              type: 'UPDATE_SETTINGS',
              payload: { webWidget: { cookies: false } }
            }

            stateChangeFn(prevState, null, mockAction)
          })

          it('disables and clears the localStorage', () => {
            expect(storeDisableSpy).toHaveBeenCalled()
          })
        })
      })

      describe('when the previous cookie value was false', () => {
        beforeEach(() => {
          prevState = false
          mockCookiesDisabled = true
        })

        describe('when cookie permission is given', () => {
          beforeEach(() => {
            mockAction = {
              type: 'UPDATE_SETTINGS',
              payload: { webWidget: { cookies: true } }
            }

            stateChangeFn(prevState, null, mockAction)
          })

          it('it enables localStorage', () => {
            expect(storeEnableSpy).toHaveBeenCalled()
          })

          describe('when chat is enabled and not connected', () => {
            beforeEach(() => {
              mockChatEnabled = true
              setUpChatSpy.calls.reset()

              stateChangeFn(prevState, false, mockAction)
            })

            it('calls setUpChat', () => {
              expect(setUpChatSpy).toHaveBeenCalled()
            })
          })

          describe('when chat is already connected', () => {
            beforeEach(() => {
              setUpChatSpy.calls.reset()

              stateChangeFn(prevState, true, mockAction)
            })

            it('does not call setUpChat', () => {
              expect(setUpChatSpy).not.toHaveBeenCalled()
            })
          })

          describe('when chat is not enabled', () => {
            beforeEach(() => {
              mockChatEnabled = false
              setUpChatSpy.calls.reset()

              stateChangeFn(prevState, false, mockAction)
            })

            it('does not call setUpChat', () => {
              expect(setUpChatSpy).not.toHaveBeenCalled()
            })
          })
        })
      })
    })

    describe('when the action is anything else', () => {
      const mockAction = { type: 'DERP DERP' }

      beforeEach(() => {
        mockCookiesDisabled = true

        stateChangeFn(null, null, mockAction)
      })

      it('does nothing', () => {
        expect(storeDisableSpy).not.toHaveBeenCalled()
        expect(storeEnableSpy).not.toHaveBeenCalled()
      })
    })
  })
})
