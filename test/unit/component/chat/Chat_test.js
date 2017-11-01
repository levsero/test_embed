const Map = require('core-js/library/es6/map');

let updateChatScreenSpy;
const prechatScreen = 'widget/chat/PRECHAT_SCREEN';
const chattingScreen = 'widget/chat/CHATTING_SCREEN';

describe('Chat component', () => {
  let Chat, chats, chatProp, prechatFormSettingsProp;

  const chatPath = buildSrcPath('component/chat/Chat');

  updateChatScreenSpy = jasmine.createSpy('updateChatScreen');

  beforeEach(() => {
    resetDOM();
    mockery.enable();

    chats = new Map();
    prechatFormSettingsProp = { form: {}, required: false };
    chatProp = { chats: chats };

    initMockRegistry({
      './Chat.sass': {
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
      'src/redux/modules/chat': {
        sendMsg: noop,
        updateCurrentMsg: noop,
        setVisitorInfo: noop,
        updateChatScreen: updateChatScreenSpy
      },
      'src/redux/modules/chat/selectors': {
        getPrechatFormFields: noop
      },
      'src/redux/modules/chat/reducer/chat-screen-types': {
        PRECHAT_SCREEN: prechatScreen,
        CHATTING_SCREEN: chattingScreen
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
          chat={chatProp}
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
            chat={chatProp}
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
            chat={chatProp}
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

    describe('render', () => {
      beforeEach(() => {
        const component = domRender(<Chat chat={chatProp} screen={chattingScreen} />);

        componentNode = ReactDOM.findDOMNode(component);
      });

      it('renders the chat screen with footer styles', () => {
        expect(componentNode.querySelector('.footerClasses'))
          .toBeTruthy();
      });
    });

    describe('when state.screen is not `chatting`', () => {
      beforeEach(() => {
        component = domRender(
          <Chat
            chat={chatProp}
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
            chat={chatProp}
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

  describe('renderChatEnded', () => {
    let component;

    describe('when there are no messages', () => {
      beforeEach(() => {
        component = domRender(<Chat chat={chatProp} />);
      });

      it('does not display', () => {
        expect(component.renderChatEnded())
          .toBeUndefined();
      });
    });

    describe('when is_chatting is true', () => {
      beforeEach(() => {
        chatProp.chats.set(123, { timestamp: 123, type: 'chat.msg' });
        chatProp.is_chatting = true;

        component = domRender(<Chat chat={chatProp} />);
      });

      it('displays chat end message', () => {
        expect(component.renderChatEnded())
          .toBeUndefined();
      });
    });

    describe('when is_chatting is false', () => {
      beforeEach(() => {
        chatProp.chats.set(123, { timestamp: 123, type: 'chat.msg' });
        chatProp.is_chatting = false;

        component = domRender(<Chat chat={chatProp} />);
      });

      it('displays chat end message', () => {
        expect(component.renderChatEnded())
          .not.toBeUndefined();
      });
    });

    describe('renderChatScreen', () => {
      let component;

      describe('for non mobile devices', () => {
        beforeEach(() => {
          component = domRender(<Chat chat={chatProp} screen={chattingScreen} />);
        });

        it('does not add classes to it', () => {
          expect(component.renderChatScreen().props.containerClasses)
            .toBe('');
        });
      });

      describe('for mobile devices', () => {
        beforeEach(() => {
          component = domRender(<Chat chat={chatProp} isMobile={true} screen={chattingScreen} />);
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
          component = domRender(<Chat chat={chatProp} />);
          component.setState({ showMenu: false });
        });

        it('does not return anything', () => {
          expect(component.renderChatMenu())
            .toBeFalsy();
        });
      });

      describe('when state.showMenu is true', () => {
        beforeEach(() => {
          component = domRender(<Chat chat={chatProp} />);
          component.setState({ showMenu: true });
        });

        it('returns the chat menu', () => {
          expect(component.renderChatMenu())
            .not.toBeFalsy();
        });
      });
    });

    describe('renderChatEndPopup', () => {
      let component;

      describe('when the notification should be shown', () => {
        beforeEach(() => {
          component = domRender(
            <Chat chat={{ rating: null }} showEndNotification={true} />
          );
        });

        it('shows the chat end notification component', () => {
          expect(component.renderChatEndPopup())
            .not.toBeNull();
        });
      });

      describe('when the notification should not be shown', () => {
        beforeEach(() => {
          component = domRender(<Chat chat={{ rating: null }} />);
        });

        it('does not show the chat end notification component', () => {
          expect(component.renderChatEndPopup())
            .toBeNull();
        });
      });
    });

    describe('renderChatContactDetailsPopup', () => {
      let component;

      describe('when the popup should be shown', () => {
        beforeEach(() => {
          component = domRender(
            <Chat chat={{ rating: null }} showContactDetailsNotification={true} />
          );
        });

        it('shows the chat contact details popup component', () => {
          expect(component.renderChatContactDetailsPopup())
            .not.toBeNull();
        });
      });

      describe('when the popup should not be shown', () => {
        beforeEach(() => {
          component = domRender(<Chat chat={{ rating: null }} />);
        });

        it('does not show the chat contact details popup component', () => {
          expect(component.renderChatContactDetailsPopup())
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
  });
});

