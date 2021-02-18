const prechatScreen = 'widget/chat/PRECHAT_SCREEN'
const chattingScreen = 'widget/chat/CHATTING_SCREEN'
const loadingScreen = 'widget/chat/LOADING_SCREEN'
const feedbackScreen = 'widget/chat/FEEDBACK_SCREEN'
const postChatScreen = 'widget/chat/POST_CHAT_SCREEN'
const offlineMessageScreen = 'widget/chat/OFFLINE_MESSAGE_SUCCESS_SCREEN'

describe('ChatOnline component', () => {
  let ChatOnline

  const chatPath = buildSrcPath('component/chat/ChatOnline')
  const chatConstantsPath = buildSrcPath('constants/chat')

  const AGENT_LIST_SCREEN = 'widget/chat/AGENT_LIST_SCREEN'

  const resetCurrentMessageSpy = jasmine.createSpy('resetCurrentMessage')

  const AttachmentBox = noopReactComponent('AttachmentBox')
  const ChatMenu = noopReactComponent('ChatMenu')
  const ReconnectionBubble = noopReactComponent('ReconnectionBubble')
  const ButtonPill = noopReactComponent('ButtonPill')
  const LoadingSpinner = noopReactComponent('LoadingSpinner')
  const AgentDetailsPage = noopReactComponent('AgentDetailsPage')
  const FileDropTarget = noopReactComponent('FileDropTarget')

  const CONNECTION_STATUSES = requireUncached(chatConstantsPath).CONNECTION_STATUSES
  const DEPARTMENT_STATUSES = requireUncached(chatConstantsPath).DEPARTMENT_STATUSES

  beforeEach(() => {
    mockery.enable()

    initMockRegistry({
      './ChatOnline.scss': {
        locals: {},
      },
      'component/loading/LoadingSpinner': {
        LoadingSpinner,
      },
      'components/FileDropProvider': {
        FileDropProvider: noopReactComponent(),
        FileDropTarget,
      },
      'src/embeds/chat/pages/ChattingPage': noopReactComponent(),
      'src/embeds/chat/pages/AgentDetailsPage': AgentDetailsPage,
      'src/embeds/chat/pages/ChatRatingPage': noopReactComponent(),
      'src/embeds/chat/pages/PostChatPage': noopReactComponent(),
      'component/chat/prechat/PrechatScreen': noopReactComponent(),
      'embeds/chat/selectors': {},
      'embeds/chat/actions/actions': {},
      'embeds/chat/components/ReconnectionBubble': ReconnectionBubble,
      'embeds/chat/components/ReconnectButton': noopReactComponent(),
      'component/button/ButtonPill': {
        ButtonPill,
      },
      'embeds/chat/components/ChatMenu': ChatMenu,
      'component/container/Container': {
        Container: noopReactComponent(),
      },
      'embeds/chat/components/ChatModal': noopReactComponent(),
      'embeds/chat/components/EmailTranscriptModal': noopReactComponent(),
      'component/chat/ChatRatingGroup': {
        ChatRatings: {},
      },
      'src/component/attachment/AttachmentBox': AttachmentBox,
      'src/redux/modules/chat': {
        sendMsg: noop,
        handleChatBoxChange: noop,
        resetCurrentMessage: resetCurrentMessageSpy,
      },
      'src/redux/modules/selectors': {
        getPrechatFormFields: noop,
        getChatEmailTranscriptEnabled: noop,
      },
      'src/redux/modules/chat/chat-screen-types': {
        PRECHAT_SCREEN: prechatScreen,
        CHATTING_SCREEN: chattingScreen,
        FEEDBACK_SCREEN: feedbackScreen,
        POST_CHAT_SCREEN: postChatScreen,
        LOADING_SCREEN: loadingScreen,
        OFFLINE_MESSAGE_SUCCESS_SCREEN: offlineMessageScreen,
        AGENT_LIST_SCREEN,
      },
      'src/embeds/chat/actions/email-transcript': {
        sendEmailTranscript: noop,
      },
      'src/apps/webWidget/services/i18n': {
        i18n: {
          t: _.identity,
          isRTL: () => {},
        },
      },
      'constants/shared': {
        TEST_IDS: {},
      },
      'constants/chat': {
        AGENT_BOT: 'agent:trigger',
        CONNECTION_STATUSES,
        DEPARTMENT_STATUSES,
      },
      'src/util/chat': {
        isDefaultNickname: noop,
      },
      'src/redux/modules/chat/chat-selectors': {},
      'src/util/utils': {
        onNextTick: (cb) => setTimeout(cb, 0),
      },
      'src/embeds/chat/components/ButtonPill': {},
      'src/embeds/chat/selectors': {},
      'src/embeds/webWidget/selectors/feature-flags': {},
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

  describe('renderChatRatingPage', () => {
    let component, result

    describe('when state.screen is not `feedback`', () => {
      beforeEach(() => {
        component = instanceRender(<ChatOnline screen={chattingScreen} />)
        result = component.renderChatRatingPage()
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
        result = component.renderChatRatingPage()
      })

      it('returns a component', () => {
        expect(result).toBeTruthy()
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

  describe('renderAttachmentsBox', () => {
    let component
    const renderChatComponent = (screen, attachmentsEnabled) =>
      instanceRender(<ChatOnline screen={screen} attachmentsEnabled={attachmentsEnabled} />)

    describe('when screen is not `chatting`', () => {
      beforeEach(() => {
        component = renderChatComponent(prechatScreen, true)
      })
    })

    describe('when attachmentsEnabled is false', () => {
      beforeEach(() => {
        component = renderChatComponent(chattingScreen, false)
      })

      it('does not return anything', () => {
        expect(component.renderAttachmentsBox()).toBeFalsy()
      })
    })

    describe('when the screen is `chatting`, the attachments are enabled', () => {
      beforeEach(() => {
        component = renderChatComponent(chattingScreen, true)
      })

      it('returns the AttachmentsBox component', () => {
        expect(TestUtils.isElementOfType(component.renderAttachmentsBox(), FileDropTarget)).toEqual(
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
        expect(TestUtils.isElementOfType(result, ReconnectionBubble)).toEqual(true)
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

      it('returns a AgentDetailsPage component', () => {
        expect(TestUtils.isElementOfType(component, AgentDetailsPage)).toEqual(true)
      })
    })
  })

  describe('toggleMenu', () => {
    let component, menuVisible, keypress, focusSpy

    beforeEach(() => {
      component = domRender(<ChatOnline menuVisible={menuVisible} />)

      jasmine.clock().install()
      focusSpy = jasmine.createSpy('focus')
      component.menu = {
        focus: focusSpy,
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
