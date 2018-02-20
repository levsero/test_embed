let updateChatScreenSpy;
const prechatScreen = 'widget/chat/PRECHAT_SCREEN';
const chattingScreen = 'widget/chat/CHATTING_SCREEN';

describe('Chat component', () => {
  let Chat, prechatFormSettingsProp;

  const chatPath = buildSrcPath('component/chat/Chat');
  const AttachmentBox = noopReactComponent();

  const EMAIL_TRANSCRIPT_IDLE = 'widget/chat/EMAIL_TRANSCRIPT_IDLE';
  const EMAIL_TRANSCRIPT_SUCCESS = 'widget/chat/EMAIL_TRANSCRIPT_SUCCESS';
  const EMAIL_TRANSCRIPT_FAILURE = 'widget/chat/EMAIL_TRANSCRIPT_FAILURE';
  const EMAIL_TRANSCRIPT_REQUEST_SENT = 'widget/chat/EMAIL_TRANSCRIPT_REQUEST_SENT';

  updateChatScreenSpy = jasmine.createSpy('updateChatScreen');

  beforeEach(() => {
    mockery.enable();

    prechatFormSettingsProp = { form: {}, required: false };

    initMockRegistry({
      './Chat.scss': {
        locals: {
          scrollContainerMobile: 'scrollContainerMobileClasses',
          footer: 'footerClasses',
          agentTyping: 'agentTypingClasses'
        }
      },
      'component/chat/ChatBox': {
        ChatBox: noopReactComponent()
      },
      'component/chat/ChatHeader': {
        ChatHeader: noopReactComponent()
      },
      'component/chat/ChatPrechatForm': {
        ChatPrechatForm: noopReactComponent()
      },
      'component/chat/ChatFooter': {
        ChatFooter: noopReactComponent()
      },
      'component/chat/ChatMenu': {
        ChatMenu: noopReactComponent()
      },
      'component/chat/ChatLog': {
        ChatLog: noopReactComponent()
      },
      'component/container/Container': {
        Container: noopReactComponent()
      },
      'component/chat/ChatPopup': {
        ChatPopup: noopReactComponent()
      },
      'component/chat/ChatContactDetailsPopup': {
        ChatContactDetailsPopup: noopReactComponent()
      },
      'component/chat/ChatEmailTranscriptPopup': {
        ChatEmailTranscriptPopup: noopReactComponent()
      },
      'component/chat/ChatFeedbackForm': {
        ChatFeedbackForm: noopReactComponent()
      },
      'component/chat/ChatRatingGroup': {
        ChatRatings: {}
      },
      'component/loading/LoadingEllipses': {
        LoadingEllipses: noopReactComponent()
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
        setVisitorInfo: noop,
        updateChatScreen: updateChatScreenSpy
      },
      'src/redux/modules/chat/chat-selectors': {
        getPrechatFormFields: noop
      },
      'src/redux/modules/chat/chat-screen-types': {
        PRECHAT_SCREEN: prechatScreen,
        CHATTING_SCREEN: chattingScreen
      },
      'src/redux/modules/chat/chat-action-types': {
        EMAIL_TRANSCRIPT_IDLE: EMAIL_TRANSCRIPT_IDLE,
        EMAIL_TRANSCRIPT_SUCCESS: EMAIL_TRANSCRIPT_SUCCESS,
        EMAIL_TRANSCRIPT_FAILURE: EMAIL_TRANSCRIPT_FAILURE
      },
      'service/i18n': {
        i18n: { t: _.identity }
      }
    });

    mockery.registerAllowable(chatPath);
    Chat = requireUncached(chatPath).default.WrappedComponent;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('onContainerClick', () => {
    let emailTranscript,
      resetEmailTranscriptSpy,
      component;

    beforeEach(() => {
      resetEmailTranscriptSpy = jasmine.createSpy('resetEmailTranscriptSpy');
    });

    describe('when emailTranscript status is EMAIL_TRANSCRIPT_FAILURE', () => {
      beforeEach(() => {
        emailTranscript = {
          status: EMAIL_TRANSCRIPT_FAILURE,
          email: 'yolo@yolo.com'
        };
        component = domRender(<Chat emailTranscript={emailTranscript} resetEmailTranscript={resetEmailTranscriptSpy} />);
        component.onContainerClick();
      });

      it('should set the correct state', () => {
        expect(component.state)
          .toEqual(jasmine.objectContaining({
            showMenu: false,
            showEndChatMenu: false,
            showEditContactDetailsMenu: false,
            showEmailTranscriptMenu: false
          }));
      });

      it('should call resetEmailTranscript', () => {
        expect(resetEmailTranscriptSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when emailTranscript status is EMAIL_TRANSCRIPT_SUCCESS', () => {
      beforeEach(() => {
        emailTranscript = {
          status: EMAIL_TRANSCRIPT_SUCCESS,
          email: 'yolo@yolo.com'
        };
        component = domRender(<Chat emailTranscript={emailTranscript} resetEmailTranscript={resetEmailTranscriptSpy} />);
        component.onContainerClick();
      });

      it('should set the correct state', () => {
        expect(component.state)
          .toEqual(jasmine.objectContaining({
            showMenu: false,
            showEndChatMenu: false,
            showEditContactDetailsMenu: false,
            showEmailTranscriptMenu: false
          }));
      });

      it('should call resetEmailTranscript', () => {
        expect(resetEmailTranscriptSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when emailTranscript status is irrelevant', () => {
      beforeEach(() => {
        emailTranscript = {
          status: 'yolo',
          email: 'yolo@yolo.com'
        };
        component = domRender(<Chat emailTranscript={emailTranscript} resetEmailTranscript={resetEmailTranscriptSpy} />);
        component.onContainerClick();
      });

      it('should set the correct state', () => {
        expect(component.state)
          .toEqual(jasmine.objectContaining({
            showMenu: false,
            showEndChatMenu: false,
            showEditContactDetailsMenu: false,
            showEmailTranscriptMenu: false
          }));
      });

      it('should not call resetEmailTranscript', () => {
        expect(resetEmailTranscriptSpy)
          .not.toHaveBeenCalled();
      });
    });
  });

  describe('componentWillReceiveProps', () => {
    let emailTranscript,
      nextProps,
      component;

    describe('when next props emailTranscript status is not EMAIL_TRANSCRIPT_IDLE', () => {
      beforeEach(() => {
        emailTranscript = {
          status: EMAIL_TRANSCRIPT_SUCCESS,
          email: 'yolo@yolo.com'
        };
        component = domRender(<Chat emailTranscript={emailTranscript} chats={[]} events={[]} />);
      });

      describe('when next props is different from previous props', () => {
        beforeEach(() => {
          nextProps = {
            emailTranscript: {
              status: EMAIL_TRANSCRIPT_REQUEST_SENT
            },
            chats: [],
            events: []
          };
          component.componentWillReceiveProps(nextProps);
        });

        it('should set the correct state', () => {
          expect(component.state)
            .toEqual(jasmine.objectContaining({
              showEmailTranscriptMenu: true
            }));
        });
      });

      describe('when next props is not different from previous props', () => {
        beforeEach(() => {
          nextProps = {
            emailTranscript: {
              status: EMAIL_TRANSCRIPT_SUCCESS
            },
            chats: [],
            events: []
          };
          component.componentWillReceiveProps(nextProps);
        });

        it('should not update state', () => {
          expect(component.state)
            .toEqual(jasmine.objectContaining({
              showEmailTranscriptMenu: false
            }));
        });
      });
    });

    describe('when next props emailTranscript status is EMAIL_TRANSCRIPT_IDLE', () => {
      beforeEach(() => {
        emailTranscript = {
          status: EMAIL_TRANSCRIPT_IDLE,
          email: 'yolo@yolo.com'
        };
        component = domRender(<Chat emailTranscript={emailTranscript} chats={[]} events={[]} />);
      });

      describe('when next props is different from previous props', () => {
        beforeEach(() => {
          nextProps = {
            emailTranscript: {
              status: EMAIL_TRANSCRIPT_IDLE
            },
            chats: [],
            events: []
          };
          component.componentWillReceiveProps(nextProps);
        });

        it('should not update the state', () => {
          expect(component.state)
            .toEqual(jasmine.objectContaining({
              showEmailTranscriptMenu: false
            }));
        });
      });

      describe('when next props is not different from previous props', () => {
        beforeEach(() => {
          nextProps = {
            emailTranscript: {
              status: EMAIL_TRANSCRIPT_IDLE
            },
            chats: [],
            events: []
          };
          component.componentWillReceiveProps(nextProps);
        });

        it('should not update the state', () => {
          expect(component.state)
            .toEqual(jasmine.objectContaining({
              showEmailTranscriptMenu: false
            }));
        });
      });
    });
  });

  describe('onPrechatFormComplete', () => {
    let component, setVisitorInfoSpy, sendMsgSpy;
    const formInfo = {
      display_name: 'Daenerys Targaryen',
      email: 'mother@of.dragons',
      phone: '87654321',
      message: 'bend the knee'
    };

    beforeEach(() => {
      setVisitorInfoSpy = jasmine.createSpy('setVisitorInfo');
      sendMsgSpy = jasmine.createSpy('sendMsg');

      component = domRender(
        <Chat
          postChatFormSettings={{ header: 'foo' }}
          setVisitorInfo={setVisitorInfoSpy}
          sendMsg={sendMsgSpy}
          updateChatScreen={updateChatScreenSpy} />
      );

      component.onPrechatFormComplete(formInfo);
    });

    it('calls setVisitorInfo with the display_name, email and phone', () => {
      const visitorInfo = _.omit(formInfo, ['message']);

      expect(setVisitorInfoSpy)
        .toHaveBeenCalledWith(visitorInfo);
    });

    it('calls sendMsg with the message', () => {
      expect(sendMsgSpy)
        .toHaveBeenCalledWith(formInfo.message);
    });

    it('calls updateChatScreen with `chatting`', () => {
      expect(updateChatScreenSpy)
        .toHaveBeenCalledWith(chattingScreen);
    });
  });

  describe('renderPrechatScreen', () => {
    let component;

    describe('when state.screen is not `prechat`', () => {
      beforeEach(() => {
        component = domRender(
          <Chat
            screen={chattingScreen}
            prechatFormSettings={prechatFormSettingsProp} />
        );
      });

      it('does not return anything', () => {
        expect(component.renderPrechatScreen())
          .toBeFalsy();
      });
    });

    describe('when state.screen is `prechat`', () => {
      beforeEach(() => {
        component = domRender(
          <Chat
            screen={prechatScreen}
            prechatFormSettings={prechatFormSettingsProp} />
        );
      });

      it('returns a component', () => {
        expect(component.renderPrechatScreen())
          .toBeTruthy();
      });
    });
  });

  describe('renderChatScreen', () => {
    let component,
      componentNode;
    const renderChatComponent = (ratingsEnabled, agents) => (
      domRender(<Chat screen={chattingScreen} ratingSettings={{ enabled: ratingsEnabled }} agents={agents} />)
    );

    describe('render', () => {
      beforeEach(() => {
        component = renderChatComponent(true, {});

        componentNode = ReactDOM.findDOMNode(component);
      });

      it('renders the chat screen with footer styles', () => {
        expect(componentNode.querySelector('.footerClasses'))
          .toBeTruthy();
      });

      describe('the renderChatHeader call', () => {
        const mockAgents = { agent_id: { display_name: 'James', typing: false }};
        const setupComponentAndRenderChatScreen = (ratingsEnabled, agents) => {
          component = renderChatComponent(ratingsEnabled, agents);
          spyOn(component, 'renderChatHeader');
          component.renderChatScreen();
        };

        describe('when the ratings setting is enabled and there are agents in the chat', () => {
          beforeEach(() => {
            setupComponentAndRenderChatScreen(true, mockAgents);
          });

          it('is made with the showRatings argument set to true', () => {
            expect(component.renderChatHeader).toHaveBeenCalledWith(true);
          });
        });

        describe('when the ratings setting is disabled', () => {
          beforeEach(() => {
            setupComponentAndRenderChatScreen(false, mockAgents);
          });

          it('is made with the showRatings argument set to false', () => {
            expect(component.renderChatHeader).toHaveBeenCalledWith(false);
          });
        });

        describe('when there are no agents in the chat', () => {
          beforeEach(() => {
            setupComponentAndRenderChatScreen(true, {});
          });

          it('is made with the showRatings argument set to false', () => {
            expect(component.renderChatHeader).toHaveBeenCalledWith(false);
          });
        });
      });
    });

    describe('when state.screen is not `chatting`', () => {
      beforeEach(() => {
        component = domRender(
          <Chat
            screen={prechatScreen}
            prechatFormSettings={prechatFormSettingsProp} />
        );
      });

      it('does not return anything', () => {
        expect(component.renderChatScreen())
          .toBeFalsy();
      });
    });

    describe('when state.screen is `chatting`', () => {
      beforeEach(() => {
        component = domRender(
          <Chat
            screen={chattingScreen}
            prechatFormSettings={prechatFormSettingsProp} />
        );
      });

      it('returns a component', () => {
        expect(component.renderChatScreen())
          .toBeTruthy();
      });
    });
  });

  describe('renderChatScreen', () => {
    let component;

    describe('for non mobile devices', () => {
      beforeEach(() => {
        component = domRender(<Chat screen={chattingScreen} />);
      });

      it('does not add classes to it', () => {
        expect(component.renderChatScreen().props.containerClasses)
          .toBe('');
      });
    });

    describe('for mobile devices', () => {
      beforeEach(() => {
        component = domRender(<Chat isMobile={true} screen={chattingScreen} />);
      });

      it('adds mobile container classes to it', () => {
        expect(component.renderChatScreen().props.containerClasses)
          .toContain('scrollContainerMobileClasses');
      });
    });
  });

  describe('renderChatMenu', () => {
    let component;

    describe('when state.showMenu is false', () => {
      beforeEach(() => {
        component = domRender(<Chat />);
        component.setState({ showMenu: false });
      });

      it('passes false to its popup components show prop', () => {
        expect(component.renderChatMenu().props.show)
          .toBe(false);
      });
    });

    describe('when state.showMenu is true', () => {
      beforeEach(() => {
        component = domRender(<Chat />);
        component.setState({ showMenu: true });
      });

      it('passes true to its popup components show prop', () => {
        expect(component.renderChatMenu().props.show)
          .toBe(true);
      });
    });
  });

  describe('renderChatEndPopup', () => {
    let component;

    describe('when the notification should be shown', () => {
      beforeEach(() => {
        component = domRender(
          <Chat chat={{ rating: null }} />
        );
        component.setState({ showEndChatMenu: true });
      });

      it('passes true to its popup components show prop', () => {
        expect(component.renderChatEndPopup().props.show)
          .toBe(true);
      });
    });

    describe('when the notification should not be shown', () => {
      beforeEach(() => {
        component = domRender(<Chat chat={{ rating: null }} />);
      });

      it('passes false to its popup components show prop', () => {
        expect(component.renderChatEndPopup().props.show)
          .toBe(false);
      });
    });
  });

  describe('renderChatContactDetailsPopup', () => {
    let component;

    describe('when the popup should be shown', () => {
      beforeEach(() => {
        component = domRender(
          <Chat chat={{ rating: null }} />
        );
        component.setState({ showEditContactDetailsMenu: true });
      });

      it('passes true to its popup components show prop', () => {
        expect(component.renderChatContactDetailsPopup().props.show)
          .toBe(true);
      });
    });

    describe('when the popup should not be shown', () => {
      beforeEach(() => {
        component = domRender(<Chat chat={{ rating: null }} />);
      });

      it('passes false to its popup components show prop', () => {
        expect(component.renderChatContactDetailsPopup().props.show)
          .toBe(false);
      });
    });
  });

  describe('renderChatEmailTranscriptPopup', () => {
    let component;

    describe('when the popup should be shown', () => {
      beforeEach(() => {
        component = domRender(
          <Chat />
        );
        component.setState({ showEmailTranscriptMenu: true });
      });

      it('shows the email transcript popup component', () => {
        expect(component.renderChatEmailTranscriptPopup())
          .not.toBeNull();
      });
    });

    describe('when the popup should not be shown', () => {
      beforeEach(() => {
        component = domRender(<Chat />);
      });

      it('does not show the chat contact details popup component', () => {
        expect(component.renderChatEmailTranscriptPopup())
          .toBeNull();
      });
    });
  });

  describe('renderAgentTyping', () => {
    let agentTypingComponent,
      mockAgents;

    describe('when no agents are typing a message', () => {
      beforeEach(() => {
        mockAgents = [
          { display_name: 'Wayne', typing: false }
        ];

        const component = instanceRender(<Chat chat={{ rating: null }} agents={mockAgents} />);

        agentTypingComponent = component.renderAgentTyping();
      });

      it('renders nothing', () => {
        expect(agentTypingComponent)
          .toBeNull();
      });
    });

    describe('when there is an agent typing a message', () => {
      beforeEach(() => {
        mockAgents = [
          { display_name: 'Wayne', typing: true }
        ];

        const component = instanceRender(<Chat chat={{ rating: null }} agents={mockAgents} />);

        agentTypingComponent = component.renderAgentTyping();
      });

      it('renders the notification style', () => {
        expect(agentTypingComponent.props.className)
          .toEqual('agentTypingClasses');
      });

      it('renders a notification that signifies a single agent typing', () => {
        expect(agentTypingComponent.props.children[1])
          .toEqual('embeddable_framework.chat.chatLog.isTyping');
      });
    });

    describe('when two agents are typing a message', () => {
      beforeEach(() => {
        mockAgents = [
          { display_name: 'Wayne', typing: true },
          { display_name: 'Terence', typing: true }
        ];

        const component = instanceRender(<Chat chat={{ rating: null }} agents={mockAgents} />);

        agentTypingComponent = component.renderAgentTyping();
      });

      it('renders the notification style', () => {
        expect(agentTypingComponent.props.className)
          .toEqual('agentTypingClasses');
      });

      it('renders a notification that signifies two agents typing', () => {
        expect(agentTypingComponent.props.children[1])
          .toEqual('embeddable_framework.chat.chatLog.isTyping_two');
      });
    });

    describe('when more than two agents are typing a message', () => {
      beforeEach(() => {
        mockAgents = [
          { display_name: 'Wayne', typing: true },
          { display_name: 'Terence', typing: true },
          { display_name: 'Mandy', typing: true }
        ];

        const component = instanceRender(<Chat chat={{ rating: null }} agents={mockAgents} />);

        agentTypingComponent = component.renderAgentTyping();
      });

      it('renders the notification style', () => {
        expect(agentTypingComponent.props.className)
          .toEqual('agentTypingClasses');
      });

      it('renders a notification that signifies multiple agents typing', () => {
        expect(agentTypingComponent.props.children[1])
          .toEqual('embeddable_framework.chat.chatLog.isTyping_multiple');
      });
    });
  });

  describe('renderAttachmentsBox', () => {
    let component;
    const renderChatComponent = (screen, attachmentsEnabled) => (
      domRender(
        <Chat screen={screen} attachmentsEnabled={attachmentsEnabled} prechatFormSettings={prechatFormSettingsProp} />
      )
    );

    describe('when screen is not `chatting`', () => {
      beforeEach(() => {
        component = renderChatComponent(prechatScreen, true);
        component.handleDragEnter();
      });

      it('does not return anything', () => {
        expect(component.renderAttachmentsBox())
          .toBeFalsy();
      });
    });

    describe('when attachmentsEnabled is false', () => {
      beforeEach(() => {
        component = renderChatComponent(chattingScreen, false);
        component.handleDragEnter();
      });

      it('does not return anything', () => {
        expect(component.renderAttachmentsBox())
          .toBeFalsy();
      });
    });

    describe('when the component has not had handleDragEnter called on it', () => {
      beforeEach(() => {
        component = renderChatComponent(chattingScreen, true);
      });

      it('does not return anything', () => {
        expect(component.renderAttachmentsBox())
          .toBeFalsy();
      });
    });

    describe('when the screen is `chatting`, the attachments are enabled and handleDragEnter has been called', () => {
      beforeEach(() => {
        component = renderChatComponent(chattingScreen, true);
        component.handleDragEnter();
      });

      it('returns the AttachmentsBox component', () => {
        expect(TestUtils.isElementOfType(component.renderAttachmentsBox(), AttachmentBox))
          .toEqual(true);
      });
    });
  });
});
