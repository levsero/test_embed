const Map = require(buildSrcPath('vendor/es6-map.js')).Map;

fdescribe('Chat component', () => {
  let Chat, chats, chatProp;

  const chatPath = buildSrcPath('component/chat/Chat');

  beforeEach(() => {
    resetDOM();
    mockery.enable();

    chats = new Map();
    chatProp = { chats: chats };

    initMockRegistry({
      './Chat.sass': {
        locals: {
          scrollContainer: 'scrollContainerClasses',
          scrollContainerMobile: 'scrollContainerMobileClasses'
        }
      },
      'component/chat/ChatBox': {
        ChatBox: noopReactComponent()
      },
      'component/chat/ChatHeader': {
        ChatHeader: noopReactComponent()
      },
      'component/chat/ChatMessage': {
        ChatMessage: noopReactComponent()
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
      'component/container/ScrollContainer': {
        ScrollContainer: scrollContainerComponent()
      },
      'src/redux/modules/chat': {
        sendMsg: noop,
        updateCurrentMsg: noop,
        setVisitorInfo: noop
      },
      'service/i18n': {
        i18n: { t: noop }
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
        <Chat setVisitorInfo={setVisitorInfoSpy} sendMsg={sendMsgSpy} chat={chatProp} />
      );

      spyOn(component, 'updateScreen');

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

    it('calls updateScreen with `chatting`', () => {
      expect(component.updateScreen)
        .toHaveBeenCalledWith('chatting');
    });
  });

  describe('renderPrechatScreen', () => {
    let component;

    beforeEach(() => {
      component = domRender(<Chat chat={chatProp} />);
    });

    describe('when state.screen is not `prechat`', () => {
      beforeEach(() => {
        component.setState({ screen: 'notPrechat' });
      });

      it('does not return anything', () => {
        expect(component.renderPrechatScreen())
          .toBeFalsy();
      });
    });

    describe('when state.screen is `prechat`', () => {
      beforeEach(() => {
        component.setState({ screen: 'prechat' });
      });

      it('returns a component', () => {
        expect(component.renderPrechatScreen())
          .toBeTruthy();
      });
    });
  });

  describe('renderChatScreen', () => {
    let component;

    beforeEach(() => {
      component = domRender(<Chat chat={chatProp} />);
    });

    describe('when state.screen is not `chatting`', () => {
      beforeEach(() => {
        component.setState({ screen: 'notChatting' });
      });

      it('does not return anything', () => {
        expect(component.renderChatScreen())
          .toBeFalsy();
      });
    });

    describe('when state.screen is `chatting`', () => {
      beforeEach(() => {
        component.setState({ screen: 'chatting' });
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
          component = domRender(<Chat chat={chatProp} />);
          component.setState({ screen: 'chatting' });
        });

        it('adds container classes to it', () => {
          expect(component.renderChatScreen().props.containerClasses)
            .toContain('scrollContainerClasses');
        });

        it('does not add mobile container classes to it', () => {
          expect(component.renderChatScreen().props.containerClasses)
            .not.toContain('scrollContainerMobileClasses');
        });
      });

      describe('for mobile devices', () => {
        beforeEach(() => {
          component = domRender(<Chat chat={chatProp} isMobile={true} />);
          component.setState({ screen: 'chatting' });
        });

        it('adds mobile container classes to it', () => {
          expect(component.renderChatScreen().props.containerClasses)
            .toContain('scrollContainerMobileClasses');
        });

        it('does not add container classes to it', () => {
          expect(component.renderChatScreen().props.containerClasses)
            .not.toContain('scrollContainerClasses');
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
  });
});

