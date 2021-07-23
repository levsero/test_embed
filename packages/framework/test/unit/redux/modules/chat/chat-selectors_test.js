describe('chat selectors', () => {
  let selectors,
    mockConciergeOverideSettings,
    mockSettingsChatTitle,
    mockSettingsChatOfflineForm,
    mockSettingsPrechatForm,
    mockTranslation,
    mockBadgeSettings,
    mockIsDefaultNickname,
    CHATTING_SCREEN,
    CHAT_MESSAGE_EVENTS,
    CHAT_SYSTEM_EVENTS,
    CHAT_CUSTOM_MESSAGE_EVENTS,
    EDIT_CONTACT_DETAILS_SCREEN,
    DEPARTMENT_STATUSES,
    WHITELISTED_SOCIAL_LOGINS,
    AGENT_BOT,
    CONNECTION_STATUSES,
    mockIsPopout = false,
    mockLauncherVisible = false

  beforeEach(() => {
    mockery.enable()

    const chatConstantsPath = basePath('src/constants/chat')

    CHAT_SYSTEM_EVENTS = requireUncached(chatConstantsPath).CHAT_SYSTEM_EVENTS
    EDIT_CONTACT_DETAILS_SCREEN = requireUncached(chatConstantsPath).EDIT_CONTACT_DETAILS_SCREEN
    CHAT_MESSAGE_EVENTS = requireUncached(chatConstantsPath).CHAT_MESSAGE_EVENTS
    CHAT_CUSTOM_MESSAGE_EVENTS = requireUncached(chatConstantsPath).CHAT_CUSTOM_MESSAGE_EVENTS
    AGENT_BOT = requireUncached(chatConstantsPath).AGENT_BOT
    DEPARTMENT_STATUSES = requireUncached(chatConstantsPath).DEPARTMENT_STATUSES
    WHITELISTED_SOCIAL_LOGINS = requireUncached(chatConstantsPath).WHITELISTED_SOCIAL_LOGINS
    CONNECTION_STATUSES = requireUncached(chatConstantsPath).CONNECTION_STATUSES
    CHATTING_SCREEN = 'chatlog'

    initMockRegistry({
      'src/constants/chat': {
        CHAT_MESSAGE_EVENTS,
        CHAT_SYSTEM_EVENTS,
        CHAT_CUSTOM_MESSAGE_EVENTS,
        EDIT_CONTACT_DETAILS_SCREEN,
        AGENT_BOT,
        DEPARTMENT_STATUSES,
        WHITELISTED_SOCIAL_LOGINS,
        CONNECTION_STATUSES,
      },
      './chat-screen-types': {
        CHATTING_SCREEN,
      },
      'src/redux/modules/base/base-selectors': {
        getActiveEmbed: (state) => state.base.embed,
        getWidgetShown: (state) => state.base.widgetShown,
        getLocale: () => 'en-US',
        getLauncherVisible: () => mockLauncherVisible,
      },
      'src/redux/modules/settings/settings-selectors': {
        getSettingsChatDepartmentsEnabled: (state) =>
          _.get(state, 'settings.chat.departments.enabled', []),
        getSettingsChatDepartment: (state) => _.get(state, 'settings.chat.department', ''),
        getSettingsChatConcierge: (state) =>
          _.get(state, 'settings.chat.concierge', mockConciergeOverideSettings),
        getSettingsChatTitle: () => mockSettingsChatTitle,
        getSettingsChatOfflineForm: () => mockSettingsChatOfflineForm,
        getSettingsChatPrechatForm: () => mockSettingsPrechatForm,
        getSettingsChatProfileCard: _.identity,
        getSettingsLauncherBadge: () => mockBadgeSettings,
      },
      'src/apps/webWidget/services/i18n': {
        i18n: {
          t: _.identity,
          getSettingTranslation: () => mockTranslation,
        },
      },
      'src/embeds/webWidget/selectors/feature-flags': () => false,
      'src/util/chat': {
        isDefaultNickname: () => mockIsDefaultNickname,
      },
      'src/util/devices': {},
      'src/util/globals': {
        isPopout: () => mockIsPopout,
      },
    })

    const selectorsPath = buildSrcPath('redux/modules/chat/chat-selectors')

    mockery.registerAllowable(selectorsPath)

    selectors = requireUncached(selectorsPath)
  })

  afterEach(() => {
    mockery.deregisterAll()
    mockery.disable()
  })

  describe('getChatBadgeEnabled', () => {
    let result

    beforeEach(() => {
      result = selectors.getChatBadgeEnabled({
        chat: {
          accountSettings: {
            banner: {
              enabled: true,
            },
          },
        },
      })
    })

    it('returns the value of banner.enabled', () => {
      expect(result).toEqual(true)
    })
  })

  describe('getIsLoggingOut', () => {
    let result

    beforeEach(() => {
      result = selectors.getIsLoggingOut({
        chat: {
          isLoggingOut: true,
        },
      })
    })

    it('returns true', () => {
      expect(result).toEqual(true)
    })
  })

  describe('getDepartments', () => {
    let mockDepartments, result

    beforeEach(() => {
      mockDepartments = {
        someDepartment: {
          status: 'online',
        },
      }

      result = selectors.getDepartments({
        chat: {
          departments: mockDepartments,
        },
      })
    })

    it('returns the departments', () => {
      expect(result).toEqual(mockDepartments)
    })
  })

  describe('getDepartmentsList', () => {
    let mockDepartments, result

    beforeEach(() => {
      mockDepartments = [{ status: 'online' }]

      result = selectors.getDepartmentsList({
        chat: {
          departments: mockDepartments,
        },
      })
    })

    it('returns the departments', () => {
      expect(result).toEqual(mockDepartments)
    })
  })

  describe('getIsAuthenticated', () => {
    let result

    beforeEach(() => {
      result = selectors.getIsAuthenticated({
        chat: {
          isAuthenticated: true,
        },
      })
    })

    it('returns if user is authenticated', () => {
      expect(result).toEqual(true)
    })
  })

  describe('getRatingSettings', () => {
    let result
    const ratingSettings = { enabled: true }
    const mockChatSettings = {
      chat: {
        accountSettings: {
          rating: ratingSettings,
        },
      },
    }

    beforeEach(() => {
      result = selectors.getRatingSettings(mockChatSettings)
    })

    it('returns the value of accountSettings.rating', () => {
      expect(result).toEqual(ratingSettings)
    })
  })

  describe('getQueuePosition', () => {
    let result
    const queuePosition = 3
    const mockChatSettings = {
      chat: {
        queuePosition,
      },
    }

    beforeEach(() => {
      result = selectors.getQueuePosition(mockChatSettings)
    })

    it('returns the value of chat.queuePosition', () => {
      expect(result).toEqual(queuePosition)
    })
  })

  describe('getIsChatting', () => {
    let result
    const mockChatSettings = {
      chat: {
        is_chatting: true,
      },
    }

    beforeEach(() => {
      result = selectors.getIsChatting(mockChatSettings)
    })

    it('returns the current state of is_chatting', () => {
      expect(result).toEqual(true)
    })
  })

  describe('getEmailTranscript', () => {
    let result
    const mockChatSettings = {
      chat: {
        emailTranscript: {
          status: 'some_status',
          email: 'someemail@email.com',
        },
      },
    }

    beforeEach(() => {
      result = selectors.getEmailTranscript(mockChatSettings)
    })

    it('returns the current state of emailTranscript', () => {
      expect(result).toEqual({
        status: 'some_status',
        email: 'someemail@email.com',
      })
    })
  })

  describe('getChatVisitor', () => {
    let result
    const visitor = 'Batman'
    const mockChatSettings = {
      chat: {
        visitor,
      },
    }

    beforeEach(() => {
      result = selectors.getChatVisitor(mockChatSettings)
    })

    it('returns the current state of chat.visitor', () => {
      expect(result).toEqual(visitor)
    })
  })

  describe('getConnection', () => {
    let result
    const mockChatSettings = {
      chat: {
        connection: 'connected',
      },
    }

    beforeEach(() => {
      result = selectors.getConnection(mockChatSettings)
    })

    it('returns the current state of connection', () => {
      expect(result).toEqual('connected')
    })
  })

  describe('getChatStatus', () => {
    let result
    const mockChatSettings = {
      chat: {
        account_status: 'online',
      },
    }

    beforeEach(() => {
      result = selectors.getChatStatus(mockChatSettings)
    })

    it('returns the current state of account_status', () => {
      expect(result).toEqual('online')
    })
  })

  describe('getChatMessagesFromAgents', () => {
    let result
    const mockChats = [
      { nick: 'agent:123', type: 'chat.msg' },
      { nick: 'user', type: 'chat.msg' },
    ]
    const mockChatSettings = {
      chat: {
        chats: { values: () => mockChats },
      },
    }

    beforeEach(() => {
      result = selectors.getChatMessagesFromAgents(mockChatSettings)
    })

    it('returns the chats from only agents', () => {
      expect(result.length).toEqual(1)

      expect(result[0].nick).toEqual('agent:123')
    })
  })

  describe('getChatOnline', () => {
    let result,
      mockState = {
        chat: {},
      }

    beforeEach(() => {
      result = selectors.getChatOnline(mockState)
    })

    describe('status has not forcefully modified', () => {
      beforeAll(() => {
        mockState.chat.forcedStatus = null
      })

      describe('when the agent is online', () => {
        beforeAll(() => {
          mockState.chat.account_status = 'online'
        })

        it('returns true', () => {
          expect(result).toEqual(true)
        })
      })

      describe('when the agent is away', () => {
        beforeAll(() => {
          mockState.chat.account_status = 'away'
        })

        it('returns true', () => {
          expect(result).toEqual(true)
        })
      })

      describe('when the agent is offline', () => {
        beforeAll(() => {
          mockState.chat.account_status = 'offline'
        })

        it('returns false', () => {
          expect(result).toEqual(false)
        })
      })
    })

    describe('forcefully set status to online', () => {
      beforeAll(() => {
        mockState.chat.forcedStatus = 'online'
      })

      it('returns true', () => {
        expect(result).toEqual(true)
      })
    })

    describe('forcefully set status to offline', () => {
      beforeAll(() => {
        mockState.chat.forcedStatus = 'offline'
      })

      it('returns false', () => {
        expect(result).toEqual(false)
      })
    })
  })

  describe('getChatRating', () => {
    let result
    const mockChatSettings = {
      chat: {
        rating: 'good',
      },
    }

    beforeEach(() => {
      result = selectors.getChatRating(mockChatSettings)
    })

    it('returns the current state of rating', () => {
      expect(result).toEqual('good')
    })
  })

  describe('getActiveAgents', () => {
    let result
    const mockChatSettings = {
      chat: {
        activeAgents: new Map([
          ['agent:123', { nick: 'agent:123' }],
          ['agent:trigger', { nick: 'agent:trigger' }],
        ]),
      },
    }

    beforeEach(() => {
      result = selectors.getActiveAgents(mockChatSettings)
    })

    it('returns the current state of agents with triggers filtered out', () => {
      expect(result).toEqual({
        'agent:123': { nick: 'agent:123' },
      })
    })
  })

  describe('getChatScreen', () => {
    let result
    const mockChatSettings = {
      chat: {
        screen: 'chatting',
      },
    }

    beforeEach(() => {
      result = selectors.getChatScreen(mockChatSettings)
    })

    it('returns the current state of screen', () => {
      expect(result).toEqual('chatting')
    })
  })

  describe('getCurrentMessage', () => {
    let result
    const mockChatSettings = {
      chat: {
        currentMessage: 'printer is on fire',
      },
    }

    beforeEach(() => {
      result = selectors.getCurrentMessage(mockChatSettings)
    })

    it('returns the current state of currentMessage', () => {
      expect(result).toEqual('printer is on fire')
    })
  })

  describe('getAttachmentsEnabled', () => {
    let result
    const mockEnabled = true
    const mockChatSettings = {
      chat: {
        accountSettings: {
          attachments: {
            enabled: mockEnabled,
          },
        },
      },
    }

    beforeEach(() => {
      result = selectors.getAttachmentsEnabled(mockChatSettings)
    })

    it('returns the current state of attachmentsEnabled', () => {
      expect(result).toEqual(mockEnabled)
    })
  })

  describe('getNotificationCount', () => {
    let result
    const mockChatSettings = {
      chat: {
        notification: {
          count: 123,
        },
      },
    }

    beforeEach(() => {
      result = selectors.getNotificationCount(mockChatSettings)
    })

    it("returns the current state of the notification's count", () => {
      expect(result).toEqual(123)
    })
  })

  describe('getShowRatingScreen', () => {
    let result, mockState

    beforeEach(() => {
      mockState = {
        chat: {
          rating: {
            value: null,
            comment: null,
          },
          accountSettings: {
            rating: {
              enabled: true,
            },
          },
          activeAgents: ['agent_1'],
        },
      }
    })

    describe('when a rating has been submitted', () => {
      beforeEach(() => {
        mockState.chat.rating.value = 'good'
        result = selectors.getShowRatingScreen(mockState)
      })

      it('returns false', () => {
        expect(result).toBe(false)
      })
    })

    describe('when ratings are disabled', () => {
      beforeEach(() => {
        mockState.chat.accountSettings.rating.enabled = false
        result = selectors.getShowRatingScreen(mockState)
      })

      it('returns false', () => {
        expect(result).toBe(false)
      })
    })

    describe('when there are no agents in the chat', () => {
      beforeEach(() => {
        mockState.chat.activeAgents = []
        result = selectors.getShowRatingScreen(mockState)
      })

      it('returns false', () => {
        expect(result).toBe(false)
      })
    })

    describe('when ratings.disableEndScreen is true', () => {
      beforeEach(() => {
        mockState.chat.rating.disableEndScreen = true
        result = selectors.getShowRatingScreen(mockState)
      })

      it('returns false', () => {
        expect(result).toBe(false)
      })
    })

    describe('when a rating has not been submitted, ratings are enabled and there are agents in the chat', () => {
      beforeEach(() => {
        result = selectors.getShowRatingScreen(mockState)
      })

      it('returns true', () => {
        expect(result).toBe(true)
      })
    })
  })

  describe('getChatOfflineForm', () => {
    let result, mockChatSettings

    beforeEach(() => {
      mockChatSettings = {
        chat: {
          formState: {
            offlineForm: {
              name: 'Sizuki',
              phone: '123456789',
              email: 'foo@bar.com',
              message: 'baz',
            },
          },
        },
      }
      result = selectors.getChatOfflineForm(mockChatSettings)
    })

    it("returns the current state of the notification's count", () => {
      expect(result).toEqual(mockChatSettings.chat.formState.offlineForm)
    })
  })

  describe('getShowOfflineChat', () => {
    let result, mockState

    beforeEach(() => {
      mockState = {
        chat: {
          rating: {
            value: 'good',
            comment: null,
          },
          accountSettings: {
            rating: {
              enabled: true,
            },
          },
          is_chatting: false,
          account_status: 'offline',
          chats: { values: () => [{}, {}] },
          activeAgents: ['agent_1'],
          isLoggingOut: false,
        },
      }
    })

    describe('when user is logging out', () => {
      beforeEach(() => {
        mockState.chat.isLoggingOut = true
        result = selectors.getShowOfflineChat(mockState)
      })

      it('returns false', () => {
        expect(result).toBe(false)
      })
    })

    describe('when chat is online', () => {
      beforeEach(() => {
        mockState.chat.account_status = 'online'
        result = selectors.getShowOfflineChat(mockState)
      })

      it('returns false', () => {
        expect(result).toBe(false)
      })
    })

    describe('when isChatting is true', () => {
      beforeEach(() => {
        mockState.chat.is_chatting = true
        result = selectors.getShowOfflineChat(mockState)
      })

      it('returns false', () => {
        expect(result).toBe(false)
      })
    })

    describe('when a rating has not been left', () => {
      beforeEach(() => {
        mockState.chat.rating.value = null
        result = selectors.getShowOfflineChat(mockState)
      })

      it('returns false', () => {
        expect(result).toBe(false)
      })
    })

    describe('when chat is offline, isChatting is true, not logging out, and a rating has been left', () => {
      beforeEach(() => {
        result = selectors.getShowOfflineChat(mockState)
      })

      it('returns true', () => {
        expect(result).toBe(true)
      })
    })
  })

  describe('getPreChatFormState', () => {
    let result
    const formState = 'form state'
    const mockChatSettings = {
      chat: {
        formState: {
          preChatForm: formState,
        },
      },
    }

    beforeEach(() => {
      result = selectors.getPreChatFormState(mockChatSettings)
    })

    it('returns the current state of the pre chat form', () => {
      expect(result).toEqual(formState)
    })
  })

  describe('getOperatingHours', () => {
    let result
    const operatingHoursPayload = { account_schedule: [[456]] }
    const mockOperatingHours = {
      chat: {
        operatingHours: operatingHoursPayload,
      },
    }

    beforeEach(() => {
      result = selectors.getOperatingHours(mockOperatingHours)
    })

    it('returns the current state of operatingHours', () => {
      expect(result).toEqual(operatingHoursPayload)
    })
  })

  describe('getGroupedOperatingHours', () => {
    describe('when operating hours are enabled in account settings', () => {
      let result
      const operatingHoursPayload = {
        department_schedule: {
          123: [[456]],
        },
      }
      const mockState = {
        chat: {
          operatingHours: operatingHoursPayload,
          departments: [
            {
              name: 'Design',
              id: 123,
            },
          ],
          accountSettings: {
            operatingHours: {
              display_notice: true,
            },
          },
        },
      }

      beforeEach(() => {
        result = selectors.getGroupedOperatingHours(mockState)
      })

      it('returns the current state of operatingHours', () => {
        const expected = {
          department_schedule: [
            {
              name: 'Design',
              id: 123,
              schedule: [[456]],
            },
          ],
        }

        expect(result).toEqual(expected)
      })
    })
    describe('when operating hours are not enabled in account settings', () => {
      let result
      const mockState = {
        chat: {
          operatingHours: [],
          accountSettings: {
            operatingHours: {
              display_notice: false,
            },
          },
        },
      }

      beforeEach(() => {
        result = selectors.getGroupedOperatingHours(mockState)
      })

      it('returns an object with enabled: false', () => {
        const expected = {
          enabled: false,
        }

        expect(result).toEqual(expected)
      })
    })
  })

  describe('getOfflineMessage', () => {
    let result, mockChatSettings

    beforeEach(() => {
      mockChatSettings = {
        chat: {
          offlineMessage: {
            message: {},
            screen: 'main',
          },
        },
      }
      result = selectors.getOfflineMessage(mockChatSettings)
    })

    it('returns the current state of the offlineMessage', () => {
      expect(result).toEqual(mockChatSettings.chat.offlineMessage)
    })
  })

  describe('getLastReadTimestamp', () => {
    let result
    const mockState = {
      chat: {
        lastReadTimestamp: 12345,
      },
    }

    beforeEach(() => {
      result = selectors.getLastReadTimestamp(mockState)
    })

    it('returns the current state of lastReadTimestamp', () => {
      expect(result).toEqual(12345)
    })
  })

  describe('getLoginSettings', () => {
    let result
    const login = 'login_value'
    const mockState = {
      chat: {
        accountSettings: {
          login,
        },
      },
    }

    beforeEach(() => {
      result = selectors.getLoginSettings(mockState)
    })

    it('returns the current state of login', () => {
      expect(result).toBe(login)
    })
  })

  describe('getStandaloneMobileNotificationVisible', () => {
    let result
    const mockState = {
      chat: {
        standaloneMobileNotificationVisible: true,
      },
    }

    beforeEach(() => {
      result = selectors.getStandaloneMobileNotificationVisible(mockState)
    })

    it('retuns the current state of standaloneMobileNotificationVisible', () => {
      expect(result).toBe(true)
    })
  })

  describe('getIsProactiveSession', () => {
    let result
    let createSession = (...chats) => {
      let mockState = { chat: { chats: new Map(chats) } }

      return selectors.getIsProactiveSession(mockState)
    }

    describe('no visitor interaction', () => {
      describe('only agent messages', () => {
        beforeEach(() => {
          result = createSession([
            1,
            { nick: 'agent:007', type: CHAT_MESSAGE_EVENTS.CHAT_EVENT_MSG },
          ])
        })

        it('returns true', () => {
          expect(result).toEqual(true)
        })
      })

      describe('no agent messages', () => {
        beforeEach(() => {
          result = createSession()
        })

        it('returns false', () => {
          expect(result).toEqual(false)
        })
      })
    })

    describe('has visitor interaction', () => {
      describe('message chat type', () => {
        beforeEach(() => {
          result = createSession([
            1,
            { nick: 'visitor:007', type: CHAT_MESSAGE_EVENTS.CHAT_EVENT_MSG },
          ])
        })

        it('returns false', () => {
          expect(result).toEqual(false)
        })
      })

      describe('includes member join', () => {
        describe('followed by visitor message', () => {
          beforeEach(() => {
            result = createSession(
              [
                1,
                {
                  nick: 'visitor:007',
                  type: CHAT_SYSTEM_EVENTS.CHAT_EVENT_MEMBERJOIN,
                },
              ],
              [
                2,
                {
                  nick: 'visitor:007',
                  type: CHAT_MESSAGE_EVENTS.CHAT_EVENT_MSG,
                },
              ]
            )
          })

          it('returns false', () => {
            expect(result).toEqual(false)
          })
        })

        describe('followed by agent message', () => {
          beforeEach(() => {
            result = createSession(
              [
                1,
                {
                  nick: 'visitor:007',
                  type: CHAT_SYSTEM_EVENTS.CHAT_EVENT_MEMBERJOIN,
                },
              ],
              [2, { nick: 'agent:007', type: CHAT_MESSAGE_EVENTS.CHAT_EVENT_MSG }]
            )
          })

          it('returns true', () => {
            expect(result).toEqual(true)
          })
        })
      })

      describe('multiple sessions', () => {
        describe('agent messages after visitor leaves', () => {
          beforeEach(() => {
            result = createSession(
              [
                1,
                {
                  nick: 'visitor:007',
                  type: CHAT_SYSTEM_EVENTS.CHAT_EVENT_MEMBERJOIN,
                },
              ],
              [
                2,
                {
                  nick: 'visitor:007',
                  type: CHAT_MESSAGE_EVENTS.CHAT_EVENT_MSG,
                },
              ],
              [
                3,
                {
                  nick: 'visitor:007',
                  type: CHAT_MESSAGE_EVENTS.CHAT_EVENT_MSG,
                },
              ],
              [4, { nick: 'agent:007', type: CHAT_MESSAGE_EVENTS.CHAT_EVENT_MSG }],
              [
                5,
                {
                  nick: 'visitor:007',
                  type: CHAT_SYSTEM_EVENTS.CHAT_EVENT_MEMBERLEAVE,
                },
              ],
              [6, { nick: 'agent:007', type: CHAT_MESSAGE_EVENTS.CHAT_EVENT_MSG }]
            )
          })

          it('returns true', () => {
            expect(result).toEqual(true)
          })
        })

        describe('no message after visitor leaves', () => {
          beforeEach(() => {
            result = createSession(
              [
                1,
                {
                  nick: 'visitor:007',
                  type: CHAT_SYSTEM_EVENTS.CHAT_EVENT_MEMBERJOIN,
                },
              ],
              [
                2,
                {
                  nick: 'visitor:007',
                  type: CHAT_MESSAGE_EVENTS.CHAT_EVENT_MSG,
                },
              ],
              [
                3,
                {
                  nick: 'visitor:007',
                  type: CHAT_MESSAGE_EVENTS.CHAT_EVENT_MSG,
                },
              ],
              [4, { nick: 'agent:007', type: CHAT_MESSAGE_EVENTS.CHAT_EVENT_MSG }],
              [
                5,
                {
                  nick: 'visitor:007',
                  type: CHAT_SYSTEM_EVENTS.CHAT_EVENT_MEMBERLEAVE,
                },
              ]
            )
          })

          it('returns false', () => {
            expect(result).toEqual(false)
          })
        })
      })
    })
  })

  describe('getAgentsTyping', () => {
    let result, mockState

    beforeEach(() => {
      result = selectors.getAgentsTyping(mockState)
    })

    describe('when the state does not contain any entries', () => {
      beforeAll(() => {
        mockState = {
          chat: {
            activeAgents: new Map(),
          },
        }
      })

      it('returns an empty array', () => {
        expect(result).toEqual([])
      })
    })

    describe('when the state contains agents that are typing', () => {
      beforeAll(() => {
        mockState = {
          chat: {
            activeAgents: new Map([
              ['agent:123', { nick: 'agent:123', typing: true }],
              ['agent:456', { nick: 'agent:456', typing: true }],
              ['agent:789', { nick: 'agent:789', typing: false }],
            ]),
          },
        }
      })

      it('returns a collection of the typing agents', () => {
        const expected = [
          { nick: 'agent:123', typing: true },
          { nick: 'agent:456', typing: true },
        ]

        expect(result).toEqual(expected)
      })
    })

    describe('when the state contains a message entry from a bot', () => {
      beforeAll(() => {
        mockState = {
          chat: {
            activeAgents: new Map([
              ['agent:456', { nick: 'agent:456', typing: true }],
              ['agent:trigger', { nick: 'agent:trigger', typing: true }],
            ]),
          },
        }
      })

      it('returns a collection containing only human agents', () => {
        const expected = [{ nick: 'agent:456', typing: true }]

        expect(result).toEqual(expected)
      })
    })
  })

  describe('getAllAgents', () => {
    let result, inactiveAgents
    const activeAgents = new Map([
      ['agent:terence', { display_name: 'Terence Liew' }],
      ['agent:apoorv', { display_name: 'Apoorv' }],
    ])

    inactiveAgents = {
      'agent:sonic': { display_name: 'A. D. Ciotto' },
      'agent:bcoppard': { display_name: 'B. C.' },
    }

    const mockChatSettings = {
      chat: { activeAgents, inactiveAgents },
    }

    beforeEach(() => {
      result = selectors.getAllAgents(mockChatSettings)
    })

    it('returns all agents in the current state', () => {
      const expected = {
        'agent:terence': { display_name: 'Terence Liew' },
        'agent:apoorv': { display_name: 'Apoorv' },
        ...inactiveAgents,
      }

      expect(result).toEqual(expected)
    })
  })

  describe('getFirstMessageTimestamp', () => {
    let result,
      mockChatSettings = {
        chat: {
          chats: new Map([
            [1, { timestamp: 1 }],
            [2, { timestamp: 2 }],
          ]),
        },
      }

    beforeEach(() => {
      result = selectors.getFirstMessageTimestamp(mockChatSettings)
    })

    it('returns the first chat message timestamp', () => {
      expect(result).toEqual(1)
    })

    describe('no chats', () => {
      beforeEach(() => {
        result = selectors.getFirstMessageTimestamp({
          chat: { chats: new Map() },
        })
      })

      it('returns null', () => {
        expect(result).toBeNull
      })
    })
  })

  describe('getSocialLogin', () => {
    let result,
      mockChatSettings = {
        chat: {
          socialLogin: {
            authenticated: false,
            authUrls: {},
            screen: '',
            avatarPath: '',
          },
        },
      }

    beforeEach(() => {
      result = selectors.getSocialLogin(mockChatSettings)
    })

    it('returns the current state of socialLogin', () => {
      expect(result).toEqual(mockChatSettings.chat.socialLogin)
    })
  })

  describe('getAuthUrls', () => {
    let result, mockChatSettings

    beforeEach(() => {
      result = selectors.getAuthUrls(mockChatSettings)
    })

    describe('when there are no enabled social media', () => {
      beforeAll(() => {
        mockChatSettings = {
          chat: {
            isAuthenticated: true,
            accountSettings: {
              login: {
                loginTypes: {
                  facebook: true,
                  google: true,
                },
              },
            },
            vendor: {
              zChat: {
                getAuthLoginUrl: (socialMedia) => `www.foo.com/${socialMedia}/bar-baz`,
              },
            },
          },
        }
      })

      it('returns an empty object', () => {
        expect(result).toEqual({})
      })
    })

    describe('when the user is authenticated', () => {
      beforeAll(() => {
        mockChatSettings = {
          chat: {
            accountSettings: {
              login: {
                loginTypes: {},
              },
            },
            vendor: {
              zChat: {
                getAuthLoginUrl: (socialMedia) => `www.foo.com/${socialMedia}/bar-baz`,
              },
            },
          },
        }
      })

      it('returns an empty object', () => {
        expect(result).toEqual({})
      })
    })

    describe('when there are enabled social medias', () => {
      beforeAll(() => {
        mockChatSettings = {
          chat: {
            accountSettings: {
              login: {
                loginTypes: {
                  facebook: true,
                  google: true,
                },
              },
            },
            vendor: {
              zChat: {
                getAuthLoginUrl: (socialMedia) => `www.foo.com/${socialMedia}/bar-baz`,
              },
            },
          },
        }
      })

      it('returns an object with authentication urls bound to each social media', () => {
        const expected = {
          facebook: 'www.foo.com/facebook/bar-baz',
          google: 'www.foo.com/google/bar-baz',
        }

        expect(result).toEqual(expected)
      })
    })

    describe('when there are enabled and disabled social medias', () => {
      beforeAll(() => {
        mockChatSettings = {
          chat: {
            accountSettings: {
              login: {
                loginTypes: {
                  facebook: false,
                  google: true,
                  twitter: false,
                },
              },
            },
            vendor: {
              zChat: {
                getAuthLoginUrl: (socialMedia) => `www.foo.com/${socialMedia}/bar-baz`,
              },
            },
          },
        }
      })

      it('returns an object with authentication urls for enabled social medias', () => {
        const expected = { google: 'www.foo.com/google/bar-baz' }

        expect(result).toEqual(expected)
      })
    })
  })

  describe('getZChatVendor', () => {
    let result, mockChatSettings

    beforeEach(() => {
      mockChatSettings = {
        chat: {
          vendor: {
            zChat: 'mockZChat',
          },
        },
      }

      result = selectors.getZChatVendor(mockChatSettings)
    })

    it('returns the zChat vendor', () => {
      expect(result).toBe('mockZChat')
    })
  })

  describe('getWindowSettings', () => {
    let result
    const mockTitle = 'My custom title'
    const mockAccountSettings = {
      chatWindow: {
        title: mockTitle,
      },
    }

    beforeEach(() => {
      result = selectors.getWindowSettings({
        chat: { accountSettings: mockAccountSettings },
      })
    })

    it('returns the current state of title', () => {
      expect(result.title).toEqual(mockTitle)
    })
  })

  describe('getDepartment', () => {
    let result, id
    const mockDepartments = [
      { name: 'hello', id: 123, status: 'online' },
      { name: 'test', id: 321, status: 'online' },
    ]

    beforeEach(() => {
      const mockState = {
        chat: {
          departments: mockDepartments,
        },
      }

      result = selectors.getDepartment(mockState, id)
    })

    describe('when id is a string', () => {
      beforeAll(() => {
        id = 'hello'
      })

      it('finds the department by the name', () => {
        expect(result).toBe(mockDepartments[0])
      })
    })

    describe('when id is a number', () => {
      beforeAll(() => {
        id = 321
      })

      it('finds the department by the id', () => {
        expect(result).toBe(mockDepartments[1])
      })
    })
  })

  describe('getThemeColor', () => {
    let result
    const mockAccountSettings = {
      theme: {
        color: {
          primary: '#eeeeee',
        },
      },
    }

    beforeEach(() => {
      result = selectors.getThemeColor({
        chat: { accountSettings: mockAccountSettings },
      })
    })

    it('returns the primary color', () => {
      expect(result.base).toEqual('#eeeeee')
    })
  })

  describe('getThemePosition', () => {
    let result
    const mockAccountSettings = {
      theme: {
        position: 'br',
      },
    }

    beforeEach(() => {
      result = selectors.getThemePosition({
        chat: { accountSettings: mockAccountSettings },
      })
    })

    it('returns the position', () => {
      expect(result).toEqual('right')
    })
  })

  describe('getChatConnected', () => {
    let result, mockChatSettings, connection

    beforeEach(() => {
      mockChatSettings = {
        chat: {
          connection: connection,
        },
      }

      result = selectors.getChatConnected(mockChatSettings)
    })

    describe('when status is connected', () => {
      beforeAll(() => {
        connection = CONNECTION_STATUSES.CONNECTED
      })

      it('returns true', () => {
        expect(result).toBe(true)
      })
    })

    describe('when status is not connected', () => {
      beforeAll(() => {
        connection = CONNECTION_STATUSES.CLOSED
      })

      it('returns false', () => {
        expect(result).toBe(false)
      })
    })
  })

  describe('hasUnseenAgentMessage', () => {
    let result, mockState, mockTimestamp

    beforeEach(() => {
      mockState = {
        chat: {
          lastReadTimestamp: mockTimestamp,
          chats: new Map([
            [1, { nick: 'agent:123', type: 'chat.msg', timestamp: 1 }],
            [3, { nick: 'visitor:2', type: 'chat.msg', timestamp: 3 }],
            [5, { nick: 'agent:123', type: 'chat.msg', timestamp: 5 }],
            [7, { nick: 'agent:123', type: 'chat.msg', timestamp: 7 }],
          ]),
        },
      }

      result = selectors.hasUnseenAgentMessage(mockState)
    })

    describe('when there is last seen timestamp', () => {
      describe('when last seen timestamp is before last agent timestamp', () => {
        beforeAll(() => {
          mockTimestamp = 6
        })

        it('returns true', () => {
          expect(result).toBe(true)
        })
      })

      describe('when last seen timestamp is after last agent timestamp', () => {
        beforeAll(() => {
          mockTimestamp = 8
        })

        it('returns false', () => {
          expect(result).toBe(false)
        })
      })
    })

    describe('when there is no last seen timestamp', () => {
      beforeAll(() => {
        mockTimestamp = undefined
      })

      it('returns true', () => {
        expect(result).toBe(true)
      })
    })
  })

  describe('getBadgeColor', () => {
    let result

    beforeEach(() => {
      const mockState = {
        chat: {
          accountSettings: {
            theme: {
              color: {
                banner: 'yeet',
              },
            },
          },
        },
      }

      result = selectors.getBadgeColor(mockState)
    })

    it('returns the correct color', () => {
      expect(result).toEqual('yeet')
    })
  })

  describe('getChatsLength', () => {
    let result

    beforeEach(() => {
      const mockState = {
        chat: {
          chats: new Map([
            [1, { nick: 'agent:123', type: 'chat.msg', timestamp: 1 }],
            [3, { nick: 'visitor:2', type: 'chat.msg', timestamp: 3 }],
            [5, { nick: 'agent:123', type: 'chat.msg', timestamp: 5 }],
            [7, { nick: 'agent:123', type: 'chat.msg', timestamp: 7 }],
          ]),
        },
      }

      result = selectors.getChatsLength(mockState)
    })

    it('returns the correct size', () => {
      expect(result).toEqual(4)
    })
  })

  describe('getGroupMessages', () => {
    let result

    beforeEach(() => {
      const mockState = {
        chat: {
          chats: new Map([
            [1, { nick: 'agent:123', type: 'chat.msg', timestamp: 1 }],
            [3, { nick: 'visitor:2', type: 'chat.msg', timestamp: 3 }],
            [5, { nick: 'agent:123', type: 'chat.msg', timestamp: 5 }],
            [7, { nick: 'agent:123', type: 'chat.msg', timestamp: 7 }],
          ]),
        },
      }

      result = selectors.getGroupMessages(mockState, [5, 7])
    })

    it('returns the messages in the group', () => {
      expect(result).toEqual([
        { nick: 'agent:123', type: 'chat.msg', timestamp: 5 },
        { nick: 'agent:123', type: 'chat.msg', timestamp: 7 },
      ])
    })
  })

  describe('getLatestQuickReply', () => {
    let result, quickReplyKey

    beforeEach(() => {
      const mockState = {
        chat: {
          chats: new Map([
            [1, { nick: 'agent:123', type: 'chat.msg', timestamp: 1 }],
            [3, { nick: 'visitor:2', type: 'member.join', timestamp: 3 }],
            [6, { nick: 'agent:123', type: 'chat.msg', timestamp: 6 }],
            [7, { nick: 'agent:123', type: 'chat.quick_replies', timestamp: 7 }],
          ]),
          chatLog: {
            latestQuickReply: quickReplyKey,
          },
        },
      }

      result = selectors.getLatestQuickReply(mockState, quickReplyKey)
    })

    describe('when the latest quick reply can be shown', () => {
      beforeAll(() => {
        quickReplyKey = 7
      })

      it('returns the quick reply message', () => {
        expect(result).toEqual({
          nick: 'agent:123',
          type: 'chat.quick_replies',
          timestamp: 7,
        })
      })
    })

    describe('when the latest quick reply cannot be shown', () => {
      beforeAll(() => {
        quickReplyKey = -1
      })

      it('does not return a quick reply message', () => {
        expect(result).toBeFalsy()
      })
    })
  })

  describe('getShowUpdateVisitorDetails', () => {
    let result, loginEnabled, visitorName, visitorEmail

    beforeEach(() => {
      const mockState = {
        chat: {
          accountSettings: {
            login: {
              enabled: loginEnabled,
            },
          },
          visitor: {
            display_name: visitorName,
            email: visitorEmail,
          },
        },
      }

      result = selectors.getShowUpdateVisitorDetails(mockState)
    })

    describe('when login is not enabled', () => {
      beforeAll(() => {
        loginEnabled = false
      })

      it('returns false', () => {
        expect(result).toBe(false)
      })
    })

    describe('when login is enabled', () => {
      beforeAll(() => {
        loginEnabled = true
      })

      describe('when visitor email is set', () => {
        beforeAll(() => {
          visitorEmail = 'bob@example.com'
        })

        it('returns false', () => {
          expect(result).toBe(false)
        })
      })

      describe('when visitor email is not set', () => {
        beforeAll(() => {
          visitorEmail = undefined
        })

        describe('and visitor name is set', () => {
          beforeAll(() => {
            visitorName = 'Visitor 123'
          })

          describe('and is a default nickname', () => {
            beforeAll(() => {
              mockIsDefaultNickname = true
            })

            it('returns true', () => {
              expect(result).toBe(true)
            })
          })

          describe('and is not a default nickname', () => {
            beforeAll(() => {
              mockIsDefaultNickname = false
            })

            it('returns false', () => {
              expect(result).toBe(false)
            })
          })
        })
      })
    })
  })
})
