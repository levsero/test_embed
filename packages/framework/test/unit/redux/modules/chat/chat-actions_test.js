import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

let actions,
  actionTypes,
  screenTypes,
  CHAT_MESSAGE_TYPES,
  WHITELISTED_SOCIAL_LOGINS,
  mockStore,
  mockAccountSettings,
  mockOperatingHours,
  mockIsChatting,
  mockIsAuthenticated,
  mockChatStandalone,
  mockChatOnline,
  mockDoAuthLogoutArgs,
  mockZChatConfig,
  mockIsValidUrl,
  mockPageTitle,
  mockHostUrl,
  mockHelpCenterAvailable = false,
  mockChannelChoiceAvailable = false,
  mockChatMessagesByAgent,
  mockInit = jasmine.createSpy('init'),
  mockOnChatSDKInitializedSpy = jasmine
    .createSpy('onChatSDKInitialized')
    .and.callFake((cb) => cb()),
  mockOnChatConnectedSpy = jasmine.createSpy('onChatConnected').and.callFake((cb) => cb()),
  mockLogout = jasmine.createSpy('logout'),
  mockSendTyping = jasmine.createSpy('sendTyping'),
  mockSetVisitorInfo = jasmine.createSpy('setVisitorInfo'),
  mockEndChat = jasmine.createSpy('endChat'),
  mockSendChatRating = jasmine.createSpy('sendChatRating'),
  mockSendChatComment = jasmine.createSpy('sendChatComment'),
  mockSendLastChatRatingInfo = jasmine.createSpy('sendLastChatRatingInfo'),
  mockSendFile = jasmine.createSpy('sendFile'),
  mockSendEmailTranscript = jasmine.createSpy('sendEmailTranscript'),
  mockSetVisitorDefaultDepartment = jasmine.createSpy('setVisitorDefaultDepartment'),
  mockClearVisitorDefaultDepartment = jasmine.createSpy('mockClearVisitorDefaultDepartment'),
  mockSendOfflineMsg = jasmine.createSpy('sendOfflineMsg'),
  mockReconnect = jasmine.createSpy('reconnect'),
  mockOn = jasmine.createSpy('on'),
  mockIsLoggingOut,
  showRatingScreen = false,
  loadSoundSpy = jasmine.createSpy('loadSound'),
  getActiveAgentsSpy = jasmine.createSpy('getActiveAgents'),
  getShowRatingScreenSpy = jasmine
    .createSpy('getShowRatingScreenSpy')
    .and.callFake(() => showRatingScreen),
  getIsChattingSpy = jasmine.createSpy('getIsChatting').and.callFake(() => mockIsChatting),
  getIsAuthenticatedSpy = jasmine
    .createSpy('getIsAuthenticatedSpy')
    .and.callFake(() => mockIsAuthenticated),
  getChatMessagesByAgentSpy = jasmine
    .createSpy('getChatMessagesByAgent')
    .and.callFake(() => mockChatMessagesByAgent),
  mockformatSchedule,
  formatScheduleSpy = jasmine.createSpy('formatSchedule').and.callFake(() => mockformatSchedule),
  mockFetchChatHistory = jasmine.createSpy('fetchChatHistory'),
  mockMarkAsRead = jasmine.createSpy('markAsRead'),
  mockCallback = jasmine.createSpy('sdkCallback')

let mockZChatWithTimeout = jasmine.createSpy('zChatWithTimeout').and.returnValue(mockCallback)
let mockIgnore = true
let mockCanBeIgnored = jasmine.createSpy('canBeIgnored').and.returnValue(mockIgnore)
const middlewares = [thunk]
const createMockStore = configureMockStore(middlewares)
const mockVisitor = { display_name: 'Visitor 123', nick: 'visitor' }

describe('chat redux actions', () => {
  beforeEach(() => {
    mockery.enable()

    const chatConstantsPath = buildSrcPath('constants/chat')
    const actionsPath = buildSrcPath('redux/modules/chat/chat-actions/actions')
    const actionTypesPath = buildSrcPath('redux/modules/chat/chat-action-types')
    const screenTypesPath = buildSrcPath('redux/modules/chat/chat-screen-types')
    const chatConstants = requireUncached(chatConstantsPath)

    mockIsChatting = false
    mockChatStandalone = false
    mockery.registerAllowable(actionsPath)
    mockery.registerAllowable(actionTypesPath)
    mockery.registerAllowable(screenTypesPath)
    mockery.registerAllowable(chatConstantsPath)

    CHAT_MESSAGE_TYPES = chatConstants.CHAT_MESSAGE_TYPES
    WHITELISTED_SOCIAL_LOGINS = chatConstants.WHITELISTED_SOCIAL_LOGINS

    initMockRegistry({
      'service/api/zopimApi': {},
      'service/api/callbacks': {},
      'src/redux/modules/base/base-selectors': {
        getChatStandalone: () => mockChatStandalone,
        getZChatConfig: () => mockZChatConfig,
      },
      'src/service/api/zopimApi/callbacks': {
        onChatSDKInitialized: mockOnChatSDKInitializedSpy,
        onChatConnected: mockOnChatConnectedSpy,
      },
      'src/redux/modules/chat/chat-selectors': {
        getChatVisitor: () => mockVisitor,
        getShowRatingScreen: getShowRatingScreenSpy,
        getIsChatting: getIsChattingSpy,
        getChatOnline: () => mockChatOnline,
        getActiveAgents: getActiveAgentsSpy,
        getIsAuthenticated: getIsAuthenticatedSpy,
        getIsLoggingOut: () => mockIsLoggingOut,
        getChatMessagesByAgent: getChatMessagesByAgentSpy,
        getZChatVendor: () => {
          return {
            sendTyping: mockSendTyping,
            endChat: mockEndChat,
            setVisitorInfo: mockSetVisitorInfo,
            sendChatRating: mockSendChatRating,
            sendChatComment: mockSendChatComment,
            sendLastChatRatingInfo: mockSendLastChatRatingInfo,
            sendFile: mockSendFile,
            sendEmailTranscript: mockSendEmailTranscript,
            setVisitorDefaultDepartment: mockSetVisitorDefaultDepartment,
            clearVisitorDefaultDepartment: mockClearVisitorDefaultDepartment,
            isChatting: () => true,
            sendOfflineMsg: mockSendOfflineMsg,
            reconnect: mockReconnect,
            getAccountSettings: () => mockAccountSettings,
            getOperatingHours: () => mockOperatingHours,
            fetchChatHistory: mockFetchChatHistory,
            markAsRead: mockMarkAsRead,
            on: mockOn,
            getAuthLoginUrl: (key) => `www.foo.com/${key}/bar-baz`,
            doAuthLogout: (cb) => cb(mockDoAuthLogoutArgs),
            init: mockInit,
            logoutForAll: mockLogout,
          }
        },
      },
      'src/constants/chat': {
        CHAT_MESSAGE_TYPES,
        WHITELISTED_SOCIAL_LOGINS,
        CONNECTION_STATUSES: {
          CONNECTED: 'connected',
        },
      },
      'constants/event': {},
      'service/audio': {
        load: loadSoundSpy,
      },
      'src/redux/modules/form/actions': {},
      'src/redux/modules/chat/helpers/zChatWithTimeout': {
        zChatWithTimeout: mockZChatWithTimeout,
        canBeIgnored: mockCanBeIgnored,
      },
      'src/util/utils': {
        getPageTitle: () => mockPageTitle,
        getHostUrl: () => mockHostUrl,
        isValidUrl: () => mockIsValidUrl,
      },
      'src/util/chat': {
        formatSchedule: formatScheduleSpy,
      },
      'src/framework/services/errorTracker': {
        error: () => undefined,
      },
      'utility/devices': {
        isMobileBrowser: () => false,
      },
      'src/redux/modules/base': {},
      'src/redux/modules/selectors': {
        getHelpCenterAvailable: () => mockHelpCenterAvailable,
        getChannelChoiceAvailable: () => mockChannelChoiceAvailable,
      },
    })

    actions = requireUncached(actionsPath)
    actionTypes = requireUncached(actionTypesPath)
    screenTypes = requireUncached(screenTypesPath)

    mockStore = createMockStore({
      chat: {
        visitor: mockVisitor,
        rating: {},
        accountSettings: {
          rating: {},
        },
      },
    })

    jasmine.clock().install()
    jasmine.clock().mockDate(Date.now())
  })

  afterEach(() => {
    mockery.disable()
    mockery.deregisterAll()
    jasmine.clock().uninstall()
  })

  describe('resetCurrentMessage', () => {
    let action

    beforeEach(() => {
      mockStore.dispatch(actions.resetCurrentMessage())
      action = mockStore.getActions()[0]
    })

    it('dispatches an action of type RESET_CURRENT_MESSAGE', () => {
      expect(action.type).toEqual(actionTypes.RESET_CURRENT_MESSAGE)
    })
  })

  describe('handleChatBoxChange', () => {
    let message, action

    beforeEach(() => {
      mockStore.dispatch(actions.handleChatBoxChange(message))
      action = mockStore.getActions()[0]
    })

    afterEach(() => {
      mockSendTyping.calls.reset()
    })

    describe('when message length greater than 0', () => {
      beforeAll(() => {
        message = 'new message'
      })

      it('dispatches an action of type CHAT_BOX_CHANGED', () => {
        expect(action.type).toEqual(actionTypes.CHAT_BOX_CHANGED)
      })

      it('has the message in the payload', () => {
        expect(action.payload).toEqual(message)
      })

      it('calls sendTyping(true) on the Web SDK', () => {
        expect(mockSendTyping).toHaveBeenCalledWith(true)
      })
    })

    describe('when message length is 0', () => {
      beforeAll(() => {
        message = ''
      })

      it('dispatches an action of type CHAT_BOX_CHANGED', () => {
        expect(action.type).toEqual(actionTypes.CHAT_BOX_CHANGED)
      })

      it('has the message in the payload', () => {
        expect(action.payload).toEqual(message)
      })

      it('calls sendTyping(false) on the Web SDK', () => {
        expect(mockSendTyping).toHaveBeenCalledWith(false)
      })
    })
  })

  describe('sendMsg', () => {
    let message

    beforeEach(() => {
      message = 'Hi there'
      mockStore.dispatch(actions.sendMsg(message))
    })

    it('calls sendTyping with false', () => {
      expect(mockSendTyping).toHaveBeenCalledWith(false)
    })

    it('calls sendChatMsg on the Web SDK', () => {
      expect(mockZChatWithTimeout.calls.mostRecent().args[1]).toEqual('sendChatMsg')
    })

    it('dispatches a CHAT_MSG_REQUEST_SENT action', () => {
      expect(mockStore.getActions().map((action) => action.type)).toContain(
        actionTypes.CHAT_MSG_REQUEST_SENT
      )
    })

    it('sets status of payload to CHAT_MESSAGE_PENDING', () => {
      expect(
        mockStore.getActions().find((action) => action.type === actionTypes.CHAT_MSG_REQUEST_SENT)
          .payload.status
      ).toEqual(CHAT_MESSAGE_TYPES.CHAT_MESSAGE_PENDING)
    })

    describe('Web SDK callback', () => {
      let callbackFn

      beforeEach(() => {
        callbackFn = mockCallback.calls.mostRecent().args[1]
      })

      describe('when there are no errors', () => {
        beforeEach(() => {
          callbackFn()
        })

        it('dispatches a CHAT_MSG_REQUEST_SUCCESS action with the message in payload', () => {
          expect(mockStore.getActions().map((action) => action.type)).toContain(
            actionTypes.CHAT_MSG_REQUEST_SUCCESS
          )
        })

        it('sets the message on the payload', () => {
          expect(
            mockStore
              .getActions()
              .find((action) => action.type === actionTypes.CHAT_MSG_REQUEST_SUCCESS).payload.detail
              .msg
          ).toEqual(message)
        })

        it('sets status of payload CHAT_MESSAGE_SUCCESS', () => {
          expect(
            mockStore
              .getActions()
              .find((action) => action.type === actionTypes.CHAT_MSG_REQUEST_SUCCESS).payload.status
          ).toEqual(CHAT_MESSAGE_TYPES.CHAT_MESSAGE_SUCCESS)
        })
      })

      describe('when there are errors', () => {
        let errors = ['There was an error', 'Another error']

        beforeEach(() => {
          callbackFn(errors)
        })

        it('dispatches a CHAT_MSG_REQUEST_FAILURE action with the errors in the payload', () => {
          expect(mockStore.getActions().map((action) => action.type)).toContain(
            actionTypes.CHAT_MSG_REQUEST_FAILURE
          )
        })

        it('sets the message on the payload', () => {
          expect(
            mockStore
              .getActions()
              .find((action) => action.type === actionTypes.CHAT_MSG_REQUEST_FAILURE).payload.detail
              .msg
          ).toEqual(message)
        })

        it('sets status of payload CHAT_MESSAGE_FAILURE', () => {
          expect(
            mockStore
              .getActions()
              .find((action) => action.type === actionTypes.CHAT_MSG_REQUEST_FAILURE).payload.status
          ).toEqual(CHAT_MESSAGE_TYPES.CHAT_MESSAGE_FAILURE)
        })
      })
    })
  })

  describe('endChatViaPostChatScreen', () => {
    beforeEach(() => {
      mockStore.clearActions()
    })

    describe('when the getShowRatingScreen selector returns true', () => {
      beforeEach(() => {
        showRatingScreen = true
        mockStore.dispatch(actions.endChatViaPostChatScreen())
      })

      it('dispatches an UPDATE_CHAT_SCREEN action with the POST_CHAT_SCREEN', () => {
        expect(mockStore.getActions()).toContain({
          type: actionTypes.UPDATE_CHAT_SCREEN,
          payload: { screen: screenTypes.POST_CHAT_SCREEN },
        })
      })
    })

    describe('when the getShowRatingScreen selector returns false', () => {
      beforeEach(() => {
        showRatingScreen = false
        mockStore.dispatch(actions.endChatViaPostChatScreen())
      })

      it('does not dispatch an UPDATE_CHAT_SCREEN action with the POST_CHAT_SCREEN', () => {
        expect(mockStore.getActions()).not.toContain({
          type: actionTypes.UPDATE_CHAT_SCREEN,
          payload: { screen: screenTypes.POST_CHAT_SCREEN },
        })
      })
    })
  })

  describe('getAccountSettings', () => {
    let updateAccountSettingsAction

    beforeEach(() => {
      loadSoundSpy.calls.reset()
    })

    describe('when the prechat form is required', () => {
      let updateScreenAction

      beforeEach(() => {
        mockAccountSettings = {
          forms: { pre_chat_form: { required: true } },
          chat_button: { hide_when_offline: false },
          sound: { disabled: true },
        }
        mockStore.dispatch(actions.getAccountSettings())
        updateScreenAction = mockStore.getActions()[0]
        updateAccountSettingsAction = mockStore.getActions()[1]
      })

      describe('when isChatting is false', () => {
        it('dispatches updateChatScreen action with the prechat screen', () => {
          expect(updateScreenAction).toEqual({
            type: actionTypes.UPDATE_CHAT_SCREEN,
            payload: { screen: screenTypes.PRECHAT_SCREEN },
          })
        })
      })

      describe('when isChatting is true', () => {
        let action

        beforeEach(() => {
          mockAccountSettings = {
            forms: { pre_chat_form: { required: true } },
            chat_button: { hide_when_offline: false },
            sound: { disabled: true },
          }
          mockStore.clearActions()
          mockIsChatting = true
          mockStore.dispatch(actions.getAccountSettings())
          action = mockStore.getActions()[0]
        })

        it('does not dispatch updateChatScreen', () => {
          expect(action.type).toEqual(actionTypes.GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS)
        })
      })

      it('dispatches an action of type GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS', () => {
        expect(updateAccountSettingsAction.type).toBe(
          actionTypes.GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS
        )
      })

      it('has the value returned from zChat.getAccountSettings() in the payload', () => {
        expect(updateAccountSettingsAction.payload).toEqual(mockAccountSettings)
      })
    })

    describe('when the prechat form is not required', () => {
      beforeEach(() => {
        mockAccountSettings = {
          forms: { pre_chat_form: { required: false } },
          chat_button: { hide_when_offline: false },
          sound: { disabled: true },
        }
        mockStore.dispatch(actions.getAccountSettings())
        updateAccountSettingsAction = mockStore.getActions()[0]
      })

      it('dispatches an action of type GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS', () => {
        expect(updateAccountSettingsAction.type).toEqual(
          actionTypes.GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS
        )
      })

      it('has the value returned from zChat.getAccountSettings() in the payload', () => {
        expect(updateAccountSettingsAction.payload).toEqual(mockAccountSettings)
      })
    })

    describe('when hide_when_offline is false', () => {
      beforeEach(() => {
        mockAccountSettings = {
          forms: { pre_chat_form: { required: false } },
          chat_button: { hide_when_offline: false },
          sound: { disabled: true },
        }
      })
    })
  })

  describe('chatNotificationDismissed', () => {
    let action

    beforeEach(() => {
      mockStore.dispatch(actions.chatNotificationDismissed())
      action = mockStore.getActions()[0]
    })

    it('dispatches an action of type CHAT_NOTIFICATION_DISMISSED', () => {
      expect(action.type).toEqual(actionTypes.CHAT_NOTIFICATION_DISMISSED)
    })
  })

  describe('proactiveChatNotificationDismissed', () => {
    let action

    beforeEach(() => {
      mockStore.dispatch(actions.proactiveChatNotificationDismissed())
      action = mockStore.getActions()[0]
    })

    it('dispatches an action of type PROACTIVE_CHAT_NOTIFICATION_DISMISSED', () => {
      expect(action.type).toEqual(actionTypes.PROACTIVE_CHAT_NOTIFICATION_DISMISSED)
    })
  })

  describe('chatNotificationRespond', () => {
    let action

    beforeEach(() => {
      mockStore.dispatch(actions.chatNotificationRespond())
      action = mockStore.getActions()[0]
    })

    it('dispatches an action of type CHAT_NOTIFICATION_RESPONDED', () => {
      expect(action.type).toEqual(actionTypes.CHAT_NOTIFICATION_RESPONDED)
    })
  })

  describe('updateChatScreen', () => {
    let action

    beforeEach(() => {
      mockStore.dispatch(actions.updateChatScreen(screenTypes.CHATTING_SCREEN))
      action = mockStore.getActions()[0]
    })

    it('dispatches an action of type UPDATE_CHAT_SCREEN ', () => {
      expect(action.type).toEqual(actionTypes.UPDATE_CHAT_SCREEN)
    })

    it('has the updated screen in the payload', () => {
      expect(action.payload.screen).toBe(screenTypes.CHATTING_SCREEN)
    })
  })

  describe('chatOpened', () => {
    let action

    beforeEach(() => {
      mockStore.dispatch(actions.chatOpened())
      action = mockStore.getActions()[0]
    })

    it('dispatches a CHAT_OPENED action', () => {
      const expected = { type: actionTypes.CHAT_OPENED }

      expect(action).toEqual(expected)
    })
  })

  describe('resetEmailTranscript', () => {
    let action

    beforeEach(() => {
      mockStore.dispatch(actions.resetEmailTranscript())
      action = mockStore.getActions()[0]
    })

    it('dispatches RESET_EMAIL_TRANSCRIPT action', () => {
      expect(action).toEqual({
        type: actionTypes.RESET_EMAIL_TRANSCRIPT,
      })
    })
  })

  describe('getOperatingHours', () => {
    let updateOperatingHoursAction

    describe('when account typed operating hours enabled', () => {
      beforeEach(() => {
        mockOperatingHours = {
          enabled: true,
          type: 'account',
          account_schedule: {
            0: [],
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: [],
          },
          timezone: 'Africa/Sao_Tome',
        }

        mockformatSchedule = 'abc'

        mockStore.dispatch(actions.getOperatingHours())
        updateOperatingHoursAction = mockStore.getActions()[0]
      })

      it('dispatches an action of type GET_OPERATING_HOURS_REQUEST_SUCCESS', () => {
        expect(updateOperatingHoursAction.type).toEqual(
          actionTypes.GET_OPERATING_HOURS_REQUEST_SUCCESS
        )
      })

      it('calls formatSchedule with the account_schedule', () => {
        expect(formatScheduleSpy).toHaveBeenCalledWith(mockOperatingHours.account_schedule)
      })

      it('has the account_schedule formatted by formatSchedule in the payload', () => {
        const expected = {
          ...mockOperatingHours,
          account_schedule: 'abc',
          timezone: 'Africa/Sao Tome',
        }

        expect(updateOperatingHoursAction.payload).toEqual(expected)
      })
    })

    describe('when department typed operating hours enabled', () => {
      beforeEach(() => {
        formatScheduleSpy.calls.reset()

        mockOperatingHours = {
          enabled: true,
          type: 'department',
          department_schedule: {
            a: {
              0: [],
              1: [],
              2: [],
              3: [],
              4: [],
              5: [],
              6: [],
            },
            b: {
              0: [{ start: 0, end: 1 }],
              1: [{ start: 0, end: 1 }],
              2: [{ start: 0, end: 1 }],
              3: [{ start: 0, end: 1 }],
              4: [{ start: 0, end: 1 }],
              5: [{ start: 0, end: 1 }],
              6: [{ start: 0, end: 1 }],
            },
          },
          timezone: 'Africa/Sao_Tome',
        }

        mockformatSchedule = 'abc'

        mockStore.dispatch(actions.getOperatingHours())
        updateOperatingHoursAction = mockStore.getActions()[0]
      })

      it('dispatches an action of type GET_OPERATING_HOURS_REQUEST_SUCCESS', () => {
        expect(updateOperatingHoursAction.type).toEqual(
          actionTypes.GET_OPERATING_HOURS_REQUEST_SUCCESS
        )
      })

      it('calls formatSchedule with each of the department_schedules', () => {
        expect(formatScheduleSpy).toHaveBeenCalledTimes(2)

        // jasmine.anything()s are due to spy capturing everything _.mapValues provides
        expect(formatScheduleSpy).toHaveBeenCalledWith(
          mockOperatingHours.department_schedule.a,
          jasmine.anything(),
          jasmine.anything()
        )
        expect(formatScheduleSpy).toHaveBeenCalledWith(
          mockOperatingHours.department_schedule.b,
          jasmine.anything(),
          jasmine.anything()
        )
      })

      it('has the department_schedule formatted by formatSchedule in the payload', () => {
        const expected = {
          ...mockOperatingHours,
          department_schedule: {
            a: 'abc',
            b: 'abc',
          },
          timezone: 'Africa/Sao Tome',
        }

        expect(updateOperatingHoursAction.payload).toEqual(expected)
      })
    })

    describe('when operating hours disabled', () => {
      beforeEach(() => {
        mockOperatingHours = {
          enabled: false,
          type: 'account',
          account_schedule: {
            0: [],
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: [],
          },
          timezone: 'Africa/Sao_Tome',
        }
        mockStore.dispatch(actions.getOperatingHours())
        updateOperatingHoursAction = mockStore.getActions()[0]
      })

      it('dispatches an action of type GET_OPERATING_HOURS_REQUEST_SUCCESS', () => {
        expect(updateOperatingHoursAction.type).toEqual(
          actionTypes.GET_OPERATING_HOURS_REQUEST_SUCCESS
        )
      })

      it('only has the enabled property in the payload', () => {
        expect(updateOperatingHoursAction.payload).toEqual({ enabled: false })
      })
    })

    describe('when operating hours were never set', () => {
      beforeEach(() => {
        mockOperatingHours = undefined
        mockStore.dispatch(actions.getOperatingHours())
      })

      it('does not dispatches an action of type GET_OPERATING_HOURS_REQUEST_SUCCESS', () => {
        expect(mockStore.getActions().length).toEqual(0)
      })
    })
  })

  describe('chatOfflineFormChanged', () => {
    let action, mockFormState

    beforeEach(() => {
      mockFormState = {
        name: 'Terence',
        phone: '123456789',
        message: 'foo bar',
      }

      mockStore.dispatch(actions.chatOfflineFormChanged(mockFormState))
      action = mockStore.getActions()[0]
    })

    it('dispatches CHAT_OFFLINE_FORM_CHANGED action', () => {
      expect(action.type).toEqual(actionTypes.CHAT_OFFLINE_FORM_CHANGED)
    })

    it('has the correct params in the payload', () => {
      expect(action.payload).toEqual(jasmine.objectContaining(mockFormState))
    })
  })

  describe('chatBanned', () => {
    it('returns CHAT_BANNED', () => {
      mockStore.dispatch(actions.chatBanned())

      expect(mockStore.getActions()[0]).toEqual({
        type: actionTypes.CHAT_BANNED,
      })
    })
  })

  describe('handlePreChatFormChange', () => {
    let action
    const payload = {
      name: 'name',
      email: 'foo@bar.com',
    }

    beforeEach(() => {
      mockStore.dispatch(actions.handlePreChatFormChange(payload))
      action = mockStore.getActions()[0]
    })

    it('dispatches a PRE_CHAT_FORM_ON_CHANGE action with the payload passed in', () => {
      const expected = {
        type: actionTypes.PRE_CHAT_FORM_ON_CHANGE,
        payload,
      }

      expect(action).toEqual(expected)
    })
  })

  describe('updateContactDetailsVisibility', () => {
    let action

    beforeEach(() => {
      mockStore.dispatch(actions.updateContactDetailsVisibility(true))
      action = mockStore.getActions()[0]
    })

    it('dispatches UPDATE_CHAT_CONTACT_DETAILS_VISIBILITY action', () => {
      expect(action.type).toEqual(actionTypes.UPDATE_CHAT_CONTACT_DETAILS_VISIBILITY)
    })

    it('has the correct params in the payload', () => {
      expect(action.payload).toEqual(true)
    })
  })

  describe('updateEmailTranscriptVisibility', () => {
    let action

    beforeEach(() => {
      mockStore.dispatch(actions.updateEmailTranscriptVisibility(true))
      action = mockStore.getActions()[0]
    })

    it('dispatches UPDATE_CHAT_EMAIL_TRANSCRIPT_VISIBILITY action', () => {
      expect(action.type).toEqual(actionTypes.UPDATE_CHAT_EMAIL_TRANSCRIPT_VISIBILITY)
    })

    it('has the correct params in the payload', () => {
      expect(action.payload).toEqual(true)
    })
  })

  describe('handleOfflineFormBack', () => {
    let action

    beforeEach(() => {
      mockStore.dispatch(actions.handleOfflineFormBack(true))
      action = mockStore.getActions()[0]
    })

    it('dispatches OFFLINE_FORM_BACK_BUTTON_CLICKED action', () => {
      expect(action.type).toEqual(actionTypes.OFFLINE_FORM_BACK_BUTTON_CLICKED)
    })
  })

  describe('handleReconnect', () => {
    let action

    beforeEach(() => {
      mockStore.dispatch(actions.handleReconnect(true))
      action = mockStore.getActions()[0]
    })

    it('calls zChat.reconnect', () => {
      expect(mockReconnect).toHaveBeenCalled()
    })

    it('dispatches CHAT_RECONNECT action', () => {
      expect(action.type).toEqual(actionTypes.CHAT_RECONNECT)
    })
  })

  describe('showStandaloneMobileNotification', () => {
    let action

    beforeEach(() => {
      mockStore.dispatch(actions.showStandaloneMobileNotification())
      action = mockStore.getActions()[0]
    })

    it('dispatches SHOW_STANDALONE_MOBILE_NOTIFICATION action', () => {
      expect(action.type).toBe(actionTypes.SHOW_STANDALONE_MOBILE_NOTIFICATION)
    })
  })

  describe('updatePreviewerScreen', () => {
    let action

    beforeEach(() => {
      mockStore.dispatch(actions.updatePreviewerScreen('chatting'))
      action = mockStore.getActions()[0]
    })

    it('dispatches UPDATE_PREVIEWER_SCREEN action', () => {
      expect(action.type).toBe(actionTypes.UPDATE_PREVIEWER_SCREEN)
    })

    it('has the correct params in the payload', () => {
      expect(action.payload).toBe('chatting')
    })
  })

  describe('updatePreviewerSettings', () => {
    let action
    const settings = { rating: { enabled: true } }

    beforeEach(() => {
      mockStore.dispatch(actions.updatePreviewerSettings(settings))
      action = mockStore.getActions()[0]
    })

    it('dispatches UPDATE_PREVIEWER_SETTINGS action', () => {
      expect(action.type).toBe(actionTypes.UPDATE_PREVIEWER_SETTINGS)
    })

    it('has the correct params in the payload', () => {
      expect(action.payload).toBe(settings)
    })
  })

  describe('handlePrechatFormSubmit', () => {
    let action, mockFormState

    beforeEach(() => {
      mockFormState = {
        department: '123',
        message: 'foo',
      }

      mockStore.dispatch(actions.handlePrechatFormSubmit(mockFormState))
      action = mockStore.getActions()[0]
    })

    it('dispatches PRE_CHAT_FORM_SUBMIT action', () => {
      expect(action.type).toEqual(actionTypes.PRE_CHAT_FORM_SUBMIT)
    })

    it('has the correct params in the payload', () => {
      expect(action.payload).toEqual(mockFormState)
    })
  })

  describe('handleChatVendorLoaded', () => {
    let action, mockPayload

    beforeEach(() => {
      mockPayload = {
        zChat: 'chat-web-sdk',
      }

      mockStore.dispatch(actions.handleChatVendorLoaded(mockPayload))
      action = mockStore.getActions()[0]
    })

    it('dispatches an action of type CHAT_VENDOR_LOADED', () => {
      expect(action.type).toEqual(actionTypes.CHAT_VENDOR_LOADED)
    })

    it('dispatches an action with the loaded vendor', () => {
      expect(action.payload).toEqual(mockPayload)
    })
  })

  describe('chatWindowOpenOnNavigate', () => {
    let action

    beforeEach(() => {
      mockStore.dispatch(actions.chatWindowOpenOnNavigate())
      action = mockStore.getActions()[0]
    })

    it('dispatches an action of type CHAT_WINDOW_OPEN_ON_NAVIGATE', () => {
      expect(action.type).toEqual(actionTypes.CHAT_WINDOW_OPEN_ON_NAVIGATE)
    })
  })

  describe('setStatusForcefully', () => {
    let action

    beforeEach(() => {
      mockStore.dispatch(actions.setStatusForcefully('online'))
      action = mockStore.getActions()[0]
    })

    it('dispatches an action of type API_FORCE_STATUS_CALLED', () => {
      expect(action.type).toEqual(actionTypes.API_FORCE_STATUS_CALLED)
    })

    it('dispatches the correct payload', () => {
      expect(action.payload).toEqual('online')
    })
  })

  describe('markAsRead', () => {
    let allActions

    beforeEach(() => {
      mockStore.dispatch(actions.markAsRead())
      allActions = mockStore.getActions()
    })

    it('calls markAsRead on the Web SDK', () => {
      expect(mockMarkAsRead).toHaveBeenCalled()
    })

    it('dispatches an action of type CHAT_NOTIFICATION_RESET', () => {
      expect(allActions[0].type).toEqual(actionTypes.CHAT_NOTIFICATION_RESET)
    })
  })

  describe('handleChatBadgeMessageChange', () => {
    let action

    beforeEach(() => {
      mockStore.dispatch(actions.handleChatBadgeMessageChange('yeet'))
      action = mockStore.getActions()[0]
    })

    it('dispatches an action of type CHAT_BADGE_MESSAGE_CHANGED', () => {
      expect(action.type).toEqual(actionTypes.CHAT_BADGE_MESSAGE_CHANGED)
    })

    it('dispatches the correct payload', () => {
      expect(action.payload).toEqual('yeet')
    })
  })

  describe('chatConnectionError', () => {
    let action

    beforeEach(() => {
      mockStore.dispatch(actions.chatConnectionError())
      action = mockStore.getActions()[0]
    })

    it('dispatches an action of type CHAT_CONNECTION_ERROR', () => {
      expect(action.type).toEqual(actionTypes.CHAT_CONNECTION_ERROR)
    })
  })
})
