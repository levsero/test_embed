describe('WebWidget component', () => {
  let WebWidget,
    chatOnContainerClickSpy,
    helpCenterOnContainerClickSpy,
    submitTicketOnDragEnterSpy,
    mockUpdateActiveEmbed;
  const clearFormSpy = jasmine.createSpy();
  const webWidgetPath = buildSrcPath('component/webWidget/WebWidget');
  const ChatNotificationPopup = noopReactComponent();
  const MAX_WIDGET_HEIGHT_NO_SEARCH = 150;
  const WIDGET_MARGIN = 15;

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
      'constants/shared': {
        MAX_WIDGET_HEIGHT_NO_SEARCH,
        WIDGET_MARGIN
      },
      'src/redux/modules/base': {
        updateActiveEmbed: noop,
        updateEmbedAccessible: noop,
        updateBackButtonVisibility: noop
      },
      'src/redux/modules/chat': {
        chatNotificationDismissed: noop,
        updateChatScreen: noop
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

    it('does not render the chatPopup component', () => {
      expect(webWidget.renderChatNotification())
        .toBeFalsy();
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
      chatNotificationDismissedSpy,
      setFixedFrameStylesSpy,
      closeFrameSpy;

    beforeEach(() => {
      chatNotificationDismissedSpy = jasmine.createSpy('chatNotificationDismissed');
      setFixedFrameStylesSpy = jasmine.createSpy('setFixedFrameStyles');
      closeFrameSpy = jasmine.createSpy('closeFrame');
      webWidget = instanceRender(
        <WebWidget
          chatNotificationDismissed={chatNotificationDismissedSpy}
          setFixedFrameStyles={setFixedFrameStylesSpy}
          closeFrame={closeFrameSpy} />
      );

      webWidget.dismissStandaloneChatPopup();
    });

    it('calls props.closeFrame with onHide callback', () => {
      expect(closeFrameSpy)
        .toHaveBeenCalledWith({}, { onHide: jasmine.any(Function) });
    });

    describe('when frame onHide is fired', () => {
      beforeEach(() => {
        const onHide = closeFrameSpy.calls.mostRecent().args[1].onHide;

        onHide();
      });

      it('calls props.setFixedFrameStyles with no parameters', () => {
        expect(setFixedFrameStylesSpy)
          .toHaveBeenCalledWith();
      });

      it('calls props.chatNotificationDismissed', () => {
        expect(chatNotificationDismissedSpy)
          .toHaveBeenCalled();
      });
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
        setFixedFrameStylesSpy,
        onShowMobileSpy;

      beforeEach(() => {
        chatNotificationRespondSpy = jasmine.createSpy('chatNotificationRespond');
        setFixedFrameStylesSpy = jasmine.createSpy('setFixedFrameStyles');
        onShowMobileSpy = jasmine.createSpy('onShowMobile');
        webWidget = domRender(
          <WebWidget
            chatNotification={mockChatNotification}
            chatNotificationRespond={chatNotificationRespondSpy}
            setFixedFrameStyles={setFixedFrameStylesSpy}
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

      it('calls props.setFixedFrameStyles with no parameters', () => {
        expect(setFixedFrameStylesSpy)
          .toHaveBeenCalledWith();
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
    let webWidget;

    beforeEach(() => {
      webWidget = instanceRender(
        <WebWidget
          updateBackButtonVisibility={updateBackButtonVisibilitySpy}
          activeEmbed='chat'
          showOfflineChat={true} />
      );
    });

    describe('the function passed to updateChatBackButtonVisibility', () => {
      let chatComponent;

      describe('when isHelpCenterAvailable is true', () => {
        beforeEach(() => {
          spyOn(webWidget, 'isHelpCenterAvailable').and.returnValue(true);
          spyOn(webWidget, 'isChannelChoiceAvailable').and.returnValue(false);

          chatComponent = webWidget.renderChat();
          chatComponent.props.updateChatBackButtonVisibility();
        });

        it('calls updateBackButtonVisibility with true', () => {
          expect(updateBackButtonVisibilitySpy)
            .toHaveBeenCalledWith(true);
        });
      });

      describe('when isChannelChoiceAvailable is true', () => {
        beforeEach(() => {
          spyOn(webWidget, 'isHelpCenterAvailable').and.returnValue(false);
          spyOn(webWidget, 'isChannelChoiceAvailable').and.returnValue(true);

          chatComponent = webWidget.renderChat();
          chatComponent.props.updateChatBackButtonVisibility();
        });

        it('calls updateBackButtonVisibility with true', () => {
          expect(updateBackButtonVisibilitySpy)
            .toHaveBeenCalledWith(true);
        });
      });

      describe('when isChannelChoiceAvailable and isHelpCenterAvailable are false', () => {
        beforeEach(() => {
          spyOn(webWidget, 'isHelpCenterAvailable').and.returnValue(false);
          spyOn(webWidget, 'isChannelChoiceAvailable').and.returnValue(false);

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
      chatNotificationRespondSpy,
      chatNotificationDismissedSpy;

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

    describe('when helpCenter has not been previously used for search', () => {
      beforeEach(() => {
        const result = instanceRender(
          <WebWidget
            activeEmbed='helpCenterForm'
            hasSearched={false} />
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
        webWidget = instanceRender(<WebWidget />);

        spyOn(webWidget, 'isHelpCenterAvailable').and.returnValue(true);
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
          webWidget = instanceRender(<WebWidget updateActiveEmbed={mockUpdateActiveEmbed} />);

          spyOn(webWidget, 'isHelpCenterAvailable').and.returnValue(false);
          spyOn(webWidget, 'isChannelChoiceAvailable').and.returnValue(true);
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
              onCancel={onCancelSpy}
              ipmHelpCenterAvailable={ipmHelpCenterAvailable}
              updateActiveEmbed={mockUpdateActiveEmbed} />
          );

          spyOn(webWidget, 'isHelpCenterAvailable').and.returnValue(false);
          spyOn(webWidget, 'isChannelChoiceAvailable').and.returnValue(false);
        });

        describe('when IPM help center is not available', () => {
          beforeEach(() => {
            webWidget.onCancelClick();
          });

          beforeAll(() => {
            ipmHelpCenterAvailable = false;
          });

          it('calls onCancel prop', () => {
            expect(onCancelSpy)
              .toHaveBeenCalled();
          });

          it('calls updateActiveEmbed with an empty string', () => {
            expect(mockUpdateActiveEmbed)
              .toHaveBeenCalledWith('');
          });
        });

        describe('when IPM help center is available', () => {
          beforeEach(() => {
            webWidget.onCancelClick();
          });

          beforeAll(() => {
            ipmHelpCenterAvailable = true;
          });

          it('calls onCancel prop', () => {
            expect(onCancelSpy)
              .toHaveBeenCalled();
          });

          it('does not set update active embed', () => {
            expect(mockUpdateActiveEmbed)
              .not.toHaveBeenCalled();
          });
        });
      });
    });
  });

  describe('#onNextClick', () => {
    let webWidget, updateBackButtonVisibilitySpy;

    beforeEach(() => {
      updateBackButtonVisibilitySpy = jasmine.createSpy('updateBackButtonVisibilitySpy');
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
    });

    describe('when talk and chat are available', () => {
      beforeEach(() => {
        webWidget = instanceRender(
          <WebWidget
            helpCenterAvailable={true}
            talkAvailable={true}
            talkOnline={true}
            chatOnline={true}
            chatAvailable={true}
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
    });

    describe('when talk is available and online', () => {
      beforeEach(() => {
        webWidget = instanceRender(
          <WebWidget
            helpCenterAvailable={true}
            talkAvailable={true}
            talkOnline={true}
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
    });

    describe('when chat is online', () => {
      beforeEach(() => {
        webWidget = instanceRender(
          <WebWidget
            chatOnline={true}
            chatAvailable={true}
            helpCenterAvailable={true}
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
    });

    describe('when chat is offline', () => {
      beforeEach(() => {
        webWidget = instanceRender(
          <WebWidget
            chatOnline={false}
            chatAvailable={false}
            helpCenterAvailable={true}
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
    });

    describe('when chat is offline but offline form is available', () => {
      beforeEach(() => {
        webWidget = instanceRender(
          <WebWidget
            chatOnline={false}
            chatAvailable={false}
            helpCenterAvailable={true}
            chatOfflineAvailable={true}
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
    });

    describe('when ipm is activated', () => {
      beforeEach(() => {
        webWidget = instanceRender(
          <WebWidget
            ipmHelpCenterAvailable={true}
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
      describe('when the activeEmbed is chat and it becomes unavailable', () => {
        beforeEach(() => {
          webWidget = domRender(
            <WebWidget
              updateActiveEmbed={noop}
              activeEmbed={'chat'}
              chatAvailable={false} />
          );

          spyOn(webWidget, 'resetActiveEmbed');
          webWidget.show();
        });

        it('calls resetActiveEmbed', () => {
          expect(webWidget.resetActiveEmbed)
            .toHaveBeenCalled();
        });
      });

      describe('when viaActivate is true', () => {
        beforeEach(() => {
          webWidget = domRender(
            <WebWidget
              helpCenterAvailable={true}
              updateActiveEmbed={noop}
              activeEmbed='chat' />
          );

          spyOn(webWidget, 'resetActiveEmbed');

          webWidget.show(true);
        });

        it('calls resetActiveEmbed', () => {
          expect(webWidget.resetActiveEmbed)
            .toHaveBeenCalled();
        });
      });

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

      describe('when the activeEmbed is zopimChat and zopimChat is offline', () => {
        let zopimOnNextSpy;

        beforeEach(() => {
          zopimOnNextSpy = jasmine.createSpy('zopimOnNext');
          webWidget = domRender(
            <WebWidget
              submitTicketAvailable={true}
              updateActiveEmbed={noop}
              chatOnline={false}
              activeEmbed='zopimChat'
              zopimOnNext={zopimOnNextSpy} />
          );
          spyOn(webWidget, 'resetActiveEmbed');

          webWidget.show();
        });

        it('does not call resetActiveEmbed', () => {
          expect(webWidget.resetActiveEmbed)
            .not.toHaveBeenCalled();
        });

        it('calls zopimOnNext', () => {
          expect(zopimOnNextSpy)
            .toHaveBeenCalled();
        });
      });

      describe('when the activeEmbed is channelChoice and zopimChat is offline', () => {
        beforeEach(() => {
          webWidget = domRender(
            <WebWidget
              submitTicketAvailable={true}
              updateActiveEmbed={noop}
              chatOnline={false}
              activeEmbed='channelChoice' />
          );
          spyOn(webWidget, 'resetActiveEmbed');

          webWidget.show();
        });

        it('calls resetActiveEmbed', () => {
          expect(webWidget.resetActiveEmbed)
            .toHaveBeenCalled();
        });
      });

      describe('when the activeEmbed is talk and talkAvailable is false', () => {
        beforeEach(() => {
          webWidget = domRender(
            <WebWidget
              submitTicketAvailable={true}
              updateActiveEmbed={noop}
              talkAvailable={false}
              activeEmbed='talk' />
          );
          spyOn(webWidget, 'resetActiveEmbed');

          webWidget.show();
        });

        it('calls resetActiveEmbed', () => {
          expect(webWidget.resetActiveEmbed)
            .toHaveBeenCalled();
        });
      });

      describe('when the activeEmbed is channelChoice and talkAvailable is false', () => {
        beforeEach(() => {
          webWidget = domRender(
            <WebWidget
              submitTicketAvailable={true}
              updateActiveEmbed={noop}
              talkAvailable={false}
              activeEmbed='channelChoice' />
          );

          spyOn(webWidget, 'resetActiveEmbed');
          webWidget.show();
        });

        it('calls resetActiveEmbed', () => {
          expect(webWidget.resetActiveEmbed)
            .toHaveBeenCalled();
        });
      });
    });

    describe('when there is not an active embed', () => {
      beforeEach(() => {
        webWidget = domRender(
          <WebWidget updateActiveEmbed={updateActiveEmbedSpy} activeEmbed='' />
        );

        spyOn(webWidget, 'resetActiveEmbed');
        webWidget.show();
      });

      it('calls resetActiveEmbed', () => {
        expect(webWidget.resetActiveEmbed)
          .toHaveBeenCalled();
      });
    });
  });

  describe('#resetActiveEmbed', () => {
    let webWidget, updateActiveEmbedSpy, updateBackButtonVisibilitySpy;

    beforeEach(() => {
      updateActiveEmbedSpy = jasmine.createSpy();
      updateBackButtonVisibilitySpy = jasmine.createSpy('updateBackButtonVisibilitySpy');
    });

    describe('when Talk is available', () => {
      describe('when HelpCenter is available', () => {
        beforeEach(() => {
          webWidget = domRender(
            <WebWidget
              talkAvailable={true}
              updateActiveEmbed={updateActiveEmbedSpy}
              helpCenterAvailable={true}
              activeEmbed='' />
          );

          webWidget.isHelpCenterAvailable = () => true;
          webWidget.resetActiveEmbed();
        });

        it('calls updateActiveEmbed with helpCenterForm', () => {
          expect(updateActiveEmbedSpy)
            .toHaveBeenCalledWith('helpCenterForm');
        });
      });

      describe('when ChannelChoice is available', () => {
        beforeEach(() => {
          webWidget = domRender(
            <WebWidget
              talkAvailable={true}
              updateActiveEmbed={updateActiveEmbedSpy}
              activeEmbed='' />
          );

          webWidget.isChannelChoiceAvailable = () => true;
          webWidget.resetActiveEmbed();
        });

        it('calls updateActiveEmbed with channelChoice', () => {
          expect(updateActiveEmbedSpy)
            .toHaveBeenCalledWith('channelChoice');
        });
      });

      describe('when neither HelpCenter or ChannelChoice is available', () => {
        beforeEach(() => {
          webWidget = domRender(
            <WebWidget
              talkAvailable={true}
              talkOnline={true}
              updateActiveEmbed={updateActiveEmbedSpy}
              activeEmbed='' />
          );

          webWidget.resetActiveEmbed();
        });

        it('calls updateActiveEmbed with channelChoice', () => {
          expect(updateActiveEmbedSpy)
            .toHaveBeenCalledWith('channelChoice');
        });

        describe('when no other channels are available', () => {
          beforeEach(() => {
            webWidget = domRender(
              <WebWidget
                talkAvailable={true}
                talkOnline={true}
                submitTicketAvailable={false}
                updateActiveEmbed={updateActiveEmbedSpy}
                activeEmbed='' />
            );

            webWidget.resetActiveEmbed();
          });

          it('calls updateActiveEmbed with talk', () => {
            expect(updateActiveEmbedSpy)
              .toHaveBeenCalledWith('talk');
          });
        });
      });
    });

    describe('when Talk is not available', () => {
      describe('when Chat is available', () => {
        beforeEach(() => {
          webWidget = domRender(
            <WebWidget
              chatAvailable={true}
              updateActiveEmbed={updateActiveEmbedSpy}
              activeEmbed='' />
          );

          spyOn(webWidget, 'showChat');

          webWidget.resetActiveEmbed();
        });

        it('calls showChat', () => {
          expect(webWidget.showChat)
            .toHaveBeenCalled();
        });
      });

      describe('when Chat is standalone', () => {
        beforeEach(() => {
          webWidget = domRender(
            <WebWidget
              chatStandalone={true}
              updateActiveEmbed={updateActiveEmbedSpy}
              activeEmbed='' />
          );

          spyOn(webWidget, 'showChat');

          webWidget.resetActiveEmbed();
        });

        it('calls showChat', () => {
          expect(webWidget.showChat)
            .toHaveBeenCalled();
        });
      });

      describe('when there are no embeds available apart from contactForm', () => {
        beforeEach(() => {
          webWidget = domRender(
            <WebWidget
              updateActiveEmbed={updateActiveEmbedSpy}
              activeEmbed='' />
          );

          webWidget.resetActiveEmbed();
        });

        it('calls updateActiveEmbed with ticketSubmissionForm', () => {
          expect(updateActiveEmbedSpy)
            .toHaveBeenCalledWith('ticketSubmissionForm');
        });
      });
    });

    describe('when help center is available', () => {
      let hasSearched, setFixedFrameStylesSpy;

      beforeEach(() => {
        setFixedFrameStylesSpy = jasmine.createSpy('setFixedFrameStyles');
        webWidget = instanceRender(
          <WebWidget
            updateActiveEmbed={updateActiveEmbedSpy}
            updateBackButtonVisibility={updateBackButtonVisibilitySpy}
            setFixedFrameStyles={setFixedFrameStylesSpy}
            helpCenterAvailable={true}
            hasSearched={hasSearched}
            activeEmbed='' />
        );

        spyOn(webWidget, 'isHelpCenterAvailable').and.returnValue(true);
        webWidget.resetActiveEmbed();
      });

      it('calls updateActiveEmbed with help center', () => {
        expect(updateActiveEmbedSpy)
          .toHaveBeenCalledWith('helpCenterForm');
      });

      describe('when hasSearched is true', () => {
        beforeAll(() => {
          hasSearched = true;
        });

        it('does not call setFixedFrameStyles', () => {
          expect(setFixedFrameStylesSpy)
            .not.toHaveBeenCalled();
        });
      });

      describe('when hasSearched is false', () => {
        beforeAll(() => {
          hasSearched = false;
        });

        it('call setFixedFrameStyles with the correct params', () => {
          expect(setFixedFrameStylesSpy)
            .toHaveBeenCalledWith({
              maxHeight: `${MAX_WIDGET_HEIGHT_NO_SEARCH + WIDGET_MARGIN}px`
            });
        });
      });

      describe('when the article view is active', () => {
        beforeEach(() => {
          webWidget = instanceRender(
            <WebWidget
              articleViewActive={true}
              updateActiveEmbed={updateActiveEmbedSpy}
              updateBackButtonVisibility={updateBackButtonVisibilitySpy}
              helpCenterAvailable={true}
              activeEmbed='' />
          );

          webWidget.resetActiveEmbed();
        });

        it('calls updateBackButtonVisibility with true', () => {
          expect(updateBackButtonVisibilitySpy)
            .toHaveBeenCalledWith(true);
        });
      });

      describe('when the article view is not active', () => {
        beforeEach(() => {
          webWidget = instanceRender(
            <WebWidget
              articleViewActive={false}
              updateActiveEmbed={updateActiveEmbedSpy}
              updateBackButtonVisibility={updateBackButtonVisibilitySpy}
              helpCenterAvailable={true}
              activeEmbed='' />
          );

          webWidget.resetActiveEmbed();
        });

        it('calls updateBackButtonVisibility with false', () => {
          expect(updateBackButtonVisibilitySpy)
            .toHaveBeenCalledWith(false);
        });
      });
    });

    describe('when help center is not available', () => {
      describe('when widget is activated by ipm and in article view', () => {
        beforeEach(() => {
          webWidget = domRender(
            <WebWidget
              updateActiveEmbed={updateActiveEmbedSpy}
              ipmHelpCenterAvailable={true}
              articleViewActive={true}
              activeEmbed='' />
          );

          webWidget.resetActiveEmbed();
        });

        it('calls updateActiveEmbed with helpCenterForm', () => {
          expect(updateActiveEmbedSpy)
            .toHaveBeenCalledWith('helpCenterForm');
        });
      });

      describe('when channelChoice is available', () => {
        beforeEach(() => {
          webWidget = instanceRender(
            <WebWidget
              activeEmbed=''
              chatOnline={true}
              chatAvailable={true}
              channelChoice={true}
              submitTicketAvailable={true}
              updateActiveEmbed={updateActiveEmbedSpy} />
          );

          spyOn(webWidget, 'isHelpCenterAvailable').and.returnValue(false);
          webWidget.resetActiveEmbed();
        });

        it('calls updateActiveEmbed with channelChoice', () => {
          expect(updateActiveEmbedSpy)
            .toHaveBeenCalledWith('channelChoice');
        });
      });

      describe('when chat is online', () => {
        beforeEach(() => {
          webWidget = instanceRender(
            <WebWidget
              activeEmbed=''
              chatOnline={true}
              chatAvailable={true}
              updateActiveEmbed={updateActiveEmbedSpy}
              channelChoice={false} />
          );

          spyOn(webWidget, 'isHelpCenterAvailable').and.returnValue(false);
          webWidget.resetActiveEmbed();
        });

        it('calls updateActiveEmbed with chat', () => {
          expect(updateActiveEmbedSpy)
            .toHaveBeenCalledWith('chat');
        });
      });

      describe('when chat is standalone', () => {
        beforeEach(() => {
          webWidget = instanceRender(
            <WebWidget
              activeEmbed=''
              chatStandalone={true}
              updateActiveEmbed={updateActiveEmbedSpy}
              channelChoice={false} />
          );

          spyOn(webWidget, 'isHelpCenterAvailable').and.returnValue(false);
          webWidget.resetActiveEmbed();
        });

        it('calls updateActiveEmbed with chat', () => {
          expect(updateActiveEmbedSpy)
            .toHaveBeenCalledWith('chat');
        });
      });

      describe('when chat is offline', () => {
        beforeEach(() => {
          webWidget = domRender(
            <WebWidget
              activeEmbed=''
              chatOnline={false}
              chatAvailable={false}
              updateActiveEmbed={updateActiveEmbedSpy} />
          );

          spyOn(webWidget, 'isHelpCenterAvailable').and.returnValue(false);
          webWidget.resetActiveEmbed();
        });

        it('calls updateActiveEmbed with submit ticket', () => {
          expect(updateActiveEmbedSpy)
            .toHaveBeenCalledWith('ticketSubmissionForm');
        });

        describe('when showTicketFormsBackButton is false', () => {
          beforeEach(() => {
            webWidget = domRender(
              <WebWidget
                activeEmbed=''
                chatOnline={false}
                chatAvailable={false}
                showTicketFormsBackButton={false}
                updateBackButtonVisibility={updateBackButtonVisibilitySpy}
                updateActiveEmbed={updateActiveEmbedSpy} />);

            webWidget.resetActiveEmbed();
          });

          it('does not show the back button', () => {
            expect(updateBackButtonVisibilitySpy)
              .toHaveBeenCalledWith(false);
          });
        });

        describe('when showTicketFormsBackButton is true', () => {
          beforeEach(() => {
            webWidget = domRender(
              <WebWidget
                activeEmbed=''
                chatOnline={false}
                chatAvailable={false}
                showTicketFormsBackButton={true}
                updateBackButtonVisibility={updateBackButtonVisibilitySpy}
                updateActiveEmbed={updateActiveEmbedSpy} />);

            webWidget.resetActiveEmbed();
          });

          it('shows the back button', () => {
            expect(updateBackButtonVisibilitySpy)
              .toHaveBeenCalledWith(true);
          });
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
      let setFixedFrameStylesSpy,
        showStandaloneMobileNotificationSpy;

      beforeEach(() => {
        setFixedFrameStylesSpy = jasmine.createSpy('setFixedFrameStyles');
        showStandaloneMobileNotificationSpy = jasmine.createSpy('showStandaloneMobileNotification');
        webWidget = instanceRender(
          <WebWidget
            oldChat={false}
            fullscreen={true}
            setFixedFrameStyles={setFixedFrameStylesSpy}
            showStandaloneMobileNotification={showStandaloneMobileNotificationSpy} />
        );
        webWidget.showProactiveChat();
      });

      it('calls props.setFixedFrameStyles with correct styles', () => {
        expect(setFixedFrameStylesSpy)
          .toHaveBeenCalledWith({ height: '33%', background: 'transparent' });
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

  describe('#isHelpCenterAvailable', () => {
    let webWidget;

    describe('when props.helpCenterAvailable is false', () => {
      beforeEach(() => {
        webWidget = instanceRender(<WebWidget helpCenterAvailable={false} />);
      });

      it('returns false', () => {
        expect(webWidget.isHelpCenterAvailable())
          .toBe(false);
      });
    });

    describe('when props.helpCenterAvailable is true', () => {
      describe('when hc is not sign-in required', () => {
        beforeEach(() => {
          webWidget = instanceRender(<WebWidget helpCenterAvailable={true} />);
        });

        it('returns true', () => {
          expect(webWidget.isHelpCenterAvailable())
            .toBe(true);
        });
      });

      describe('when hc is sign-in required', () => {
        const config = { signInRequired: true };

        beforeEach(() => {
          webWidget = instanceRender(
            <WebWidget
              helpCenterAvailable={true}
              authenticated={false}
              helpCenterConfig={config} />
          );
        });

        it('returns false', () => {
          expect(webWidget.isHelpCenterAvailable())
            .toBe(false);
        });

        describe('when hc is authenticated', () => {
          beforeEach(() => {
            webWidget = instanceRender(
              <WebWidget
                helpCenterAvailable={true}
                helpCenterConfig={config}
                authenticated={true} />
            );
          });

          it('returns true', () => {
            expect(webWidget.isHelpCenterAvailable())
              .toBe(true);
          });
        });

        describe('when embedded on a help center', () => {
          beforeEach(() => {
            webWidget = instanceRender(
              <WebWidget
                helpCenterAvailable={true}
                helpCenterConfig={config}
                authenticated={false}
                isOnHelpCenterPage={true} />
            );
          });

          it('returns true', () => {
            expect(webWidget.isHelpCenterAvailable())
              .toBe(true);
          });
        });
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
        webWidget = domRender(<WebWidget activeEmbed='ticketSubmissionForm' />);
        webWidget.onContainerDragEnter();
      });

      it('calls the submitTicket onDragEnter handler', () => {
        expect(submitTicketOnDragEnterSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when the activeEmbed is not submitTicket', () => {
      beforeEach(() => {
        webWidget = domRender(<WebWidget activeEmbed='helpCenter' />);
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

  describe('isChannelChoiceAvailable', () => {
    let webWidget;

    describe('when isChatting is true', () => {
      beforeEach(() => {
        webWidget = instanceRender(
          <WebWidget
            channelChoice={true}
            submitTicketAvailable={true}
            talkAvailable={true}
            chatAvailable={true}
            isChatting={true}
          />
        );
      });

      it('returns false', () => {
        expect(webWidget.isChannelChoiceAvailable())
          .toEqual(false);
      });
    });

    describe('when isChatting is false', () => {
      const isChatting = false;

      describe('when only channelChoice is available', () => {
        describe('when no other channels are available', () => {
          beforeEach(() => {
            webWidget = instanceRender(
              <WebWidget
                channelChoice={true}
                submitTicketAvailable={false}
                talkAvailable={false}
                chatAvailable={false}
                isChatting={isChatting}
              />
            );
          });

          it('returns false', () => {
            expect(webWidget.isChannelChoiceAvailable())
              .toEqual(false);
          });
        });

        describe('when only one other channel is available', () => {
          beforeEach(() => {
            webWidget = instanceRender(
              <WebWidget
                channelChoice={true}
                submitTicketAvailable={true}
                talkAvailable={false}
                chatAvailable={false}
                isChatting={isChatting}
              />
            );
          });

          it('returns false', () => {
            expect(webWidget.isChannelChoiceAvailable())
              .toEqual(false);
          });
        });

        describe('when two other channels are available', () => {
          beforeEach(() => {
            webWidget = instanceRender(
              <WebWidget
                channelChoice={true}
                submitTicketAvailable={true}
                talkAvailable={false}
                chatAvailable={true}
                isChatting={isChatting}
              />
            );
          });

          it('returns true', () => {
            expect(webWidget.isChannelChoiceAvailable())
              .toEqual(true);
          });
        });

        describe('when chat offline and talk are available', () => {
          beforeEach(() => {
            webWidget = instanceRender(
              <WebWidget
                channelChoice={true}
                submitTicketAvailable={false}
                talkAvailable={true}
                chatAvailable={false}
                chatOfflineAvailable={true}
                isChatting={isChatting}
              />
            );
          });

          it('returns true', () => {
            expect(webWidget.isChannelChoiceAvailable())
              .toEqual(true);
          });
        });
      });

      describe('when only talkAvailable is available', () => {
        describe('when no other channels are available', () => {
          beforeEach(() => {
            webWidget = instanceRender(
              <WebWidget
                channelChoice={false}
                submitTicketAvailable={false}
                talkAvailable={true}
                chatAvailable={false}
                isChatting={isChatting}
              />
            );
          });

          it('returns false', () => {
            expect(webWidget.isChannelChoiceAvailable())
              .toEqual(false);
          });
        });

        describe('when another channel is available', () => {
          beforeEach(() => {
            webWidget = instanceRender(
              <WebWidget
                channelChoice={false}
                submitTicketAvailable={true}
                talkAvailable={true}
                chatAvailable={false}
                isChatting={isChatting}
              />
            );
          });

          it('returns true', () => {
            expect(webWidget.isChannelChoiceAvailable())
              .toEqual(true);
          });
        });
      });
    });
  });
});
