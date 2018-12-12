describe('WebWidget component', () => {
  let WebWidget,
    chatOnContainerClickSpy,
    helpCenterOnContainerClickSpy,
    submitTicketOnDragEnterSpy,
    mockUpdateActiveEmbed;
  const clearFormSpy = jasmine.createSpy();
  const webWidgetPath = buildSrcPath('component/webWidget/WebWidget');
  const ChatNotificationPopup = noopReactComponent();

  beforeEach(() => {
    mockery.enable();

    mockUpdateActiveEmbed = jasmine.createSpy('updateActiveEmbed');
    chatOnContainerClickSpy = jasmine.createSpy('chatOnContainerClick');
    helpCenterOnContainerClickSpy = jasmine.createSpy('helpCenterOnContainerClick');
    submitTicketOnDragEnterSpy = jasmine.createSpy('submitTicketOnDragEnter');

    class MockHelpCenter extends Component {
      constructor() {
        super();
        this.onContainerClick = helpCenterOnContainerClickSpy;
      }
      render() {
        return <div ref='helpCenter' />;
      }
    }

    class MockSubmitTicket extends Component {
      constructor() {
        super();
        this.state = {
          selectedTicketForm: null
        };
        this.clearForm = clearFormSpy;
        this.handleDragEnter = submitTicketOnDragEnterSpy;
      }
      render() {
        return <div ref='ticketSubmissionForm' />;
      }
    }

    class MockChat extends Component {
      constructor() {
        super();
        this.state = {};
        this.onContainerClick = chatOnContainerClickSpy;
      }
      render() {
        return <div ref='chat' />;
      }
    }

    class MockTalk extends Component {
      constructor() {
        super();
        this.state = {};
      }
      render() {
        return <div ref='talk' />;
      }
    }

    initMockRegistry({
      'React': React,
      'component/container/Container': {
        Container: class extends Component {
          render() {
            return <div>{this.props.children}</div>;
          }
        }
      },
      'component/chat/Chat': connectedComponent(<MockChat />),
      'component/helpCenter/HelpCenter': connectedComponent(<MockHelpCenter />),
      'component/submitTicket/SubmitTicket': connectedComponent(<MockSubmitTicket />),
      'component/talk/Talk': connectedComponent(<MockTalk />),
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
      'src/redux/modules/helpCenter': {
        resetActiveArticle: noop
      },
      'src/redux/modules/base/base-selectors': {
        getZopimChatEmbed: noop
      },
      'src/redux/modules/chat/chat-selectors': {
        getChatNotification: noop
      },
      'src/redux/modules/chat/chat-screen-types': {
        CHATTING_SCREEN: 'chatting'
      },
      'src/redux/modules/talk/talk-selectors': {
        getTalkAvailable: noop
      },
      'src/redux/modules/helpCenter/helpCenter-selectors': {
        getArticleViewActive: noop
      },
      'src/redux/modules/submitTicket/submitTicket-selectors': {
        getTicketForms: noop
      },
      'src/redux/modules/selectors': {
        getChatOnline: noop
      },
      'service/settings': {
        settings: { get: noop }
      },
      'src/redux/modules/settings/settings-selectors': {
        getSettingsMobileNotificationsDisabled: noop
      }
    });

    mockery.registerAllowable(webWidgetPath);
    WebWidget = requireUncached(webWidgetPath).default.WrappedComponent;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
    mockUpdateActiveEmbed.calls.reset();
  });

  describe('#render', () => {
    let webWidget;

    beforeEach(() => {
      webWidget = domRender(<WebWidget activeEmbed='helpCenterForm' helpCenterAvailable={true} />);
    });

    it('has a data-embed value', () => {
      expect(ReactDOM.findDOMNode(webWidget).attributes['data-embed'])
        .toBeTruthy();
    });

    it('shows help center component by default', () => {
      expect(webWidget.renderHelpCenter().props.className)
        .not.toContain('u-isHidden');

      expect(webWidget.renderSubmitTicket())
        .toBeNull();

      expect(webWidget.renderChat())
        .toBeFalsy();
    });

    it('renders the chatPopup component', () => {
      const chatNotification = webWidget.renderChatNotification();

      expect(TestUtils.isElementOfType(chatNotification, ChatNotificationPopup))
        .toEqual(true);
    });

    describe('when component is set to submitTicket', () => {
      beforeEach(() => {
        webWidget = domRender(<WebWidget activeEmbed='ticketSubmissionForm' helpCenterAvailable={true} />);
      });

      it('shows submit ticket component', () => {
        expect(webWidget.renderHelpCenter())
          .toBe(null);

        expect(webWidget.renderSubmitTicket())
          .not.toContain('u-isHidden');

        expect(webWidget.renderChat())
          .toBeFalsy();
      });

      it('does not render the chatPopup component', () => {
        expect(webWidget.renderChatNotification())
          .toBeFalsy();
      });
    });

    describe('when component is set to chat', () => {
      beforeEach(() => {
        webWidget = domRender(<WebWidget activeEmbed='chat' helpCenterAvailable={true} />);
      });

      it('shows chat component', () => {
        expect(webWidget.renderHelpCenter())
          .toBe(null);

        expect(webWidget.renderSubmitTicket())
          .toBe(null);

        expect(webWidget.renderChat())
          .toBeTruthy();
      });

      it('does not render the chatPopup component', () => {
        expect(webWidget.renderChatNotification())
          .toBeFalsy();
      });
    });

    describe('when component is set to talk', () => {
      beforeEach(() => {
        webWidget = domRender(<WebWidget activeEmbed='talk' />);
      });

      it('shows talk component', () => {
        expect(webWidget.renderTalk())
          .toBeTruthy();
      });

      it('does not render the chatPopup component', () => {
        expect(webWidget.renderChatNotification())
          .toBeFalsy();
      });
    });

    describe('when not on mobile', () => {
      describe('when props.standaloneMobileNotificationVisible is true', () => {
        beforeEach(() => {
          webWidget = instanceRender(
            <WebWidget
              fullscreen={false}
              chatStandaloneMobileNotificationVisible={true} />
          );
          spyOn(webWidget, 'renderStandaloneChatPopup');
          webWidget.render();
        });

        it('does not show the standaloneChatPopup', () => {
          expect(webWidget.renderStandaloneChatPopup)
            .not.toHaveBeenCalled();
        });
      });
    });

    describe('when on mobile', () => {
      describe('when props.standaloneMobileNotificationVisible is true', () => {
        beforeEach(() => {
          webWidget = instanceRender(
            <WebWidget
              fullscreen={true}
              chatStandaloneMobileNotificationVisible={true} />
          );
          spyOn(webWidget, 'renderStandaloneChatPopup');
          webWidget.render();
        });

        it('shows the standaloneChatPopup', () => {
          expect(webWidget.renderStandaloneChatPopup)
            .toHaveBeenCalled();
        });
      });

      describe('when props.mobileNotificationsDisabled is true', () => {
        beforeEach(() => {
          webWidget = instanceRender(
            <WebWidget
              fullscreen={true}
              chatStandaloneMobileNotificationVisible={true}
              mobileNotificationsDisabled={true} />
          );
          spyOn(webWidget, 'renderStandaloneChatPopup');
          webWidget.render();
        });

        it('does not show the standaloneChatPopup', () => {
          expect(webWidget.renderStandaloneChatPopup)
            .not
            .toHaveBeenCalled();
        });
      });
    });
  });

  describe('dismissStandaloneChatPopup', () => {
    let webWidget,
      proactiveChatNotificationDismissedSpy,
      closeFrameSpy;

    beforeEach(() => {
      proactiveChatNotificationDismissedSpy = jasmine.createSpy('proactiveChatNotificationDismissed');
      closeFrameSpy = jasmine.createSpy('closeFrame');
      webWidget = instanceRender(
        <WebWidget
          proactiveChatNotificationDismissed={proactiveChatNotificationDismissedSpy}
          closeFrame={closeFrameSpy} />
      );

      webWidget.dismissStandaloneChatPopup();
    });

    it('calls props.proactiveChatNotificationDismissed', () => {
      expect(proactiveChatNotificationDismissedSpy)
        .toHaveBeenCalled();
    });
  });

  describe('renderStandaloneChatPopup', () => {
    let webWidget,
      result,
      container,
      chatPopup,
      mockChatNotification;

    beforeEach(() => {
      mockChatNotification = { show: false };

      webWidget = domRender(<WebWidget chatNotification={mockChatNotification} />);
      result = webWidget.renderStandaloneChatPopup();
      container = result.props.children;
      chatPopup = container.props.children;
    });

    it('renders a Container with the correct styles', () => {
      expect(container.props.style)
        .toEqual(jasmine.objectContaining({ background: 'transparent' }));
    });

    it('renders a ChatNotificationPopup with the correct props', () => {
      const expectedProps = {
        isMobile: true,
        shouldShow: true,
        notification: { ...mockChatNotification, show: true }
      };

      expect(chatPopup.props)
        .toEqual(jasmine.objectContaining(expectedProps));
    });

    describe('when ChatNotificationPopup respond prop is called', () => {
      let chatNotificationRespondSpy,
        onShowMobileSpy;

      beforeEach(() => {
        chatNotificationRespondSpy = jasmine.createSpy('chatNotificationRespond');
        onShowMobileSpy = jasmine.createSpy('onShowMobile');
        webWidget = domRender(
          <WebWidget
            chatNotification={mockChatNotification}
            chatNotificationRespond={chatNotificationRespondSpy}
            onShowMobile={onShowMobileSpy} />
        );

        result = webWidget.renderStandaloneChatPopup();
        container = result.props.children;
        chatPopup = container.props.children;

        spyOn(webWidget, 'showChat');
        chatPopup.props.chatNotificationRespond();
      });

      it('calls props.chatNotificationRespond', () => {
        expect(chatNotificationRespondSpy)
          .toHaveBeenCalled();
      });

      it('calls props.onShowMobile', () => {
        expect(onShowMobileSpy)
          .toHaveBeenCalled();
      });

      it('calls showChat with proactive true', () => {
        expect(webWidget.showChat)
          .toHaveBeenCalledWith({ proactive: true });
      });
    });
  });

  describe('renderChat', () => {
    const updateBackButtonVisibilitySpy = jasmine.createSpy('updateBackButtonVisibility');
    let webWidget,
      mockIsChannelChoiceAvailable,
      mockHelpCenterAvailable;

    beforeEach(() => {
      webWidget = instanceRender(
        <WebWidget
          updateBackButtonVisibility={updateBackButtonVisibilitySpy}
          channelChoiceAvailable={mockIsChannelChoiceAvailable}
          helpCenterAvailable={mockHelpCenterAvailable}
          activeEmbed='chat'
          showOfflineChat={true} />
      );
    });

    describe('the function passed to updateChatBackButtonVisibility', () => {
      let chatComponent;

      describe('when isHelpCenterAvailable is true', () => {
        beforeAll(() => {
          mockIsChannelChoiceAvailable = false;
          mockHelpCenterAvailable = true;
        });

        beforeEach(() => {
          chatComponent = webWidget.renderChat();
          chatComponent.props.updateChatBackButtonVisibility();
        });

        it('calls updateBackButtonVisibility with true', () => {
          expect(updateBackButtonVisibilitySpy)
            .toHaveBeenCalledWith(true);
        });
      });

      describe('when isChannelChoiceAvailable is true', () => {
        beforeAll(() => {
          mockIsChannelChoiceAvailable = true;
          mockHelpCenterAvailable = false;
        });

        beforeEach(() => {
          chatComponent = webWidget.renderChat();
          chatComponent.props.updateChatBackButtonVisibility();
        });

        it('calls updateBackButtonVisibility with true', () => {
          expect(updateBackButtonVisibilitySpy)
            .toHaveBeenCalledWith(true);
        });
      });

      describe('when isChannelChoiceAvailable and isHelpCenterAvailable are false', () => {
        beforeAll(() => {
          mockIsChannelChoiceAvailable = false;
          mockHelpCenterAvailable = false;
        });

        beforeEach(() => {
          chatComponent = webWidget.renderChat();
          chatComponent.props.updateChatBackButtonVisibility();
        });

        it('calls updateBackButtonVisibility with false', () => {
          expect(updateBackButtonVisibilitySpy)
            .toHaveBeenCalledWith(false);
        });
      });
    });
  });

  describe('renderChatNotification', () => {
    let result,
      chatNotification,
      chatNotificationDismissedSpy,
      chatNotificationRespondSpy;

    describe('when props.chatNotificationRespond is called', () => {
      beforeEach(() => {
        chatNotificationRespondSpy = jasmine.createSpy('chatNotificationRespond');

        result = instanceRender(
          <WebWidget
            activeEmbed='helpCenterForm'
            hasSearched={true}
            chatNotificationRespond={chatNotificationRespondSpy} />
        );

        spyOn(result, 'onNextClick');

        const chatNotification = result.renderChatNotification();

        chatNotification.props.chatNotificationRespond();
      });

      it('calls onNextClick with chat', () => {
        expect(result.onNextClick)
          .toHaveBeenCalledWith('chat');
      });

      it('calls chatNotificationRespond', () => {
        expect(chatNotificationRespondSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when props.chatNotificationDismissed is called', () => {
      beforeEach(() => {
        chatNotificationDismissedSpy = jasmine.createSpy('chatNotificationDismissed');

        result = instanceRender(
          <WebWidget
            activeEmbed='helpCenterForm'
            hasSearched={true}
            chatNotificationDismissed={chatNotificationDismissedSpy} />
        );

        const chatNotification = result.renderChatNotification();

        chatNotification.props.chatNotificationDismissed();
      });

      it('calls chatNotificationDismissed', () => {
        expect(chatNotificationDismissedSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when activeEmbed is not helpCenter', () => {
      beforeEach(() => {
        const result = instanceRender(
          <WebWidget
            activeEmbed='chat'
            hasSearched={true} />
        );

        chatNotification = result.renderChatNotification();
      });

      it('does not render the ChatNotificationPopup component', () => {
        expect(chatNotification)
          .toEqual(null);
      });
    });

    describe('when the activeEmbed is helpCenter and it has previously searched', () => {
      beforeEach(() => {
        const result = instanceRender(
          <WebWidget
            activeEmbed='helpCenterForm'
            hasSearched={true} />
        );

        chatNotification = result.renderChatNotification();
      });

      it('renders the ChatNotificationPopup component', () => {
        expect(TestUtils.isElementOfType(chatNotification, ChatNotificationPopup))
          .toEqual(true);
      });
    });

    describe('when props.fullscreen and props.helpCenterSearchFocused are true', () => {
      beforeEach(() => {
        const webWidget = instanceRender(
          <WebWidget
            activeEmbed='helpCenterForm'
            hasSearched={true}
            fullscreen={true}
            helpCenterSearchFocused={true}
          />
        );

        result = webWidget.renderChatNotification();
      });

      it('pass shouldShow as false to ChatNotificationPopup', () => {
        expect(result.props.shouldShow)
          .toEqual(false);
      });
    });

    describe('when props.fullscreen is false', () => {
      beforeEach(() => {
        const webWidget = instanceRender(
          <WebWidget
            activeEmbed='helpCenterForm'
            hasSearched={true}
            fullscreen={false}
            helpCenterSearchFocused={true}
          />
        );

        result = webWidget.renderChatNotification();
      });

      it('pass shouldShow as true to ChatNotificationPopup', () => {
        expect(result.props.shouldShow)
          .toEqual(true);
      });
    });

    describe('when props.fullscreen is true and props.helpCenterSearchFocused is false', () => {
      beforeEach(() => {
        const webWidget = instanceRender(
          <WebWidget
            activeEmbed='helpCenterForm'
            hasSearched={true}
            fullscreen={true}
            helpCenterSearchFocused={false}
          />
        );

        result = webWidget.renderChatNotification();
      });

      it('pass shouldShow as true to ChatNotificationPopup', () => {
        expect(result.props.shouldShow)
          .toEqual(true);
      });
    });
  });

  describe('#onCancelClick', () => {
    let webWidget;

    describe('when helpCenter is available', () => {
      beforeEach(() => {
        webWidget = instanceRender(<WebWidget helpCenterAvailable={true} />);

        spyOn(webWidget, 'showHelpCenter');

        webWidget.onCancelClick();
      });

      it('calls showHelpCenter', () => {
        expect(webWidget.showHelpCenter)
          .toHaveBeenCalled();
      });
    });

    describe('when help center is not available', () => {
      describe('when channel choice is available', () => {
        beforeEach(() => {
          webWidget = instanceRender(
            <WebWidget
              updateActiveEmbed={mockUpdateActiveEmbed}
              channelChoiceAvailable={true}
              helpCenterAvailable={false} />
          );

          webWidget.onCancelClick();
        });

        it('calls updateActiveEmbed with channelChoice', () => {
          expect(mockUpdateActiveEmbed)
            .toHaveBeenCalledWith('channelChoice');
        });
      });

      describe('when channel choice is not available', () => {
        let onCancelSpy,
          ipmHelpCenterAvailable;

        beforeEach(() => {
          onCancelSpy = jasmine.createSpy('onCancelSpy');
          webWidget = instanceRender(
            <WebWidget
              cancelButtonClicked={onCancelSpy}
              helpCenterAvailable={false}
              ipmHelpCenterAvailable={ipmHelpCenterAvailable}
              updateActiveEmbed={mockUpdateActiveEmbed}
              channelChoiceAvailable={false} />
          );

          webWidget.onCancelClick();
        });

        it('calls cancelButtonClicked prop', () => {
          expect(onCancelSpy)
            .toHaveBeenCalled();
        });
      });
    });
  });

  describe('#onNextClick', () => {
    let webWidget, updateBackButtonVisibilitySpy, nextButtonClickedSpy;

    beforeEach(() => {
      updateBackButtonVisibilitySpy = jasmine.createSpy('updateBackButtonVisibilitySpy');
      nextButtonClickedSpy = jasmine.createSpy('nextButtonClicked');
    });

    afterEach(() => {
      updateBackButtonVisibilitySpy.calls.reset();
    });

    describe('when a param is passed in', () => {
      beforeEach(() => {
        webWidget = instanceRender(
          <WebWidget
            chatOnline={true}
            oldChat={true}
            helpCenterAvailable={true}
            nextButtonClicked={nextButtonClickedSpy}
            updateBackButtonVisibility={updateBackButtonVisibilitySpy}
            updateActiveEmbed={mockUpdateActiveEmbed} />
        );

        webWidget.onNextClick('foo');
      });

      it('calls updateActiveEmbed with that param', () => {
        expect(mockUpdateActiveEmbed)
          .toHaveBeenCalledWith('foo');
      });

      describe('when that param is chat and oldChat is true', () => {
        beforeEach(() => {
          webWidget.onNextClick('chat');
        });

        it('calls updateActiveEmbed with that zopims variable', () => {
          expect(mockUpdateActiveEmbed)
            .toHaveBeenCalledWith('zopimChat');
        });
      });

      it('calls nextButtonClicked', () => {
        expect(nextButtonClickedSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when channelChoice is available', () => {
      beforeEach(() => {
        webWidget = instanceRender(
          <WebWidget
            channelChoiceAvailable={true}
            nextButtonClicked={nextButtonClickedSpy}
            updateBackButtonVisibility={updateBackButtonVisibilitySpy}
            updateActiveEmbed={mockUpdateActiveEmbed} />
        );

        webWidget.onNextClick();
      });

      it('calls updateActiveEmbed with channelChoice', () => {
        expect(mockUpdateActiveEmbed)
          .toHaveBeenCalledWith('channelChoice');
      });

      it('calls updateBackButtonVisibility with true', () => {
        expect(updateBackButtonVisibilitySpy)
          .toHaveBeenCalledWith(true);
      });

      it('calls nextButtonClicked', () => {
        expect(nextButtonClickedSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when channelChoice is not available', () => {
      beforeEach(() => {
        webWidget = instanceRender(
          <WebWidget
            channelChoiceAvailable={false}
            nextButtonClicked={nextButtonClickedSpy}
            updateBackButtonVisibility={updateBackButtonVisibilitySpy}
            updateActiveEmbed={mockUpdateActiveEmbed} />
        );
        webWidget.onNextClick();
      });

      it('does not call updateActiveEmbed with channelChoice', () => {
        expect(mockUpdateActiveEmbed)
          .not.toHaveBeenCalledWith('channelChoice');
      });

      it('calls nextButtonClicked', () => {
        expect(nextButtonClickedSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when chat is online', () => {
      beforeEach(() => {
        webWidget = instanceRender(
          <WebWidget
            chatOnline={true}
            chatAvailable={true}
            helpCenterAvailable={true}
            nextButtonClicked={nextButtonClickedSpy}
            updateBackButtonVisibility={updateBackButtonVisibilitySpy}
            updateActiveEmbed={mockUpdateActiveEmbed} />
        );
        webWidget.onNextClick();
      });

      it('calls updateActiveEmbed with chat', () => {
        expect(mockUpdateActiveEmbed)
          .toHaveBeenCalledWith('chat');
      });

      it('calls updateBackButtonVisibility with true', () => {
        expect(updateBackButtonVisibilitySpy)
          .toHaveBeenCalledWith(true);
      });

      it('calls nextButtonClicked', () => {
        expect(nextButtonClickedSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when chat is offline', () => {
      beforeEach(() => {
        webWidget = instanceRender(
          <WebWidget
            chatOnline={false}
            chatAvailable={false}
            helpCenterAvailable={true}
            nextButtonClicked={nextButtonClickedSpy}
            updateBackButtonVisibility={updateBackButtonVisibilitySpy}
            updateActiveEmbed={mockUpdateActiveEmbed} />
        );
        webWidget.onNextClick();
      });

      it('calls updateActiveEmbed with ticketSubmissionForm', () => {
        expect(mockUpdateActiveEmbed)
          .toHaveBeenCalledWith('ticketSubmissionForm');
      });

      it('calls updateBackButtonVisibility with true', () => {
        expect(updateBackButtonVisibilitySpy)
          .toHaveBeenCalledWith(true);
      });

      it('calls nextButtonClicked', () => {
        expect(nextButtonClickedSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when chat is offline but offline form is available', () => {
      beforeEach(() => {
        webWidget = instanceRender(
          <WebWidget
            chatOnline={false}
            chatAvailable={false}
            helpCenterAvailable={true}
            chatOfflineAvailable={true}
            nextButtonClicked={nextButtonClickedSpy}
            updateBackButtonVisibility={updateBackButtonVisibilitySpy}
            updateActiveEmbed={mockUpdateActiveEmbed} />
        );
        webWidget.onNextClick();
      });

      it('calls updateActiveEmbed with chat', () => {
        expect(mockUpdateActiveEmbed)
          .toHaveBeenCalledWith('chat');
      });

      it('calls updateBackButtonVisibility with true', () => {
        expect(updateBackButtonVisibilitySpy)
          .toHaveBeenCalledWith(true);
      });

      it('does not call updateActiveEmbed with ticketSubmissionForm', () => {
        expect(mockUpdateActiveEmbed)
          .not
          .toHaveBeenCalledWith('ticketSubmissionForm');
      });

      it('calls nextButtonClicked', () => {
        expect(nextButtonClickedSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when ipm is activated', () => {
      beforeEach(() => {
        webWidget = instanceRender(
          <WebWidget
            ipmHelpCenterAvailable={true}
            nextButtonClicked={nextButtonClickedSpy}
            updateBackButtonVisibility={updateBackButtonVisibilitySpy}
            updateActiveEmbed={mockUpdateActiveEmbed} />
        );
        webWidget.onNextClick();
      });

      it('calls updateActiveEmbed with ticketSubmissionForm', () => {
        expect(mockUpdateActiveEmbed)
          .toHaveBeenCalledWith('ticketSubmissionForm');
      });

      it('does not update back button visibility', () => {
        expect(updateBackButtonVisibilitySpy)
          .not.toHaveBeenCalled();
      });

      it('calls nextButtonClicked', () => {
        expect(nextButtonClickedSpy)
          .toHaveBeenCalled();
      });
    });
  });

  describe('onBackClick', () => {
    let component,
      componentProps,
      updateBackButtonVisibilitySpy,
      resetActiveArticleSpy,
      updateActiveEmbedSpy,
      clearFormSpy;

    beforeEach(() => {
      updateBackButtonVisibilitySpy = jasmine.createSpy('updateBackButtonVisibility');
      resetActiveArticleSpy = jasmine.createSpy('resetActiveArticle');
      updateActiveEmbedSpy = jasmine.createSpy('updateActiveEmbed');
      clearFormSpy = jasmine.createSpy('clearForm');

      _.assign(componentProps, {
        updateBackButtonVisibility: updateBackButtonVisibilitySpy,
        resetActiveArticle: resetActiveArticleSpy,
        updateActiveEmbed: updateActiveEmbedSpy,
        clearForm: clearFormSpy
      });

      component = instanceRender(<WebWidget {...componentProps} />);

      spyOn(component, 'showHelpCenter');
      spyOn(component, 'getActiveComponent').and.callFake(() => ({
        clearForm: clearFormSpy
      }));

      component.onBackClick();
    });

    describe('when the activeEmbed is helpCenter', () => {
      beforeAll(() => {
        componentProps = { activeEmbed: 'helpCenterForm' };
      });

      describe('when ipmHelpCenterAvailable is true', () => {
        beforeAll(() => {
          _.assign(componentProps, { ipmHelpCenterAvailable: true });
        });

        it('calls updateBackButtonVisibility with false', () => {
          expect(updateBackButtonVisibilitySpy)
            .toHaveBeenCalledWith(false);
        });

        it('calls resetActiveArticleSpy', () => {
          expect(resetActiveArticleSpy)
            .toHaveBeenCalled();
        });

        it('calls updateActiveEmbed with channelChoice', () => {
          expect(updateActiveEmbedSpy)
            .toHaveBeenCalledWith('channelChoice');
        });
      });

      describe('when ipmHelpCenterAvailable is false', () => {
        beforeAll(() => {
          _.assign(componentProps, { ipmHelpCenterAvailable: false });
        });

        it('calls updateBackButtonVisibility with false', () => {
          expect(updateBackButtonVisibilitySpy)
            .toHaveBeenCalledWith(false);
        });

        it('calls resetActiveArticleSpy', () => {
          expect(resetActiveArticleSpy)
            .toHaveBeenCalled();
        });

        it('does not call updateActiveEmbed with channelChoice', () => {
          expect(updateActiveEmbedSpy)
            .not.toHaveBeenCalledWith('channelChoice');
        });
      });
    });

    describe('when showTicketFormsBackButton is true', () => {
      beforeAll(() => {
        componentProps = { showTicketFormsBackButton: true };
      });

      describe('when helpCenterAvailable is true', () => {
        beforeAll(() => {
          _.assign(componentProps, { helpCenterAvailable: true });
        });

        it('calls clearForm on the rootComponent', () => {
          expect(clearFormSpy)
            .toHaveBeenCalled();
        });

        it('calls updateBackButtonVisibility with true', () => {
          expect(updateBackButtonVisibilitySpy)
            .toHaveBeenCalledWith(true);
        });
      });

      describe('when channelChoiceAvailable is true', () => {
        beforeAll(() => {
          _.assign(componentProps, { channelChoiceAvailable: true });
        });

        it('calls clearForm on the rootComponent', () => {
          expect(clearFormSpy)
            .toHaveBeenCalled();
        });

        it('calls updateBackButtonVisibility with true', () => {
          expect(updateBackButtonVisibilitySpy)
            .toHaveBeenCalledWith(true);
        });
      });

      describe('when helpCenterAvailable and channelChoiceAvailable are false', () => {
        beforeAll(() => {
          _.assign(componentProps, {
            helpCenterAvailable: false,
            channelChoiceAvailable: false
          });
        });

        it('calls clearForm on the rootComponent', () => {
          expect(clearFormSpy)
            .toHaveBeenCalled();
        });

        it('calls updateBackButtonVisibility with false', () => {
          expect(updateBackButtonVisibilitySpy)
            .toHaveBeenCalledWith(false);
        });
      });
    });

    describe('when activeEmbed is not channelChoice', () => {
      beforeAll(() => {
        _.assign(componentProps, {
          channelChoiceAvailable: true,
          activeEmbed: 'channelChoice',
          helpCenterAvailable: true
        });
      });

      it('calls updateActiveEmbed with channelChoice', () => {
        expect(clearFormSpy)
          .toHaveBeenCalled();
      });

      it('calls updateBackButtonVisibility expected values', () => {
        expect(updateBackButtonVisibilitySpy)
          .toHaveBeenCalledWith(componentProps.helpCenterAvailable);
      });
    });

    describe('when helpCenterAvailable is true', () => {
      beforeAll(() => {
        componentProps = { helpCenterAvailable: true };
      });

      it('calls showHelpCenter', () => {
        expect(component.showHelpCenter)
          .toHaveBeenCalled();
      });
    });

    describe('when none of the previous conditions are true', () => {
      describe('when ipmHelpCenterAvailable is true', () => {
        beforeAll(() => {
          componentProps = { ipmHelpCenterAvailable: true };
        });

        it('calls resetActiveArticle', () => {
          expect(resetActiveArticleSpy)
            .toHaveBeenCalled();
        });

        it('calls updateActiveEmbed with channelChoice', () => {
          expect(updateActiveEmbedSpy)
            .toHaveBeenCalledWith('channelChoice');
        });

        it('calls updateBackButtonVisibility with false', () => {
          expect(updateBackButtonVisibilitySpy)
            .toHaveBeenCalledWith(false);
        });
      });

      describe('when ipmHelpCenterAvailable is false', () => {
        beforeAll(() => {
          componentProps = { ipmHelpCenterAvailable: false };
        });

        it('does not call resetActiveArticle', () => {
          expect(resetActiveArticleSpy)
            .not.toHaveBeenCalled();
        });

        it('calls updateActiveEmbed with channelChoice', () => {
          expect(updateActiveEmbedSpy)
            .toHaveBeenCalledWith('channelChoice');
        });

        it('calls updateBackButtonVisibility with false', () => {
          expect(updateBackButtonVisibilitySpy)
            .toHaveBeenCalledWith(false);
        });
      });
    });
  });

  describe('#show', () => {
    let webWidget, updateActiveEmbedSpy;

    beforeEach(() => {
      updateActiveEmbedSpy = jasmine.createSpy();
    });

    describe('when there is an active embed', () => {
      describe('when the activeEmbed is submit ticket and chat is online', () => {
        beforeEach(() => {
          webWidget = domRender(
            <WebWidget
              submitTicketAvailable={true}
              updateActiveEmbed={updateActiveEmbedSpy}
              chatAvailable={true}
              chatOnline={true}
              activeEmbed='ticketSubmissionForm' />
          );

          webWidget.show();
        });

        it('sets the activeEmbed to chat', () => {
          expect(updateActiveEmbedSpy)
            .toHaveBeenCalledWith('chat');
        });
      });
    });
  });

  describe('#showChat', () => {
    let webWidget, updateActiveEmbedSpy, zopimOnNextSpy;

    beforeEach(() => {
      updateActiveEmbedSpy = jasmine.createSpy();
      zopimOnNextSpy = jasmine.createSpy();
    });

    describe('when oldChat is true', () => {
      beforeEach(() => {
        webWidget = instanceRender(
          <WebWidget
            oldChat={true}
            updateActiveEmbed={updateActiveEmbedSpy} />
        );
        webWidget.showChat();
      });

      it('calls updateActiveEmbed with zopimChat', () => {
        expect(updateActiveEmbedSpy)
          .toHaveBeenCalledWith('zopimChat');
      });

      describe('when helpCenter is the active embed', () => {
        beforeEach(() => {
          webWidget = instanceRender(
            <WebWidget
              oldChat={true}
              activeEmbed='helpCenterForm'
              zopimOnNext={zopimOnNextSpy}
              updateActiveEmbed={updateActiveEmbedSpy} />
          );
          webWidget.showChat();
        });

        it('calls zopimOnNext', () => {
          expect(zopimOnNextSpy)
            .toHaveBeenCalled();
        });
      });

      describe('when channelChoice is the active embed', () => {
        beforeEach(() => {
          webWidget = instanceRender(
            <WebWidget
              oldChat={true}
              activeEmbed='channelChoice'
              zopimOnNext={zopimOnNextSpy}
              updateActiveEmbed={updateActiveEmbedSpy} />
          );
          webWidget.showChat();
        });

        it('calls zopimOnNext', () => {
          expect(zopimOnNextSpy)
            .toHaveBeenCalled();
        });
      });
    });

    describe('when oldChat is false', () => {
      const updateChatScreenSpy = jasmine.createSpy('updateChatScreen');
      const updateBackButtonVisibilitySpy = jasmine.createSpy('updateBackButtonVisibility');

      describe('when proactive is false', () => {
        beforeEach(() => {
          webWidget = instanceRender(
            <WebWidget
              oldChat={false}
              updateChatScreen={updateChatScreenSpy}
              updateBackButtonVisibility={updateBackButtonVisibilitySpy}
              updateActiveEmbed={updateActiveEmbedSpy} />
          );
          webWidget.showChat();
        });

        it('calls updateActiveEmbed with chat', () => {
          expect(updateActiveEmbedSpy)
            .toHaveBeenCalledWith('chat');
        });

        it('does not call updateChatScreen', () => {
          expect(updateChatScreenSpy)
            .not.toHaveBeenCalled();
        });

        it('does not call updateBackButtonVisibility', () => {
          expect(updateBackButtonVisibilitySpy)
            .not.toHaveBeenCalled();
        });
      });

      describe('when proactive is true', () => {
        beforeEach(() => {
          webWidget = instanceRender(
            <WebWidget
              oldChat={false}
              updateChatScreen={updateChatScreenSpy}
              updateBackButtonVisibility={updateBackButtonVisibilitySpy}
              updateActiveEmbed={updateActiveEmbedSpy} />
          );
          webWidget.showChat({ proactive: true });
        });

        it('calls updateActiveEmbed with chat', () => {
          expect(updateActiveEmbedSpy)
            .toHaveBeenCalledWith('chat');
        });

        it('calls updateChatScreen with chatting screen', () => {
          expect(updateChatScreenSpy)
            .toHaveBeenCalledWith('chatting');
        });
      });
    });
  });

  describe('showProactiveChat', () => {
    let webWidget;

    describe('when on mobile', () => {
      let showStandaloneMobileNotificationSpy;

      beforeEach(() => {
        showStandaloneMobileNotificationSpy = jasmine.createSpy('showStandaloneMobileNotification');
        webWidget = instanceRender(
          <WebWidget
            oldChat={false}
            fullscreen={true}
            showStandaloneMobileNotification={showStandaloneMobileNotificationSpy} />
        );
        webWidget.showProactiveChat();
      });

      it('calls showStandaloneMobileNotification', () => {
        expect(showStandaloneMobileNotificationSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when not on mobile', () => {
      const mockChatNotification = { proactive: true, show: true };

      beforeEach(() => {
        webWidget = instanceRender(
          <WebWidget
            oldChat={false}
            fullscreen={false}
            chatNotification={mockChatNotification} />
        );

        spyOn(webWidget, 'showChat');
        webWidget.showProactiveChat();
      });

      it('calls showChat with proactive true', () => {
        expect(webWidget.showChat)
          .toHaveBeenCalledWith({ proactive: true });
      });
    });
  });

  describe('#onContainerClick', () => {
    let webWidget;

    describe('when the activeEmbed is chat', () => {
      beforeEach(() => {
        webWidget = domRender(<WebWidget activeEmbed='chat' />);
        webWidget.onContainerClick();
      });

      it('calls the chat onContainerClick handler', () => {
        expect(chatOnContainerClickSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when the activeEmbed is helpCenter', () => {
      beforeEach(() => {
        webWidget = domRender(<WebWidget activeEmbed='helpCenterForm' helpCenterAvailable={true} />);
        webWidget.onContainerClick();
      });

      it('calls the helpCenter onContainerClick handler', () => {
        expect(helpCenterOnContainerClickSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when the activeEmbed is not chat or helpCenter', () => {
      beforeEach(() => {
        webWidget = domRender(<WebWidget activeEmbed='ticketSubmissionForm' />);

        spyOn(webWidget, 'getActiveComponent');

        webWidget.onContainerClick();
      });

      it('calls getActiveComponent', () => {
        expect(webWidget.getActiveComponent)
          .toHaveBeenCalled();
      });

      it('does not call the chat onContainerClick handler', () => {
        expect(chatOnContainerClickSpy)
          .not.toHaveBeenCalled();
      });

      it('does not call the helpCenter onContainerClick handler', () => {
        expect(helpCenterOnContainerClickSpy)
          .not.toHaveBeenCalled();
      });
    });

    describe('when there is no activeEmbed', () => {
      beforeEach(() => {
        webWidget = domRender(<WebWidget activeEmbed='' />);

        spyOn(webWidget, 'getActiveComponent');

        webWidget.onContainerClick();
      });

      it('calls getActiveComponent', () => {
        expect(webWidget.getActiveComponent)
          .toHaveBeenCalled();
      });

      it('does not call the chat onContainerClick handler', () => {
        expect(chatOnContainerClickSpy)
          .not.toHaveBeenCalled();
      });

      it('does not call the helpCenter onContainerClick handler', () => {
        expect(helpCenterOnContainerClickSpy)
          .not.toHaveBeenCalled();
      });
    });
  });

  describe('#onContainerDragEnter', () => {
    let webWidget;

    describe('when the activeEmbed is submitTicket', () => {
      beforeEach(() => {
        webWidget = domRender(
          <WebWidget
            submitTicketAvailable={true}
            helpCenterAvailable={true}
            activeEmbed='ticketSubmissionForm' />
        );

        webWidget.onContainerDragEnter();
      });

      it('calls the submitTicket onDragEnter handler', () => {
        expect(submitTicketOnDragEnterSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when the activeEmbed is not submitTicket', () => {
      beforeEach(() => {
        webWidget = domRender(
          <WebWidget
            submitTicketAvailable={true}
            helpCenterAvailable={true}
            activeEmbed='helpCenter' />
        );

        webWidget.onContainerDragEnter();
      });

      it('does not call the submitTicket onDragEnter handler', () => {
        expect(submitTicketOnDragEnterSpy)
          .not.toHaveBeenCalled();
      });
    });
  });

  describe('setComponent', () => {
    let webWidget,
      updateBackButtonVisibilitySpy,
      updateActiveEmbedSpy;

    describe('when the active component is Chat', () => {
      beforeEach(() => {
        updateBackButtonVisibilitySpy = jasmine.createSpy('updateBackButtonVisibility');
        updateActiveEmbedSpy = jasmine.createSpy('updateActiveEmbed');

        webWidget = instanceRender(
          <WebWidget
            updateBackButtonVisibility={updateBackButtonVisibilitySpy}
            updateActiveEmbed={updateActiveEmbedSpy} />
        );
        spyOn(webWidget, 'showChat');

        webWidget.setComponent('chat');
      });

      it('calls showChat', () => {
        expect(webWidget.showChat)
          .toHaveBeenCalled();
      });

      it('calls updateBackButtonVisibility with true', () => {
        expect(updateBackButtonVisibilitySpy)
          .toHaveBeenCalledWith(true);
      });

      it('does not call updateActiveEmbed', () => {
        expect(updateActiveEmbedSpy)
          .not.toHaveBeenCalled();
      });
    });

    describe('when the active component is not Chat', () => {
      beforeEach(() => {
        updateBackButtonVisibilitySpy = jasmine.createSpy('updateBackButtonVisibility');
        updateActiveEmbedSpy = jasmine.createSpy('updateActiveEmbed');

        webWidget = instanceRender(
          <WebWidget
            updateBackButtonVisibility={updateBackButtonVisibilitySpy}
            updateActiveEmbed={updateActiveEmbedSpy} />
        );
        spyOn(webWidget, 'showChat');

        webWidget.setComponent('helpCenterForm');
      });

      it('does not call showChat', () => {
        expect(webWidget.showChat)
          .not.toHaveBeenCalled();
      });

      it('calls updateBackButtonVisibility with true', () => {
        expect(updateBackButtonVisibilitySpy)
          .toHaveBeenCalledWith(true);
      });

      it('calls updateActiveEmbed with the component name', () => {
        expect(updateActiveEmbedSpy)
          .toHaveBeenCalledWith('helpCenterForm');
      });
    });
  });
});
