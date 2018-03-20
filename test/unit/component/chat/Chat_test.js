const prechatScreen = 'widget/chat/PRECHAT_SCREEN';
const chattingScreen = 'widget/chat/CHATTING_SCREEN';
const feedbackScreen = 'widget/chat/FEEDBACK_SCREEN';

describe('Chat component', () => {
  let Chat, prechatFormSettingsProp;

  const chatPath = buildSrcPath('component/chat/Chat');
  const AttachmentBox = noopReactComponent();

  const EMAIL_TRANSCRIPT_SCREEN = 'widget/chat/EMAIL_TRANSCRIPT_SCREEN';
  const EMAIL_TRANSCRIPT_SUCCESS_SCREEN = 'widget/chat/EMAIL_TRANSCRIPT_SUCCESS_SCREEN';
  const EMAIL_TRANSCRIPT_FAILURE_SCREEN = 'widget/chat/EMAIL_TRANSCRIPT_FAILURE_SCREEN';
  const EMAIL_TRANSCRIPT_LOADING_SCREEN = 'widget/chat/EMAIL_TRANSCRIPT_LOADING_SCREEN';

  const updateChatScreenSpy = jasmine.createSpy('updateChatScreen');
  const sendChatRatingSpy = jasmine.createSpy('sendChatRating');
  const sendChatCommentSpy = jasmine.createSpy('sendChatComment');
  const endChatSpy = jasmine.createSpy('endChat');

  const ChatFeedbackForm = noopReactComponent('ChatFeedbackForm');

  beforeEach(() => {
    mockery.enable();

    prechatFormSettingsProp = { form: {}, required: false };

    initMockRegistry({
      './Chat.scss': {
        locals: {
          scrollContainerMobile: 'scrollContainerMobileClasses',
          footer: 'footerClasses',
          agentTyping: 'agentTypingClasses',
          messagesMobile: 'messagesMobileClasses',
          messages: 'messagesClasses'
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
        ChatFeedbackForm
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
        updateChatScreen: updateChatScreenSpy,
        sendChatRating: sendChatRatingSpy,
        sendChatComment: sendChatCommentSpy,
        endChat: endChatSpy
      },
      'src/redux/modules/chat/chat-selectors': {
        getPrechatFormFields: noop
      },
      'src/redux/modules/chat/chat-screen-types': {
        PRECHAT_SCREEN: prechatScreen,
        CHATTING_SCREEN: chattingScreen,
        FEEDBACK_SCREEN: feedbackScreen,
        EMAIL_TRANSCRIPT_SCREEN: EMAIL_TRANSCRIPT_SCREEN,
        EMAIL_TRANSCRIPT_SUCCESS_SCREEN: EMAIL_TRANSCRIPT_SUCCESS_SCREEN,
        EMAIL_TRANSCRIPT_FAILURE_SCREEN: EMAIL_TRANSCRIPT_FAILURE_SCREEN
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
    let component;

    beforeEach(() => {
      component = domRender(<Chat />);
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
  });

  describe('componentWillReceiveProps', () => {
    let emailTranscript,
      nextProps,
      component;

    describe('when next props emailTranscript screen is not EMAIL_TRANSCRIPT_SCREEN', () => {
      beforeEach(() => {
        emailTranscript = {
          screen: EMAIL_TRANSCRIPT_SUCCESS_SCREEN,
          email: 'yolo@yolo.com'
        };
        component = domRender(<Chat emailTranscript={emailTranscript} chats={[]} events={[]} />);
      });

      describe('when next props is different from previous props', () => {
        beforeEach(() => {
          nextProps = {
            emailTranscript: {
              screen: EMAIL_TRANSCRIPT_LOADING_SCREEN
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
              screen: EMAIL_TRANSCRIPT_SUCCESS_SCREEN
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

    describe('when next props emailTranscript screen is EMAIL_TRANSCRIPT_SCREEN', () => {
      beforeEach(() => {
        emailTranscript = {
          screen: EMAIL_TRANSCRIPT_SCREEN,
          email: 'yolo@yolo.com'
        };
        component = domRender(<Chat emailTranscript={emailTranscript} chats={[]} events={[]} />);
      });

      describe('when next props is different from previous props', () => {
        beforeEach(() => {
          nextProps = {
            emailTranscript: {
              screen: EMAIL_TRANSCRIPT_SCREEN
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
              screen: EMAIL_TRANSCRIPT_SCREEN
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

  describe('renderPostchatScreen', () => {
    let component;

    describe('when state.screen is not `feedback`', () => {
      beforeEach(() => {
        component = instanceRender(
          <Chat
            screen={chattingScreen}
          />
        );
      });

      it('does not return anything', () => {
        expect(component.renderPostchatScreen())
          .toBeFalsy();
      });
    });

    describe('when state.screen is `feedback`', () => {
      const defaultRating = {
        value: 'default_rating',
        comment: null
      };

      beforeEach(() => {
        component = domRender(
          <Chat
            screen={feedbackScreen}
            rating={defaultRating}
            updateChatScreen={updateChatScreenSpy}
            endChat={endChatSpy}
            sendChatRating={sendChatRatingSpy}
            sendChatComment={sendChatCommentSpy}
          />
        );
      });

      afterEach(() => {
        updateChatScreenSpy.calls.reset();
        endChatSpy.calls.reset();
        sendChatRatingSpy.calls.reset();
        sendChatCommentSpy.calls.reset();
      });

      it('returns a component', () => {
        expect(component.renderPostchatScreen())
          .toBeTruthy();
      });

      it('returns a component with the ChatFeedbackForm component as the first child', () => {
        const firstChild = component.renderPostchatScreen().props.children;

        expect(TestUtils.isElementOfType(firstChild, ChatFeedbackForm)).toEqual(true);
      });

      describe('the sendClickFn passed as a prop to the ChatFeedbackForm', () => {
        let chatFeedbackFormComponent, sendClickFn;

        beforeEach(() => {
          chatFeedbackFormComponent = component.renderPostchatScreen().props.children;
          sendClickFn = chatFeedbackFormComponent.props.sendClickFn;
        });

        it('sends the chat rating if it has changed', () => {
          const newRating = { value: 'updated_rating'};

          sendClickFn(newRating);
          expect(sendChatRatingSpy).toHaveBeenCalledWith(newRating);
        });

        it('does not send the chat rating if it is the same', () => {
          sendClickFn(defaultRating.value);
          expect(sendChatRatingSpy).not.toHaveBeenCalled();
        });

        it('sends the comment if one is submitted', () => {
          const chatReviewComment = 'you are nice';

          sendClickFn(defaultRating.value, chatReviewComment);
          expect(sendChatCommentSpy).toHaveBeenCalledWith(chatReviewComment);
        });

        it('does not send the comment if it is not specified', () => {
          sendClickFn(defaultRating.value, null);
          expect(sendChatCommentSpy).not.toHaveBeenCalled();
        });

        it('redirects to the chatting screen', () => {
          sendClickFn(defaultRating.value);
          expect(updateChatScreenSpy).toHaveBeenCalledWith(chattingScreen);
        });

        describe('when the components state has endChatFromFeedbackForm set to true', () => {
          beforeEach(() => {
            component.setState({ endChatFromFeedbackForm: true });
            sendClickFn = sendClickFn.bind(component);
          });

          it('ends the chat', () => {
            sendClickFn(defaultRating.value);
            expect(endChatSpy).toHaveBeenCalled();
          });
        });

        describe('when the components state has endChatFromFeedbackForm set to false', () => {
          beforeEach(() => {
            component.setState({ endChatFromFeedbackForm: false });
            sendClickFn = sendClickFn.bind(component);
          });

          it('does not end the chat', () => {
            sendClickFn(defaultRating.value);
            expect(endChatSpy).not.toHaveBeenCalled();
          });
        });
      });

      describe('the skipClickFn passed as a prop to the ChatFeedbackForm', () => {
        let chatFeedbackFormComponent, skipClickFn;

        beforeEach(() => {
          chatFeedbackFormComponent = component.renderPostchatScreen().props.children;
          skipClickFn = chatFeedbackFormComponent.props.skipClickFn;
        });

        it('redirects to the chatting screen', () => {
          skipClickFn();
          expect(updateChatScreenSpy).toHaveBeenCalledWith(chattingScreen);
        });

        describe('when the components state has endChatFromFeedbackForm set to true', () => {
          beforeEach(() => {
            component.setState({ endChatFromFeedbackForm: true });
            skipClickFn = skipClickFn.bind(component);
          });

          it('ends the chat', () => {
            skipClickFn();
            expect(endChatSpy).toHaveBeenCalled();
          });
        });

        describe('when the components state has endChatFromFeedbackForm set to false', () => {
          beforeEach(() => {
            component.setState({ endChatFromFeedbackForm: false });
            skipClickFn = skipClickFn.bind(component);
          });

          it('does not end the chat', () => {
            skipClickFn();
            expect(endChatSpy).not.toHaveBeenCalled();
          });
        });
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

    describe('when state.lastAgentLeaveEvent contains an event', () => {
      const leaveEvent = {nick: 'agent:123', type: 'chat.memberleave'};

      beforeEach(() => {
        component = domRender(
          <Chat
            screen={chattingScreen}
            lastAgentLeaveEvent={leaveEvent} />
        );
      });

      it("passes the event to the chatLog component's `lastAgentLeaveEvent` prop", () => {
        const scrollContainer = component.renderChatScreen().props.children;
        const chatLog = scrollContainer.props.children[0];
        const lastAgentLeaveEvent = chatLog.props.lastAgentLeaveEvent;

        expect(lastAgentLeaveEvent)
          .toEqual(leaveEvent);
      });
    });

    describe('when state.lastAgentLeaveEvent does not contain an event', () => {
      const leaveEvent = null;

      beforeEach(() => {
        component = domRender(
          <Chat
            screen={chattingScreen}
            lastAgentLeaveEvent={leaveEvent} />
        );
      });

      it("passes null to the chatLog component's `lastAgentLeaveEvent` prop", () => {
        const scrollContainer = component.renderChatScreen().props.children;
        const chatLog = scrollContainer.props.children[0];
        const lastAgentLeaveEvent = chatLog.props.lastAgentLeaveEvent;

        expect(lastAgentLeaveEvent)
          .toEqual(null);
      });
    });
  });

  describe('renderChatScreen', () => {
    let component;

    describe('for non mobile devices', () => {
      beforeEach(() => {
        component = domRender(<Chat screen={chattingScreen} />);
      });

      it('does not add classes to scrollContainer', () => {
        expect(component.renderChatScreen().props.containerClasses)
          .toBe('');
      });

      it('has messages classes', () => {
        expect(component.renderChatScreen().props.children.props.className)
          .toBe('messagesClasses');
      });
    });

    describe('for mobile devices', () => {
      beforeEach(() => {
        component = domRender(<Chat isMobile={true} screen={chattingScreen} />);
      });

      it('adds mobile container classes to scrollContainer', () => {
        expect(component.renderChatScreen().props.containerClasses)
          .toContain('scrollContainerMobileClasses');
      });

      it('has messagesMobile classes', () => {
        expect(component.renderChatScreen().props.children.props.className)
          .toBe('messagesMobileClasses');
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

      it('passes true to its popup components show prop', () => {
        expect(component.renderChatEmailTranscriptPopup().props.show)
          .toBe(true);
      });
    });

    describe('when the popup should not be shown', () => {
      beforeEach(() => {
        component = domRender(<Chat />);
      });

      it('passes false to its popup components show prop', () => {
        expect(component.renderChatEmailTranscriptPopup().props.show)
          .toBe(false);
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
