describe('WebWidget component', () => {
  let WebWidget, helpCenterOnContainerClickSpy, submitTicketOnDragEnterSpy, mockUpdateActiveEmbed
  const clearFormSpy = jasmine.createSpy()
  const webWidgetPath = buildSrcPath('component/webWidget/WebWidget')
  const ChatNotificationPopup = noopReactComponent()

  beforeEach(() => {
    mockery.enable()

    mockUpdateActiveEmbed = jasmine.createSpy('updateActiveEmbed')
    helpCenterOnContainerClickSpy = jasmine.createSpy('helpCenterOnContainerClick')
    submitTicketOnDragEnterSpy = jasmine.createSpy('submitTicketOnDragEnter')
    submitTicketOnDragEnterSpy = jasmine.createSpy('submitTicketOnDragEnter')

    class MockAnswerBot extends Component {
      render() {
        return <div ref="answerBot" />
      }
    }

    class MockHelpCenter extends Component {
      constructor() {
        super()
        this.onContainerClick = helpCenterOnContainerClickSpy
      }
      render() {
        return <div ref="helpCenter" />
      }
    }

    class MockSupport extends Component {
      constructor() {
        super()
      }
      render() {
        return <div ref="support" />
      }
    }

    class MockSubmitTicket extends Component {
      constructor() {
        super()
        this.state = {
          selectedTicketForm: null
        }
        this.clearForm = clearFormSpy
        this.handleDragEnter = submitTicketOnDragEnterSpy
      }
      render() {
        return <div ref="ticketSubmissionForm" />
      }
    }

    class MockChat extends Component {
      constructor() {
        super()
        this.state = {}
      }
      render() {
        return <div ref="chat" />
      }
    }

    initMockRegistry({
      React: React,
      'component/container/Container': {
        Container: class extends Component {
          render() {
            return <div>{this.props.children}</div>
          }
        }
      },
      'component/answerBot': connectedComponent(<MockAnswerBot />),
      'component/chat/Chat': connectedComponent(<MockChat />),
      'embeds/helpCenter': connectedComponent(<MockHelpCenter />),
      'embeds/support': connectedComponent(<MockSupport />),
      'src/components/LoadingPage': noopReactComponent(),
      'src/components/LoadingPageErrorBoundary': noopReactComponent(),
      'src/components/Widget/SuspensePage': noopSuspenseComponent(),
      'component/submitTicket/SubmitTicket': connectedComponent(<MockSubmitTicket />),
      'component/webWidget/OnBackProvider': noopReactComponent(),
      'embeds/talk': noopReactComponent(),
      'components/NotificationPopup': noopReactComponent(),
      'embeds/webWidget/selectors/feature-flags': () => undefined,
      'embeds/webWidget/pages/ChannelChoicePage': noopReactComponent(),
      'component/chat/ChatNotificationPopup': { ChatNotificationPopup },
      'src/redux/modules/base': {
        updateActiveEmbed: noop,
        updateEmbedAccessible: noop,
        updateBackButtonVisibility: noop
      },
      'src/redux/modules/chat': {
        chatNotificationDismissed: noop,
        updateChatScreen: noop
      },
      'embeds/helpCenter/actions': {
        closeCurrentArticle: noop
      },
      'src/redux/modules/base/base-selectors': {},
      'src/redux/modules/selectors': {
        getChatNotification: noop,
        getChatOnline: noop
      },
      'src/redux/modules/chat/chat-screen-types': {
        CHATTING_SCREEN: 'chatting'
      },
      'src/redux/modules/talk/talk-selectors': {
        getTalkAvailable: noop
      },
      'embeds/helpCenter/selectors': {
        getArticleViewActive: noop
      },
      'src/redux/modules/submitTicket/submitTicket-selectors': {
        getTicketForms: noop
      },
      'service/settings': {
        settings: { get: noop }
      },
      'src/redux/modules/settings/settings-selectors': {
        getSettingsMobileNotificationsDisabled: noop
      },
      'src/redux/modules/chat/chat-selectors': {},
      'src/redux/modules/answerBot/root/actions': {
        screenChanged: noop
      },
      'src/constants/answerBot': {
        ARTICLE_SCREEN: 'article',
        CONVERSATION_SCREEN: 'conversation'
      },
      'service/history': {
        history: {}
      }
    })

    mockery.registerAllowable(webWidgetPath)
    WebWidget = requireUncached(webWidgetPath).default.WrappedComponent
  })

  afterEach(() => {
    mockery.deregisterAll()
    mockery.disable()
    mockUpdateActiveEmbed.calls.reset()
  })

  describe('#render', () => {
    let webWidget

    beforeEach(() => {
      webWidget = domRender(<WebWidget activeEmbed="helpCenterForm" helpCenterAvailable={true} />)
    })

    it('has a data-embed value', () => {
      expect(ReactDOM.findDOMNode(webWidget).attributes['data-embed']).toBeTruthy()
    })

    it('shows help center component by default', () => {
      expect(webWidget.renderHelpCenter().props.className).not.toContain('u-isHidden')

      expect(webWidget.renderSubmitTicket()).toBeNull()

      expect(webWidget.renderChat()).toBeFalsy()
    })

    describe('when component is set to answerBot', () => {
      beforeEach(() => {
        webWidget = domRender(<WebWidget activeEmbed="answerBot" />)
      })

      it('shows the answerBot component', () => {
        expect(webWidget.renderAnswerBot()).toBeTruthy()
      })
    })

    describe('when component is set to submitTicket', () => {
      beforeEach(() => {
        webWidget = domRender(
          <WebWidget activeEmbed="ticketSubmissionForm" helpCenterAvailable={true} />
        )
      })

      it('shows submit ticket component', () => {
        expect(webWidget.renderHelpCenter()).toBe(null)

        expect(webWidget.renderSubmitTicket()).not.toContain('u-isHidden')

        expect(webWidget.renderChat()).toBeFalsy()
      })
    })

    describe('when component is set to chat', () => {
      beforeEach(() => {
        webWidget = domRender(<WebWidget activeEmbed="chat" helpCenterAvailable={true} />)
      })

      it('shows chat component', () => {
        expect(webWidget.renderHelpCenter()).toBe(null)

        expect(webWidget.renderSubmitTicket()).toBe(null)

        expect(webWidget.renderChat()).toBeTruthy()
      })
    })

    describe('when component is set to talk', () => {
      beforeEach(() => {
        webWidget = domRender(<WebWidget activeEmbed="talk" />)
      })

      it('shows talk component', () => {
        expect(webWidget.renderTalk()).toBeTruthy()
      })
    })

    describe('when not on mobile', () => {
      describe('when props.standaloneMobileNotificationVisible is true', () => {
        beforeEach(() => {
          webWidget = instanceRender(
            <WebWidget isMobile={false} chatStandaloneMobileNotificationVisible={true} />
          )
          spyOn(webWidget, 'renderStandaloneChatPopup')
          webWidget.render()
        })

        it('does not show the standaloneChatPopup', () => {
          expect(webWidget.renderStandaloneChatPopup).not.toHaveBeenCalled()
        })
      })
    })

    describe('when on mobile', () => {
      describe('when props.standaloneMobileNotificationVisible is true', () => {
        beforeEach(() => {
          webWidget = instanceRender(
            <WebWidget isMobile={true} chatStandaloneMobileNotificationVisible={true} />
          )
          spyOn(webWidget, 'renderStandaloneChatPopup')
          webWidget.render()
        })

        it('shows the standaloneChatPopup', () => {
          expect(webWidget.renderStandaloneChatPopup).toHaveBeenCalled()
        })
      })

      describe('when props.mobileNotificationsDisabled is true', () => {
        beforeEach(() => {
          webWidget = instanceRender(
            <WebWidget
              isMobile={true}
              chatStandaloneMobileNotificationVisible={true}
              mobileNotificationsDisabled={true}
            />
          )
          spyOn(webWidget, 'renderStandaloneChatPopup')
          webWidget.render()
        })

        it('does not show the standaloneChatPopup', () => {
          expect(webWidget.renderStandaloneChatPopup).not.toHaveBeenCalled()
        })
      })
    })
  })

  describe('render', () => {
    let webWidget,
      container,
      result,
      expectedStyle = {
        left: '50%',
        transform: 'translate(-50%)'
      }

    describe('when isPopout (fullscreen is true)', () => {
      beforeEach(() => {
        webWidget = instanceRender(<WebWidget isMobile={false} fullscreen={true} />)
        result = webWidget.render()
        container = result.props.children
      })

      it('style is the expected popout style', () => {
        expect(container.props.style).toEqual(expectedStyle)
      })
    })
  })

  describe('renderStandaloneChatPopup', () => {
    let webWidget, result, container, chatPopup, mockChatNotification

    beforeEach(() => {
      mockChatNotification = { show: false }

      webWidget = domRender(<WebWidget chatNotification={mockChatNotification} />)
      result = webWidget.renderStandaloneChatPopup()
      container = result.props.children
      chatPopup = container.props.children
    })

    it('renders a Container with the correct styles', () => {
      expect(container.props.style).toEqual(jasmine.objectContaining({ background: 'transparent' }))
    })

    it('renders a ChatNotificationPopup with the correct props', () => {
      const expectedProps = {
        isMobile: true,
        notification: { ...mockChatNotification, show: true }
      }

      expect(chatPopup.props).toEqual(jasmine.objectContaining(expectedProps))
    })

    describe('when ChatNotificationPopup respond prop is called', () => {
      let chatNotificationRespondSpy

      beforeEach(() => {
        chatNotificationRespondSpy = jasmine.createSpy('chatNotificationRespond')
        webWidget = domRender(
          <WebWidget
            chatNotification={mockChatNotification}
            chatNotificationRespond={chatNotificationRespondSpy}
          />
        )

        result = webWidget.renderStandaloneChatPopup()
        container = result.props.children
        chatPopup = container.props.children

        chatPopup.props.chatNotificationRespond()
      })

      it('calls props.chatNotificationRespond', () => {
        expect(chatNotificationRespondSpy).toHaveBeenCalled()
      })
    })
  })

  describe('renderChat', () => {
    const updateBackButtonVisibilitySpy = jasmine.createSpy('updateBackButtonVisibility')
    let webWidget, mockIsChannelChoiceAvailable, mockHelpCenterAvailable

    beforeEach(() => {
      webWidget = instanceRender(
        <WebWidget
          updateBackButtonVisibility={updateBackButtonVisibilitySpy}
          channelChoiceAvailable={mockIsChannelChoiceAvailable}
          helpCenterAvailable={mockHelpCenterAvailable}
          activeEmbed="chat"
          showOfflineChat={true}
        />
      )
    })

    describe('the function passed to updateChatBackButtonVisibility', () => {
      let chatComponent

      describe('when isHelpCenterAvailable is true', () => {
        beforeAll(() => {
          mockIsChannelChoiceAvailable = false
          mockHelpCenterAvailable = true
        })

        beforeEach(() => {
          chatComponent = webWidget.renderChat()
          chatComponent.props.updateChatBackButtonVisibility()
        })

        it('calls updateBackButtonVisibility with true', () => {
          expect(updateBackButtonVisibilitySpy).toHaveBeenCalledWith(true)
        })
      })

      describe('when isChannelChoiceAvailable is true', () => {
        beforeAll(() => {
          mockIsChannelChoiceAvailable = true
          mockHelpCenterAvailable = false
        })

        beforeEach(() => {
          chatComponent = webWidget.renderChat()
          chatComponent.props.updateChatBackButtonVisibility()
        })

        it('calls updateBackButtonVisibility with true', () => {
          expect(updateBackButtonVisibilitySpy).toHaveBeenCalledWith(true)
        })
      })

      describe('when isChannelChoiceAvailable and isHelpCenterAvailable are false', () => {
        beforeAll(() => {
          mockIsChannelChoiceAvailable = false
          mockHelpCenterAvailable = false
        })

        beforeEach(() => {
          chatComponent = webWidget.renderChat()
          chatComponent.props.updateChatBackButtonVisibility()
        })

        it('calls updateBackButtonVisibility with false', () => {
          expect(updateBackButtonVisibilitySpy).toHaveBeenCalledWith(false)
        })
      })
    })
  })
})
