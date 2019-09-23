const prechatScreen = 'widget/chat/PRECHAT_SCREEN'
const chattingScreen = 'widget/chat/CHATTING_SCREEN'
const loadingScreen = 'widget/chat/LOADING_SCREEN'
const feedbackScreen = 'widget/chat/FEEDBACK_SCREEN'
const offlineMessageScreen = 'widget/chat/OFFLINE_MESSAGE_SCREEN'

describe('ChatOnline component', () => {
  let ChatOnline

  const chatPath = buildSrcPath('component/chat/ChatOnline')
  const chatConstantsPath = buildSrcPath('constants/chat')

  const AGENT_LIST_SCREEN = 'widget/chat/AGENT_LIST_SCREEN'

  const resetCurrentMessageSpy = jasmine.createSpy('resetCurrentMessage')

  const AttachmentBox = noopReactComponent('AttachmentBox')
  const ChatMenu = noopReactComponent('ChatMenu')
  const ChatReconnectionBubble = noopReactComponent('ChatReconnectionBubble')
  const ButtonPill = noopReactComponent('ButtonPill')
  const LoadingSpinner = noopReactComponent('LoadingSpinner')
  const ZendeskLogo = noopReactComponent('ZendeskLogo')
  const AgentScreen = noopReactComponent('AgentScreen')

  const CONNECTION_STATUSES = requireUncached(chatConstantsPath).CONNECTION_STATUSES
  const DEPARTMENT_STATUSES = requireUncached(chatConstantsPath).DEPARTMENT_STATUSES

  beforeEach(() => {
    mockery.enable()

    initMockRegistry({
      './ChatOnline.scss': {
        locals: {}
      },
      'component/loading/LoadingSpinner': {
        LoadingSpinner
      },
      'component/ZendeskLogo': {
        ZendeskLogo
      },
      'component/chat/chatting/ChattingScreen': noopReactComponent(),
      'component/chat/agents/AgentScreen': AgentScreen,
      'component/chat/rating/RatingScreen': noopReactComponent(),
      'component/chat/prechat/PrechatScreen': noopReactComponent(),
      'component/button/ButtonPill': {
        ButtonPill
      },
      'embeds/chat/components/ChatMenu': ChatMenu,
      'component/container/Container': {
        Container: noopReactComponent()
      },
      'embeds/chat/components/ChatModal': noopReactComponent(),
      'component/chat/ChatContactDetailsPopup': {
        ChatContactDetailsPopup: noopReactComponent()
      },
      'component/chat/ChatEmailTranscriptPopup': {
        ChatEmailTranscriptPopup: noopReactComponent()
      },
      'component/chat/ChatRatingGroup': {
        ChatRatings: {}
      },
      'component/chat/ChatReconnectionBubble': {
        ChatReconnectionBubble: ChatReconnectionBubble
      },
      'component/container/ScrollContainer': {
        ScrollContainer: scrollContainerComponent()
      },
      'component/attachment/AttachmentBox': {
        AttachmentBox: AttachmentBox
      },
      'src/redux/modules/chat': {
        sendMsg: noop,
        handleChatBoxChange: noop,
        editContactDetailsSubmitted: noop,
        resetCurrentMessage: resetCurrentMessageSpy
      },
      'src/redux/modules/selectors': {
        getPrechatFormFields: noop,
        getChatEmailTranscriptEnabled: noop
      },
      'src/redux/modules/chat/chat-screen-types': {
        PRECHAT_SCREEN: prechatScreen,
        CHATTING_SCREEN: chattingScreen,
        FEEDBACK_SCREEN: feedbackScreen,
        LOADING_SCREEN: loadingScreen,
        OFFLINE_MESSAGE_SCREEN: offlineMessageScreen,
        AGENT_LIST_SCREEN
      },
      'service/i18n': {
        i18n: {
          t: _.identity,
          isRTL: () => {}
        }
      },
      'constants/shared': {
        TEST_IDS: {}
      },
      'constants/chat': {
        AGENT_BOT: 'agent:trigger',
        CONNECTION_STATUSES,
        DEPARTMENT_STATUSES
      },
      'src/util/chat': {
        isDefaultNickname: noop
      },
      'src/redux/modules/chat/chat-selectors': {},
      'src/util/utils': {
        onNextTick: cb => setTimeout(cb, 0)
      }
    })

    mockery.registerAllowable(chatPath)
    ChatOnline = requireUncached(chatPath).default.WrappedComponent
  })

  afterEach(() => {
    mockery.deregisterAll()
    mockery.disable()
  })

  describe('componentDidMount', () => {
    let updateChatBackButtonVisibilitySpy

    beforeEach(() => {
      updateChatBackButtonVisibilitySpy = jasmine.createSpy('updateChatBackButtonVisibility')

      const component = instanceRender(
        <ChatOnline updateChatBackButtonVisibility={updateChatBackButtonVisibilitySpy} />
      )

      component.componentDidMount()
    })

    it('calls props.updateChatBackButtonVisibility', () => {
      expect(updateChatBackButtonVisibilitySpy).toHaveBeenCalled()
    })
  })

  describe('renderPrechatScreen', () => {
    let component, result

    describe('when state.screen is `prechat`', () => {
      beforeEach(() => {
        component = instanceRender(
          <ChatOnline screen={prechatScreen} isMobile={true} fullscreen={true} />
        )
        result = component.renderPrechatScreen()
      })

      it('returns a component', () => {
        expect(result).toBeTruthy()
      })
      it('component returns valid isMobile value', () => {
        expect(result.props.isMobile).toEqual(true)
      })

      it('component returns valid fullscreen value', () => {
        expect(result.props.fullscreen).toEqual(true)
      })
    })

    describe('when state.screen is `offlinemessage`', () => {
      beforeEach(() => {
        component = instanceRender(<ChatOnline screen={offlineMessageScreen} />)
        result = component.renderPrechatScreen()
      })

      it('returns a component', () => {
        expect(result).toBeTruthy()
      })
    })

    describe('when state.screen is `loading`', () => {
      beforeEach(() => {
        component = instanceRender(<ChatOnline screen={loadingScreen} />)
        result = component.renderPrechatScreen()
      })

      it('returns a component', () => {
        expect(result).toBeTruthy()
      })
    })

    describe('when state.screen is not `prechat`, `loading` or `offlinemessage`', () => {
      beforeEach(() => {
        component = instanceRender(<ChatOnline screen={'yoloScreen'} />)
        result = component.renderPrechatScreen()
      })

      it('should not render prechat form', () => {
        expect(result).toBeUndefined()
      })
    })
  })

  describe('renderPostchatScreen', () => {
    let component, result

    describe('when state.screen is not `feedback`', () => {
      beforeEach(() => {
        component = instanceRender(<ChatOnline screen={chattingScreen} />)
        result = component.renderPostchatScreen()
      })

      it('does not return anything', () => {
        expect(result).toBeFalsy()
      })
    })

    describe('when state.screen is `feedback`', () => {
      beforeEach(() => {
        component = instanceRender(
          <ChatOnline screen={feedbackScreen} isMobile={true} fullscreen={true} />
        )
        result = component.renderPostchatScreen()
      })

      it('returns a component', () => {
        expect(result).toBeTruthy()
      })

      it('component returns valid isMobile value', () => {
        expect(result.props.isMobile).toEqual(true)
      })

      it('component returns valid fullscreen value', () => {
        expect(result.props.fullscreen).toEqual(true)
      })
    })
  })

  describe('renderChatScreen', () => {
    let component

    describe('when state.screen is not `chatting`', () => {
      beforeEach(() => {
        component = instanceRender(<ChatOnline screen={prechatScreen} />)
      })

      it('does not return anything', () => {
        expect(component.renderChatScreen()).toBeFalsy()
      })
    })

    describe('when state.screen is `chatting`', () => {
      beforeEach(() => {
        component = instanceRender(<ChatOnline screen={chattingScreen} />)
      })

      it('returns a component', () => {
        expect(component.renderChatScreen()).toBeTruthy()
      })
    })
  })

  describe('renderChatEndPopup', () => {
    let component

    describe('when the notification should be shown', () => {
      beforeEach(() => {
        component = instanceRender(
          <ChatOnline chat={{ rating: null }} endChatModalVisible={true} />
        )
      })

      it('renders the component', () => {
        expect(component.renderChatEndPopup()).not.toBe(null)
      })
    })

    describe('when the notification should not be shown', () => {
      beforeEach(() => {
        component = instanceRender(<ChatOnline chat={{ rating: null }} />)
      })

      it('renders nothing', () => {
        expect(component.renderChatEndPopup()).toBe(null)
      })
    })
  })

  describe('renderChatContactDetailsPopup', () => {
    let chatContactDetailsPopup,
      mockVisitor,
      mockEditContactDetails,
      mockName,
      mockEmail,
      mockAuthUrls,
      mockIsAuthenticated,
      mockInitiateSocialLogout,
      updateContactDetailsVisibilitySpy,
      editContactDetailsSubmittedSpy

    beforeEach(() => {
      mockEditContactDetails = { show: true, status: 'error' }
      mockVisitor = { name: 'Terence', email: 'foo@bar.com' }
      mockAuthUrls = {
        google: 'https://g.co/auth',
        facebook: 'https://fb.co/auth'
      }
      mockIsAuthenticated = true
      mockInitiateSocialLogout = () => {}

      const component = instanceRender(
        <ChatOnline
          editContactDetails={mockEditContactDetails}
          visitor={mockVisitor}
          authUrls={mockAuthUrls}
          isAuthenticated={mockIsAuthenticated}
          initiateSocialLogout={mockInitiateSocialLogout}
        />
      )

      chatContactDetailsPopup = component.renderChatContactDetailsPopup()
    })

    it("passes a status string to the popup component's screen prop", () => {
      expect(chatContactDetailsPopup.props.screen).toBe(mockEditContactDetails.status)
    })

    it('does not render the popup when show is false', () => {
      const component = instanceRender(
        <ChatOnline
          editContactDetails={{ show: false }}
          visitor={mockVisitor}
          authUrls={mockAuthUrls}
          isAuthenticated={mockIsAuthenticated}
          initiateSocialLogout={mockInitiateSocialLogout}
        />
      )

      chatContactDetailsPopup = component.renderChatContactDetailsPopup()

      expect(chatContactDetailsPopup).toBe(null)
    })

    it('renders the popup when show is true', () => {
      expect(chatContactDetailsPopup).not.toBe(null)
    })

    it("passes an expected object to the popup component's visitor prop", () => {
      expect(chatContactDetailsPopup.props.visitor).toEqual(jasmine.objectContaining(mockVisitor))
    })

    it("passes the correct value to the popup component's authUrls prop", () => {
      expect(chatContactDetailsPopup.props.authUrls).toEqual(jasmine.objectContaining(mockAuthUrls))
    })

    it("passes the correct value to the popup component's isAuthenticated prop", () => {
      expect(chatContactDetailsPopup.props.isAuthenticated).toEqual(mockIsAuthenticated)
    })

    it("passes the correct value to the popup component's initiateSocialLogout prop", () => {
      expect(chatContactDetailsPopup.props.initiateSocialLogout).toEqual(mockInitiateSocialLogout)
    })

    describe('when props.tryAgainFn is called', () => {
      beforeEach(() => {
        updateContactDetailsVisibilitySpy = jasmine.createSpy('updateEmailTranscriptVisibility')

        const component = instanceRender(
          <ChatOnline
            updateContactDetailsVisibility={updateContactDetailsVisibilitySpy}
            editContactDetails={{ show: true }}
          />
        )
        const popup = component.renderChatContactDetailsPopup()

        popup.props.tryAgainFn()
      })

      it('calls updateEmailTranscriptVisibility with true', () => {
        expect(updateContactDetailsVisibilitySpy).toHaveBeenCalledWith(true)
      })
    })

    describe('when props.leftCtaFn is called', () => {
      beforeEach(() => {
        updateContactDetailsVisibilitySpy = jasmine.createSpy('updateContactDetailsVisibility')

        const component = instanceRender(
          <ChatOnline
            updateContactDetailsVisibility={updateContactDetailsVisibilitySpy}
            editContactDetails={mockEditContactDetails}
          />
        )
        const chatContactDetailsPopup = component.renderChatContactDetailsPopup()

        chatContactDetailsPopup.props.leftCtaFn()
      })

      it('calls updateContactDetailsVisibility with false', () => {
        expect(updateContactDetailsVisibilitySpy).toHaveBeenCalledWith(false)
      })
    })

    describe('when props.rightCtaFn is called', () => {
      beforeEach(() => {
        editContactDetailsSubmittedSpy = jasmine.createSpy('editContactDetailsSubmitted')
        mockName = 'Terence'
        mockEmail = 'foo@bar.com'

        const component = instanceRender(
          <ChatOnline
            editContactDetailsSubmitted={editContactDetailsSubmittedSpy}
            editContactDetails={mockEditContactDetails}
          />
        )
        const chatContactDetailsPopup = component.renderChatContactDetailsPopup()

        chatContactDetailsPopup.props.rightCtaFn(mockName, mockEmail)
      })

      it('calls editContactDetailsSubmitted with an expected argument', () => {
        const expected = { display_name: mockName, email: mockEmail }

        expect(editContactDetailsSubmittedSpy).toHaveBeenCalledWith(
          jasmine.objectContaining(expected)
        )
      })
    })
  })

  describe('renderChatEmailTranscriptPopup', () => {
    let updateEmailTranscriptVisibilitySpy, sendEmailTranscriptSpy

    it('does not render when pop should not be shown', () => {
      const component = instanceRender(<ChatOnline emailTranscript={{ show: false }} />)

      expect(component.renderChatEmailTranscriptPopup()).toBeUndefined()
    })

    it('renders the component when it should be shown', () => {
      const component = instanceRender(<ChatOnline emailTranscript={{ show: true }} />)

      expect(component.renderChatEmailTranscriptPopup()).not.toBeUndefined()
    })

    describe('when props.tryEmailTranscriptAgain is called', () => {
      beforeEach(() => {
        updateEmailTranscriptVisibilitySpy = jasmine.createSpy('updateEmailTranscriptVisibility')

        const component = instanceRender(
          <ChatOnline
            updateEmailTranscriptVisibility={updateEmailTranscriptVisibilitySpy}
            emailTranscript={{ show: true }}
          />
        )
        const popup = component.renderChatEmailTranscriptPopup()

        popup.props.tryEmailTranscriptAgain()
      })

      it('calls updateEmailTranscriptVisibility with true', () => {
        expect(updateEmailTranscriptVisibilitySpy).toHaveBeenCalledWith(true)
      })
    })

    describe('when props.leftCtaFn is called', () => {
      beforeEach(() => {
        updateEmailTranscriptVisibilitySpy = jasmine.createSpy('updateEmailTranscriptVisibility')

        const component = instanceRender(
          <ChatOnline
            updateEmailTranscriptVisibility={updateEmailTranscriptVisibilitySpy}
            emailTranscript={{ show: true }}
          />
        )
        const popup = component.renderChatEmailTranscriptPopup()

        popup.props.leftCtaFn()
      })

      it('calls updateEmailTranscriptVisibility with false', () => {
        expect(updateEmailTranscriptVisibilitySpy).toHaveBeenCalledWith(false)
      })
    })

    describe('when props.rightCtaFn is called', () => {
      let mockEmailTranscript

      beforeEach(() => {
        sendEmailTranscriptSpy = jasmine.createSpy('sendEmailTranscript')
        mockEmailTranscript = { show: true, email: 'foo@bar.com' }

        const component = instanceRender(
          <ChatOnline
            sendEmailTranscript={sendEmailTranscriptSpy}
            emailTranscript={mockEmailTranscript}
          />
        )
        const popup = component.renderChatEmailTranscriptPopup()

        popup.props.rightCtaFn(mockEmailTranscript.email)
      })

      it('calls sendEmailTranscript with an expected argument', () => {
        const expected = mockEmailTranscript.email

        expect(sendEmailTranscriptSpy).toHaveBeenCalledWith(expected)
      })
    })
  })

  describe('renderAttachmentsBox', () => {
    let component
    const renderChatComponent = (screen, attachmentsEnabled) =>
      instanceRender(<ChatOnline screen={screen} attachmentsEnabled={attachmentsEnabled} />)

    describe('when screen is not `chatting`', () => {
      beforeEach(() => {
        component = renderChatComponent(prechatScreen, true)
        component.handleDragEnter()
      })

      it('does not return anything', () => {
        expect(component.renderAttachmentsBox()).toBeFalsy()
      })
    })

    describe('when attachmentsEnabled is false', () => {
      beforeEach(() => {
        component = renderChatComponent(chattingScreen, false)
        component.handleDragEnter()
      })

      it('does not return anything', () => {
        expect(component.renderAttachmentsBox()).toBeFalsy()
      })
    })

    describe('when the component has not had handleDragEnter called on it', () => {
      beforeEach(() => {
        component = renderChatComponent(chattingScreen, true)
      })

      it('does not return anything', () => {
        expect(component.renderAttachmentsBox()).toBeFalsy()
      })
    })

    describe('when the screen is `chatting`, the attachments are enabled and handleDragEnter has been called', () => {
      beforeEach(() => {
        component = renderChatComponent(chattingScreen, true)
        component.handleDragEnter()
      })

      it('returns the AttachmentsBox component', () => {
        expect(TestUtils.isElementOfType(component.renderAttachmentsBox(), AttachmentBox)).toEqual(
          true
        )
      })
    })
  })

  describe('renderChatReconnectionBubble', () => {
    let connectionStatus, isLoggingOut, result

    beforeEach(() => {
      const component = instanceRender(
        <ChatOnline connection={connectionStatus} isLoggingOut={isLoggingOut} />
      )

      result = component.renderChatReconnectionBubble()
    })

    describe('when the connection prop is set to connecting', () => {
      beforeAll(() => {
        isLoggingOut = false
        connectionStatus = CONNECTION_STATUSES.CONNECTING
      })

      it('returns the ChatReconnectingBubble component', () => {
        expect(TestUtils.isElementOfType(result, ChatReconnectionBubble)).toEqual(true)
      })
    })

    describe('when the connection prop is not set to connecting', () => {
      beforeAll(() => {
        isLoggingOut = false
        connectionStatus = CONNECTION_STATUSES.CONNECTED
      })

      it('returns undefined', () => {
        expect(result).toBeUndefined()
      })
    })

    describe('when user is logging out', () => {
      beforeAll(() => {
        connectionStatus = CONNECTION_STATUSES.CONNECTING
        isLoggingOut = true
      })

      it('returns undefined', () => {
        expect(result).toBeUndefined()
      })
    })
  })

  describe('renderAgentListScreen', () => {
    let component, screen

    beforeEach(() => {
      component = instanceRender(
        <ChatOnline screen={screen} isMobile={true} fullscreen={true} />
      ).renderAgentListScreen()
    })

    describe('when the screen is not AGENT_LIST_SCREEN', () => {
      beforeAll(() => {
        screen = chattingScreen
      })

      it('returns nothing', () => {
        expect(component).toBeFalsy()
      })
    })

    describe('when the screen is AGENT_LIST_SCREEN', () => {
      beforeAll(() => {
        screen = AGENT_LIST_SCREEN
      })

      it('returns a AgentScreen component', () => {
        expect(TestUtils.isElementOfType(component, AgentScreen)).toEqual(true)
      })

      it('component returns valid isMobile value', () => {
        expect(component.props.isMobile).toEqual(true)
      })

      it('component returns valid fullscreen value', () => {
        expect(component.props.fullscreen).toEqual(true)
      })
    })
  })

  describe('renderChatReconnectButton', () => {
    let connectionStatus, isLoggingOut, result

    beforeEach(() => {
      const component = instanceRender(
        <ChatOnline connection={connectionStatus} isLoggingOut={isLoggingOut} />
      )

      result = component.renderChatReconnectButton()
    })

    describe('when the connection prop is set to closed', () => {
      beforeAll(() => {
        connectionStatus = CONNECTION_STATUSES.CLOSED
        isLoggingOut = false
      })

      it('returns a div with a ButtonPill component inside it', () => {
        expect(TestUtils.isElementOfType(result.props.children, ButtonPill)).toEqual(true)
      })
    })

    describe('when the connection prop is not set to closed', () => {
      beforeAll(() => {
        connectionStatus = CONNECTION_STATUSES.CONNECTED
        isLoggingOut = false
      })

      it('returns undefined', () => {
        expect(result).toBeUndefined()
      })
    })

    describe('when user is logging out', () => {
      beforeAll(() => {
        connectionStatus = CONNECTION_STATUSES.CONNECTED
        isLoggingOut = true
      })

      it('returns undefined', () => {
        expect(result).toBeUndefined()
      })
    })
  })

  describe('showContactDetailsFn', () => {
    let updateContactDetailsVisibilitySpy, stopPropagationSpy

    beforeEach(() => {
      updateContactDetailsVisibilitySpy = jasmine.createSpy('updateContactDetailsVisibility')
      stopPropagationSpy = jasmine.createSpy('stopPropagation')

      const component = instanceRender(
        <ChatOnline updateContactDetailsVisibility={updateContactDetailsVisibilitySpy} />
      )

      component.showContactDetailsFn({ stopPropagation: stopPropagationSpy })
    })

    it('stops the event propagating', () => {
      expect(stopPropagationSpy).toHaveBeenCalled()
    })

    it('calls updateContactDetailsVisibility with true', () => {
      expect(updateContactDetailsVisibilitySpy).toHaveBeenCalledWith(true)
    })
  })

  describe('toggleMenu', () => {
    let component, menuVisible, keypress, focusSpy

    beforeEach(() => {
      component = domRender(<ChatOnline menuVisible={menuVisible} />)

      jasmine.clock().install()
      focusSpy = jasmine.createSpy('focus')
      component.menu = {
        focus: focusSpy
      }

      component.toggleMenu(keypress)
      jasmine.clock().tick()
    })

    afterEach(() => {
      jasmine.clock().uninstall()
    })

    describe('when menuVisibile is true', () => {
      beforeAll(() => {
        menuVisible = true
      })

      describe('when keypress param is true', () => {
        beforeAll(() => {
          keypress = true
        })

        it('does not call focus on the menu', () => {
          expect(focusSpy).not.toHaveBeenCalled()
        })
      })

      describe('when keypress param is false', () => {
        beforeAll(() => {
          keypress = false
        })

        it('does not call focus on the menu', () => {
          expect(focusSpy).not.toHaveBeenCalled()
        })
      })
    })
  })
})
