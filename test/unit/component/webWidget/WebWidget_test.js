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
      'component/submitTicket/SubmitTicket': connectedComponent(<MockSubmitTicket />),
      'component/webWidget/OnBackProvider': noopReactComponent(),
      'embeds/talk': noopReactComponent(),
      'embeds/support/selectors': {
        getNewSupportEmbedEnabled: () => false
      },
      'component/channelChoice/ChannelChoice': {
        ChannelChoice: noopReactComponent()
      },
      'component/chat/ChatNotificationPopup': { ChatNotificationPopup },
      'src/redux/modules/base': {
        updateActiveEmbed: noop,
        updateEmbedAccessible: noop,
        updateBackButtonVisibility: noop
      },
      'src/redux/modules/chat': {
        chatNotificationDismissed: noop,
        updateChatScreen: noop,
        proactiveChatNotificationDismissed: noop
      },
      'embeds/helpCenter/actions': {
        closeCurrentArticle: noop
      },
      'src/redux/modules/base/base-selectors': {
        getZopimChatEmbed: noop
      },
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

    it('renders the chatPopup component', () => {
      const chatNotification = webWidget.renderChatNotification()

      expect(TestUtils.isElementOfType(chatNotification, ChatNotificationPopup)).toEqual(true)
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

      it('does not render the chatPopup component', () => {
        expect(webWidget.renderChatNotification()).toBeFalsy()
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

      it('does not render the chatPopup component', () => {
        expect(webWidget.renderChatNotification()).toBeFalsy()
      })
    })

    describe('when component is set to talk', () => {
      beforeEach(() => {
        webWidget = domRender(<WebWidget activeEmbed="talk" />)
      })

      it('shows talk component', () => {
        expect(webWidget.renderTalk()).toBeTruthy()
      })

      it('does not render the chatPopup component', () => {
        expect(webWidget.renderChatNotification()).toBeFalsy()
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

  describe('dismissStandaloneChatPopup', () => {
    let webWidget, proactiveChatNotificationDismissedSpy, closeFrameSpy

    beforeEach(() => {
      proactiveChatNotificationDismissedSpy = jasmine.createSpy(
        'proactiveChatNotificationDismissed'
      )
      closeFrameSpy = jasmine.createSpy('closeFrame')
      webWidget = instanceRender(
        <WebWidget
          proactiveChatNotificationDismissed={proactiveChatNotificationDismissedSpy}
          closeFrame={closeFrameSpy}
        />
      )

      webWidget.dismissStandaloneChatPopup()
    })

    it('calls props.proactiveChatNotificationDismissed', () => {
      expect(proactiveChatNotificationDismissedSpy).toHaveBeenCalled()
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
        shouldShow: true,
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

  describe('renderChatNotification', () => {
    let result,
      chatNotification,
      chatNotificationDismissedSpy,
      chatNotificationRespondSpy,
      updateActiveEmbedSpy

    describe('when props.chatNotificationRespond is called', () => {
      beforeEach(() => {
        chatNotificationRespondSpy = jasmine.createSpy('chatNotificationRespond')
        updateActiveEmbedSpy = jasmine.createSpy('updateActiveEmbed')

        result = instanceRender(
          <WebWidget
            activeEmbed="helpCenterForm"
            hasSearched={true}
            chatNotificationRespond={chatNotificationRespondSpy}
            updateActiveEmbed={updateActiveEmbedSpy}
          />
        )

        const chatNotification = result.renderChatNotification()

        chatNotification.props.chatNotificationRespond()
      })

      it('calls chatNotificationRespond', () => {
        expect(chatNotificationRespondSpy).toHaveBeenCalled()
      })

      it('calls updateActiveEmbed with chat', () => {
        expect(updateActiveEmbedSpy).toHaveBeenCalledWith('chat')
      })
    })

    describe('when props.chatNotificationDismissed is called', () => {
      beforeEach(() => {
        chatNotificationDismissedSpy = jasmine.createSpy('chatNotificationDismissed')

        result = instanceRender(
          <WebWidget
            activeEmbed="helpCenterForm"
            hasSearched={true}
            chatNotificationDismissed={chatNotificationDismissedSpy}
          />
        )

        const chatNotification = result.renderChatNotification()

        chatNotification.props.chatNotificationDismissed()
      })

      it('calls chatNotificationDismissed', () => {
        expect(chatNotificationDismissedSpy).toHaveBeenCalled()
      })
    })

    describe('when activeEmbed is not helpCenter', () => {
      beforeEach(() => {
        const result = instanceRender(<WebWidget activeEmbed="chat" hasSearched={true} />)

        chatNotification = result.renderChatNotification()
      })

      it('does not render the ChatNotificationPopup component', () => {
        expect(chatNotification).toEqual(null)
      })
    })

    describe('when the activeEmbed is helpCenter and it has previously searched', () => {
      beforeEach(() => {
        const result = instanceRender(<WebWidget activeEmbed="helpCenterForm" hasSearched={true} />)

        chatNotification = result.renderChatNotification()
      })

      it('renders the ChatNotificationPopup component', () => {
        expect(TestUtils.isElementOfType(chatNotification, ChatNotificationPopup)).toEqual(true)
      })
    })

    describe('when props.isMobile and props.helpCenterSearchFocused are true', () => {
      beforeEach(() => {
        const webWidget = instanceRender(
          <WebWidget
            activeEmbed="helpCenterForm"
            hasSearched={true}
            isMobile={true}
            helpCenterSearchFocused={true}
          />
        )

        result = webWidget.renderChatNotification()
      })

      it('pass shouldShow as false to ChatNotificationPopup', () => {
        expect(result.props.shouldShow).toEqual(false)
      })
    })

    describe('when props.isMobile is false', () => {
      beforeEach(() => {
        const webWidget = instanceRender(
          <WebWidget
            activeEmbed="helpCenterForm"
            hasSearched={true}
            isMobile={false}
            helpCenterSearchFocused={true}
          />
        )

        result = webWidget.renderChatNotification()
      })

      it('pass shouldShow as true to ChatNotificationPopup', () => {
        expect(result.props.shouldShow).toEqual(true)
      })
    })
  })

  describe('onBackClick', () => {
    let component,
      componentProps,
      updateBackButtonVisibilitySpy,
      closeCurrentArticleSpy,
      updateActiveEmbedSpy,
      clearFormSpy

    beforeEach(() => {
      updateBackButtonVisibilitySpy = jasmine.createSpy('updateBackButtonVisibility')
      closeCurrentArticleSpy = jasmine.createSpy('closeCurrentArticleSpy')
      updateActiveEmbedSpy = jasmine.createSpy('updateActiveEmbed')
      clearFormSpy = jasmine.createSpy('clearForm')

      _.assign(componentProps, {
        updateBackButtonVisibility: updateBackButtonVisibilitySpy,
        closeCurrentArticle: closeCurrentArticleSpy,
        updateActiveEmbed: updateActiveEmbedSpy,
        clearForm: clearFormSpy
      })

      component = instanceRender(<WebWidget {...componentProps} />)

      spyOn(component, 'showHelpCenter')
      spyOn(component, 'getActiveComponent').and.callFake(() => ({
        clearForm: clearFormSpy
      }))

      component.onBackClick()
    })

    describe('when the activeEmbed is answerBot', () => {
      const updateAnswerBotScreen = jasmine.createSpy()

      beforeAll(() => {
        componentProps = {
          activeEmbed: 'answerBot',
          updateAnswerBotScreen
        }
      })

      it('calls updateBackButtonVisibility prop', () => {
        expect(updateBackButtonVisibilitySpy).toHaveBeenCalled()
      })

      it('calls updateAnswerBotScreen with conversation', () => {
        expect(updateAnswerBotScreen).toHaveBeenCalledWith('conversation')
      })
    })

    describe('when the activeEmbed is Chat', () => {
      let closedChatHistorySpy, mockGetShowChatHistory

      describe('and in ChatHistoryScreen', () => {
        beforeAll(() => {
          mockGetShowChatHistory = true
          closedChatHistorySpy = jasmine.createSpy('closedChatHistory')
          componentProps = {
            activeEmbed: 'chat',
            closedChatHistory: closedChatHistorySpy,
            showChatHistory: mockGetShowChatHistory
          }
        })

        it('calls closedChatHistory', () => {
          expect(closedChatHistorySpy).toHaveBeenCalled()
        })
      })

      describe('when not in chatHistoryScreen', () => {
        beforeEach(() => {
          mockGetShowChatHistory = false
          closedChatHistorySpy = jasmine.createSpy('closedChatHistory')
          componentProps = {
            activeEmbed: 'chat',
            closedChatHistory: closedChatHistorySpy,
            showChatHistory: mockGetShowChatHistory
          }
        })

        it('does not call closedChatHistory', () => {
          expect(closedChatHistorySpy).not.toHaveBeenCalled()
        })
      })
    })

    describe('when answer bot is available but not the active component', () => {
      beforeAll(() => {
        componentProps = {
          answerBotAvailable: true,
          activeEmbed: 'ticketSubmissionForm'
        }
      })

      it('calls updateBackButtonVisibility prop', () => {
        expect(updateBackButtonVisibilitySpy).toHaveBeenCalled()
      })

      it('calls updateActiveEmbed with answerBot', () => {
        expect(updateActiveEmbedSpy).toHaveBeenCalledWith('answerBot')
      })
    })

    describe('when showTicketFormsBackButton is true', () => {
      beforeAll(() => {
        componentProps = { showTicketFormsBackButton: true }
      })

      describe('when helpCenterAvailable is true', () => {
        beforeAll(() => {
          _.assign(componentProps, { helpCenterAvailable: true })
        })

        it('calls clearForm on the rootComponent', () => {
          expect(clearFormSpy).toHaveBeenCalled()
        })

        it('calls updateBackButtonVisibility with true', () => {
          expect(updateBackButtonVisibilitySpy).toHaveBeenCalledWith(true)
        })
      })

      describe('when channelChoiceAvailable is true', () => {
        beforeAll(() => {
          _.assign(componentProps, { channelChoiceAvailable: true })
        })

        it('calls clearForm on the rootComponent', () => {
          expect(clearFormSpy).toHaveBeenCalled()
        })

        it('calls updateBackButtonVisibility with true', () => {
          expect(updateBackButtonVisibilitySpy).toHaveBeenCalledWith(true)
        })
      })

      describe('when helpCenterAvailable and channelChoiceAvailable are false', () => {
        beforeAll(() => {
          _.assign(componentProps, {
            helpCenterAvailable: false,
            channelChoiceAvailable: false
          })
        })

        it('calls clearForm on the rootComponent', () => {
          expect(clearFormSpy).toHaveBeenCalled()
        })

        it('calls updateBackButtonVisibility with false', () => {
          expect(updateBackButtonVisibilitySpy).toHaveBeenCalledWith(false)
        })
      })
    })

    describe('when activeEmbed is not channelChoice', () => {
      beforeAll(() => {
        _.assign(componentProps, {
          channelChoiceAvailable: true,
          activeEmbed: 'channelChoice',
          helpCenterAvailable: true
        })
      })

      it('calls updateActiveEmbed with channelChoice', () => {
        expect(clearFormSpy).toHaveBeenCalled()
      })

      it('calls updateBackButtonVisibility expected values', () => {
        expect(updateBackButtonVisibilitySpy).toHaveBeenCalledWith(
          componentProps.helpCenterAvailable
        )
      })
    })

    describe('when helpCenterAvailable is true', () => {
      beforeAll(() => {
        componentProps = { helpCenterAvailable: true }
      })

      it('calls showHelpCenter', () => {
        expect(component.showHelpCenter).toHaveBeenCalled()
      })
    })

    describe('when none of the previous conditions are true', () => {
      describe('when ipmHelpCenterAvailable is true', () => {
        beforeAll(() => {
          componentProps = { ipmHelpCenterAvailable: true }
        })

        it('calls closeCurrentArticle', () => {
          expect(closeCurrentArticleSpy).toHaveBeenCalled()
        })

        it('calls updateActiveEmbed with channelChoice', () => {
          expect(updateActiveEmbedSpy).toHaveBeenCalledWith('channelChoice')
        })

        it('calls updateBackButtonVisibility with false', () => {
          expect(updateBackButtonVisibilitySpy).toHaveBeenCalledWith(false)
        })
      })

      describe('when ipmHelpCenterAvailable is false', () => {
        beforeAll(() => {
          componentProps = { ipmHelpCenterAvailable: false }
        })

        it('does not call closeCurrentArticle', () => {
          expect(closeCurrentArticleSpy).not.toHaveBeenCalled()
        })

        it('calls updateActiveEmbed with channelChoice', () => {
          expect(updateActiveEmbedSpy).toHaveBeenCalledWith('channelChoice')
        })

        it('calls updateBackButtonVisibility with false', () => {
          expect(updateBackButtonVisibilitySpy).toHaveBeenCalledWith(false)
        })
      })
    })
  })

  describe('showProactiveChat', () => {
    let webWidget

    describe('when on mobile', () => {
      let showStandaloneMobileNotificationSpy

      beforeEach(() => {
        showStandaloneMobileNotificationSpy = jasmine.createSpy('showStandaloneMobileNotification')
        webWidget = instanceRender(
          <WebWidget
            oldChat={false}
            isMobile={true}
            showStandaloneMobileNotification={showStandaloneMobileNotificationSpy}
          />
        )
        webWidget.showProactiveChat()
      })

      it('calls showStandaloneMobileNotification', () => {
        expect(showStandaloneMobileNotificationSpy).toHaveBeenCalled()
      })
    })

    describe('when not on mobile', () => {
      const mockChatNotification = { proactive: true, show: true }

      beforeEach(() => {
        webWidget = instanceRender(
          <WebWidget oldChat={false} isMobile={false} chatNotification={mockChatNotification} />
        )
        webWidget.showProactiveChat()
      })
    })
  })

  describe('#onContainerDragEnter', () => {
    let webWidget

    describe('when the activeEmbed is submitTicket', () => {
      beforeEach(() => {
        webWidget = domRender(
          <WebWidget
            submitTicketAvailable={true}
            helpCenterAvailable={true}
            activeEmbed="ticketSubmissionForm"
          />
        )

        webWidget.onContainerDragEnter()
      })

      it('calls the submitTicket onDragEnter handler', () => {
        expect(submitTicketOnDragEnterSpy).toHaveBeenCalled()
      })
    })

    describe('when the activeEmbed is not submitTicket', () => {
      beforeEach(() => {
        webWidget = domRender(
          <WebWidget
            submitTicketAvailable={true}
            helpCenterAvailable={true}
            activeEmbed="helpCenter"
          />
        )

        webWidget.onContainerDragEnter()
      })

      it('does not call the submitTicket onDragEnter handler', () => {
        expect(submitTicketOnDragEnterSpy).not.toHaveBeenCalled()
      })
    })
  })
})
