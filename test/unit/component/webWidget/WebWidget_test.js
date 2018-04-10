describe('WebWidget component', () => {
  let WebWidget,
    chatOnContainerClickSpy,
    helpCenterOnContainerClickSpy,
    submitTicketOnDragEnterSpy,
    mockUpdateActiveEmbed;
  const clearFormSpy = jasmine.createSpy();
  const webWidgetPath = buildSrcPath('component/webWidget/WebWidget');

  const ChatOffline = connectedComponent(noopReactComponent());

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
      'component/chat/ChatOffline': ChatOffline,
      'component/helpCenter/HelpCenter': connectedComponent(<MockHelpCenter />),
      'component/submitTicket/SubmitTicket': connectedComponent(<MockSubmitTicket />),
      'component/talk/Talk': connectedComponent(<MockTalk />),
      'component/channelChoice/ChannelChoice': {
        ChannelChoice: noopReactComponent()
      },
      'component/chat/ChatNotificationPopup': {
        ChatNotificationPopup: noopReactComponent()
      },
      'src/redux/modules/base': {
        updateActiveEmbed: noop,
        updateEmbedAccessible: noop,
        updateBackButtonVisibility: noop,
        updateAuthenticated: noop
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
      }
    });

    mockery.registerAllowable(webWidgetPath);
    WebWidget = requireUncached(webWidgetPath).default.WrappedComponent;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
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

      expect(webWidget.renderSubmitTicket().props.className)
        .toContain('u-isHidden');

      expect(webWidget.renderChat())
        .toBeFalsy();
    });

    it('renders the chatPopup component', () => {
      expect(webWidget.renderChatNotification())
        .toBeTruthy();
    });

    describe('when component is set to submitTicket', () => {
      beforeEach(() => {
        webWidget = domRender(<WebWidget activeEmbed='ticketSubmissionForm' helpCenterAvailable={true} />);
      });

      it('shows submit ticket component', () => {
        expect(webWidget.renderHelpCenter().props.className)
          .toContain('u-isHidden');

        expect(webWidget.renderSubmitTicket().props.className)
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
        expect(webWidget.renderHelpCenter().props.className)
          .toContain('u-isHidden');

        expect(webWidget.renderSubmitTicket().props.className)
          .toContain('u-isHidden');

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

    describe('when there is a proactive chat popup and no active embed', () => {
      beforeEach(() => {
        const mockChatNotification = { proactive: true, show: true };

        webWidget = instanceRender(
          <WebWidget
            fullscreen={true}
            activeEmbed={''}
            chatNotification={mockChatNotification} />
        );
        spyOn(webWidget, 'renderStandaloneChatPopup');
        webWidget.render();
      });

      it('shows the standaloneChatPopup', () => {
        expect(webWidget.renderStandaloneChatPopup)
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
      mockChatNotification = { show: true };

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
      const expectedProps = { isMobile: true, shouldShow: true, notification: mockChatNotification };

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

    describe('when ChatNotificationDismiss respond prop is called', () => {
      let chatNotificationDismissedSpy,
        setFixedFrameStylesSpy,
        onShowMobileSpy;

      beforeEach(() => {
        chatNotificationDismissedSpy = jasmine.createSpy('chatNotificationDismissed');
        setFixedFrameStylesSpy = jasmine.createSpy('setFixedFrameStyles');
        onShowMobileSpy = jasmine.createSpy('onShowMobile');
        webWidget = domRender(
          <WebWidget
            chatNotification={mockChatNotification}
            chatNotificationDismissed={chatNotificationDismissedSpy}
            setFixedFrameStyles={setFixedFrameStylesSpy}
            onShowMobile={onShowMobileSpy} />
        );

        result = webWidget.renderStandaloneChatPopup();
        container = result.props.children;
        chatPopup = container.props.children;

        spyOn(webWidget, 'onCloseClick');
        chatPopup.props.chatNotificationDismissed();
      });

      it('calls props.setFixedFrameStyles with no parameters', () => {
        expect(setFixedFrameStylesSpy)
          .toHaveBeenCalledWith();
      });

      it('calls props.onCloseClick', () => {
        expect(webWidget.onCloseClick)
          .toHaveBeenCalled();
      });

      it('calls props.chatNotificationDismissed', () => {
        expect(chatNotificationDismissedSpy)
          .toHaveBeenCalled();
      });
    });
  });

  describe('renderChat', () => {
    let result;

    describe('when props.showOfflineChat is true', () => {
      beforeEach(() => {
        const webWidget = instanceRender(
          <WebWidget
            activeEmbed='chat'
            showOfflineChat={true} />
        );

        result = webWidget.renderChat();
      });

      it('renders ChatOffline', () => {
        expect(TestUtils.isElementOfType(result, ChatOffline))
          .toEqual(true);
      });
    });

    describe('when props.showOfflineForm is false', () => {
      const updateBackButtonVisibilitySpy = jasmine.createSpy('updateBackButtonVisibility');
      let webWidget;

      beforeEach(() => {
        webWidget = instanceRender(
          <WebWidget
            activeEmbed='chat'
            showOfflineForm={false}
            chatStatus='offline'
            updateBackButtonVisibility={updateBackButtonVisibilitySpy} />
        );

        result = webWidget.renderChat();
      });

      it('renders Chat', () => {
        expect(result.ref)
          .toEqual('chat');
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

          it('calls updateBackButtonVisibility with true', () => {
            expect(updateBackButtonVisibilitySpy)
              .toHaveBeenCalledWith(false);
          });
        });
      });
    });
  });

  describe('renderChatNotification', () => {
    let result;

    describe('when props.fullscreen and props.helpCenterSearchFocused are true', () => {
      beforeEach(() => {
        const webWidget = instanceRender(
          <WebWidget
            activeEmbed='helpCenterForm'
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

  describe('setAuthenticated', () => {
    let webWidget,
      updateAuthenticatedSpy;

    beforeEach(() => {
      updateAuthenticatedSpy = jasmine.createSpy('updateAuthenticated');
      webWidget = instanceRender(<WebWidget updateAuthenticated={updateAuthenticatedSpy} />);
      webWidget.setAuthenticated(true);
    });

    it('should call props.updateAuthenticated with a boolean value', () => {
      expect(updateAuthenticatedSpy)
        .toHaveBeenCalledWith(true);
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

        it('should call updateActiveEmbed with channelChoice', () => {
          expect(mockUpdateActiveEmbed)
            .toHaveBeenCalledWith('channelChoice');
        });
      });

      describe('when channel choice is not available', () => {
        let onCancelSpy;

        beforeEach(() => {
          onCancelSpy = jasmine.createSpy('onCancelSpy');
          webWidget = instanceRender(
            <WebWidget
              onCancel={onCancelSpy}
              updateActiveEmbed={mockUpdateActiveEmbed} />
          );

          spyOn(webWidget, 'isHelpCenterAvailable').and.returnValue(false);
          spyOn(webWidget, 'isChannelChoiceAvailable').and.returnValue(false);
          webWidget.onCancelClick();
        });

        it('should call onCancel prop', () => {
          expect(onCancelSpy)
            .toHaveBeenCalled();
        });

        it('should call updateActiveEmbed with an empty string', () => {
          expect(mockUpdateActiveEmbed)
            .toHaveBeenCalledWith('');
        });
      });
    });
  });

  describe('#onNextClick', () => {
    let webWidget, updateBackButtonVisibilitySpy;

    beforeEach(() => {
      updateBackButtonVisibilitySpy = jasmine.createSpy('updateBackButtonVisibilitySpy');
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

      it('should call updateActiveEmbed with that param', () => {
        expect(mockUpdateActiveEmbed)
          .toHaveBeenCalledWith('foo');
      });

      describe('when that param is chat and oldChat is true', () => {
        beforeEach(() => {
          webWidget.onNextClick('chat');
        });

        it('should call updateActiveEmbed with that zopims variable', () => {
          expect(mockUpdateActiveEmbed)
            .toHaveBeenCalledWith('zopimChat');
        });
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

      it('should call updateActiveEmbed with talk', () => {
        expect(mockUpdateActiveEmbed)
          .toHaveBeenCalledWith('talk');
      });

      it('should call updateBackButtonVisibility with true', () => {
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

      it('should call updateActiveEmbed with chat', () => {
        expect(mockUpdateActiveEmbed)
          .toHaveBeenCalledWith('chat');
      });

      it('should call updateBackButtonVisibility with true', () => {
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

      it('should call updateActiveEmbed with ticketSubmissionForm', () => {
        expect(mockUpdateActiveEmbed)
          .toHaveBeenCalledWith('ticketSubmissionForm');
      });

      it('should call updateBackButtonVisibility with true', () => {
        expect(updateBackButtonVisibilitySpy)
          .toHaveBeenCalledWith(true);
      });
    });
  });

  describe('onCloseClick', () => {
    let webWidget, updateActiveEmbedSpy, onCancelSpy;

    beforeEach(() => {
      updateActiveEmbedSpy = jasmine.createSpy('updateActiveEmbed');
      onCancelSpy = jasmine.createSpy('onCancel');

      webWidget = instanceRender(
        <WebWidget
          updateActiveEmbed={updateActiveEmbedSpy}
          onCancel={onCancelSpy} />
      );
      webWidget.onCloseClick();
    });

    it('calls props.updateActiveEmbed with empty string', () => {
      expect(updateActiveEmbedSpy)
        .toHaveBeenCalledWith('');
    });

    it('calls props.onCancel', () => {
      expect(onCancelSpy)
        .toHaveBeenCalled();
    });
  });

  describe('#onBackClick', () => {
    let webWidget,
      resetActiveArticleSpy,
      updateBackButtonVisibilitySpy;

    beforeEach(() => {
      resetActiveArticleSpy = jasmine.createSpy('resetActiveArticle');
      updateBackButtonVisibilitySpy = jasmine.createSpy('updateBackButtonVisibility');
    });

    describe('when help center is the active component', () => {
      beforeEach(() => {
        webWidget = domRender(
          <WebWidget
            activeEmbed='helpCenterForm'
            helpCenterAvailable={true}
            resetActiveArticle={resetActiveArticleSpy}
            updateBackButtonVisibility={updateBackButtonVisibilitySpy} />
        );
        webWidget.onBackClick();
      });

      it('calls resetActiveArticle', () => {
        expect(resetActiveArticleSpy)
          .toHaveBeenCalled();
      });

      it('calls updateBackButtonVisibility prop with false', () => {
        expect(updateBackButtonVisibilitySpy)
          .toHaveBeenCalledWith(false);
      });
    });

    describe('when submit ticket is the active component', () => {
      describe('when showTicketFormsBackButton is true', () => {
        beforeEach(() => {
          webWidget = domRender(
            <WebWidget
              updateActiveEmbed={() => {}}
              activeEmbed='ticketSubmissionForm'
              helpCenterAvailable={true}
              showTicketFormsBackButton={true}
              updateBackButtonVisibility={updateBackButtonVisibilitySpy} />
          );
          webWidget.onBackClick();
        });

        it('should call updateBackButtonVisibility prop', () => {
          expect(updateBackButtonVisibilitySpy)
            .toHaveBeenCalledWith(true);
        });

        it('should call clear form on the rootComponent', () => {
          expect(clearFormSpy)
            .toHaveBeenCalled();
        });

        describe('when helpCenter is not available and channel choice is', () => {
          beforeEach(() => {
            webWidget = domRender(
              <WebWidget
                updateActiveEmbed={() => {}}
                activeEmbed='ticketSubmissionForm'
                helpCenterAvailable={false}
                channelChoice={true}
                updateBackButtonVisibility={updateBackButtonVisibilitySpy} />
            );
            webWidget.onBackClick();
          });

          it('should still call updateBackButtonVisibility prop with true', () => {
            expect(updateBackButtonVisibilitySpy)
              .toHaveBeenCalledWith(true);
          });
        });

        describe('when helpCenter and channel choice are not available', () => {
          beforeEach(() => {
            webWidget = domRender(
              <WebWidget
                updateActiveEmbed={() => {}}
                activeEmbed='ticketSubmissionForm'
                helpCenterAvailable={false}
                channelChoice={false}
                updateBackButtonVisibility={updateBackButtonVisibilitySpy} />
            );
            webWidget.onBackClick();
          });

          it('should call updateBackButtonVisibility prop with false', () => {
            expect(updateBackButtonVisibilitySpy)
              .toHaveBeenCalledWith(false);
          });
        });
      });

      describe('when showTicketFormsBackButton is false', () => {
        beforeEach(() => {
          webWidget = domRender(
            <WebWidget
              updateActiveEmbed={noop}
              activeEmbed='ticketSubmissionForm'
              helpCenterAvailable={true}
              articleViewActive={false}
              showTicketFormsBackButton={false}
              updateBackButtonVisibility={updateBackButtonVisibilitySpy} />
          );
          spyOn(webWidget, 'showHelpCenter').and.callThrough();
          webWidget.onBackClick();
        });

        it('should call showHelpCenter', () => {
          expect(webWidget.showHelpCenter)
            .toHaveBeenCalled();
        });

        describe('when an article is not active', () => {
          beforeEach(() => {
            webWidget.onBackClick();
          });

          it('should call updateBackButtonVisibility prop with false', () => {
            expect(updateBackButtonVisibilitySpy)
              .toHaveBeenCalledWith(false);
          });
        });

        describe('when an article is active and helpCenter is available', () => {
          beforeEach(() => {
            webWidget = domRender(
              <WebWidget
                updateActiveEmbed={noop}
                helpCenterAvailable={true}
                articleViewActive={true}
                activeEmbed='ticketSubmissionForm'
                updateBackButtonVisibility={updateBackButtonVisibilitySpy} />
            );
            webWidget.onBackClick();
          });

          it('should call updateBackButtonVisibility prop with true', () => {
            expect(updateBackButtonVisibilitySpy)
              .toHaveBeenCalledWith(true);
          });
        });
      });
    });

    describe('when chat is the active component', () => {
      beforeEach(() => {
        webWidget = domRender(
          <WebWidget
            updateActiveEmbed={() => {}}
            activeEmbed='chat'
            helpCenterAvailable={true}
            updateBackButtonVisibility={updateBackButtonVisibilitySpy} />
        );
        spyOn(webWidget, 'showHelpCenter').and.callThrough();
        webWidget.onBackClick();
      });

      it('should call showHelpCenter', () => {
        expect(webWidget.showHelpCenter)
          .toHaveBeenCalled();
      });

      it('should call updateBackButtonVisibility prop', () => {
        expect(updateBackButtonVisibilitySpy)
          .toHaveBeenCalled();
      });

      describe('when help center is not available and channel choice is', () => {
        let updateActiveEmbedSpy;

        beforeEach(() => {
          updateActiveEmbedSpy = jasmine.createSpy();

          webWidget = domRender(
            <WebWidget
              updateActiveEmbed={updateActiveEmbedSpy}
              activeEmbed='chat'
              helpCenterAvailable={false}
              channelChoice={true}
              chatAvailable={true}
              updateBackButtonVisibility={updateBackButtonVisibilitySpy} />
          );
          webWidget.onBackClick();
        });

        it('should call call updateActiveEmbed with channelChoice', () => {
          expect(updateActiveEmbedSpy)
            .toHaveBeenCalledWith('channelChoice');
        });

        it('should call updateBackButtonVisibility prop with false', () => {
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
      beforeEach(() => {
        webWidget = domRender(
          <WebWidget updateActiveEmbed={noop} activeEmbed='chat' />
        );

        spyOn(webWidget, 'resetActiveEmbed');
        webWidget.show();
      });

      it('does not call resetActiveEmbed', () => {
        expect(webWidget.resetActiveEmbed)
          .not.toHaveBeenCalled();
      });

      describe('when viaActivate is true', () => {
        beforeEach(() => {
          webWidget = domRender(
            <WebWidget
              helpCenterAvailable={true}
              updateActiveEmbed={noop}
              activeEmbed='chat' />
          );

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
      beforeEach(() => {
        webWidget = instanceRender(
          <WebWidget
            updateActiveEmbed={updateActiveEmbedSpy}
            updateBackButtonVisibility={updateBackButtonVisibilitySpy}
            helpCenterAvailable={true}
            activeEmbed='' />
        );

        spyOn(webWidget, 'isHelpCenterAvailable').and.returnValue(true);
        webWidget.resetActiveEmbed();
      });

      it('calls updateActiveEmbed with help center', () => {
        expect(updateActiveEmbedSpy)
          .toHaveBeenCalledWith('helpCenterForm');
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

      it('should call updateActiveEmbed with zopimChat', () => {
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

        it('should call zopimOnNext', () => {
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

        it('should call zopimOnNext', () => {
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
      let setFixedFrameStylesSpy;

      beforeEach(() => {
        setFixedFrameStylesSpy = jasmine.createSpy('setFixedFrameStyles');
        webWidget = instanceRender(
          <WebWidget
            oldChat={false}
            fullscreen={true}
            setFixedFrameStyles={setFixedFrameStylesSpy} />
        );
        webWidget.showProactiveChat();
      });

      it('calls props.setFixedFrameStyles with correct styles', () => {
        expect(setFixedFrameStylesSpy)
          .toHaveBeenCalledWith({ height: '33%', background: 'transparent' });
      });
    });

    describe('when not on mobile', () => {
      beforeEach(() => {
        webWidget = instanceRender(<WebWidget oldChat={false} fullscreen={false} />);
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

        spyOn(webWidget, 'getRootComponent');

        webWidget.onContainerClick();
      });

      it('calls getRootComponent', () => {
        expect(webWidget.getRootComponent)
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

        spyOn(webWidget, 'getRootComponent');

        webWidget.onContainerClick();
      });

      it('calls getRootComponent', () => {
        expect(webWidget.getRootComponent)
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
