const Map = require(buildSrcPath('vendor/es6-map.js')).Map;

describe('Chat component', () => {
  let Chat, mockIsMobileBrowserValue, chats, chatProp;

  const chatPath = buildSrcPath('component/chat/Chat');

  beforeEach(() => {
    resetDOM();
    mockery.enable();

    mockIsMobileBrowserValue = true;
    chats = new Map();
    chatProp = { chats: chats };

    initMockRegistry({
      './Chat.sass': {
        locals: {
          containerMobile: 'containerMobileClasses'
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
      'component/container/Container': {
        Container: noopReactComponent()
      },
      'component/container/ScrollContainer': {
        ScrollContainer: noopReactComponent()
      },
      'src/redux/modules/chat': {
        sendMsg: noop,
        updateCurrentMsg: noop,
        setVisitorInfo: noop
      },
      'service/i18n': {
        i18n: { t: noop }
      },
      'utility/devices': {
        isMobileBrowser: () => mockIsMobileBrowserValue
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
      display_name: 'Daneries Targarian', // eslint-disable-line camelcase
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

    it('should call setVisitorInfo with the display_name, email and phone', () => {
      const visitorInfo = _.omit(formInfo, ['message']);

      expect(setVisitorInfoSpy)
        .toHaveBeenCalledWith(visitorInfo);
    });

    it('should call sendMsg with the message', () => {
      expect(sendMsgSpy)
        .toHaveBeenCalledWith(formInfo.message);
    });

    it('should call sendMsg with the message', () => {
      expect(component.updateScreen)
        .toHaveBeenCalledWith('chatting');
    });
  });

  describe('renderChatLog', () => {
    let component;

    describe('when there are no messages', () => {
      beforeEach(() => {
        component = domRender(<Chat chat={chatProp} />);
      });

      it('should not return anything', () => {
        expect(component.renderChatLog())
          .toBeFalsy();
      });
    });

    describe('when there are messages', () => {
      beforeEach(() => {
        chats = new Map();

        chats.set(123, { timestamp: 123, type: 'chat.msg' });
        chats.set(124, { timestamp: 124, type: 'chat.msg' });

        chatProp = { chats: chats };

        component = domRender(<Chat chat={chatProp} />);
      });

      it('should return the chat messages', () => {
        expect(component.renderChatLog().length)
          .toBe(2);
      });
    });
  });

  describe('renderChatEnded', () => {
    let component;

    describe('when there are no messages', () => {
      beforeEach(() => {
        component = domRender(<Chat chat={chatProp} />);
      });

      it('should not display', () => {
        expect(component.renderChatEnded())
          .toBeUndefined();
      });
    });

    describe('when is_chatting is true', () => {
      beforeEach(() => {
        chatProp.chats.set(123, { timestamp: 123, type: 'chat.msg' });
        chatProp.is_chatting = true; // eslint-disable-line camelcase

        component = domRender(<Chat chat={chatProp} />);
      });

      it('should not display chat end message', () => {
        expect(component.renderChatEnded())
          .toBeUndefined();
      });
    });

    describe('when is_chatting is false', () => {
      beforeEach(() => {
        chatProp.chats.set(123, { timestamp: 123, type: 'chat.msg' });
        chatProp.is_chatting = false; // eslint-disable-line camelcase

        component = domRender(<Chat chat={chatProp} />);
      });

      it('should display chat end message', () => {
        expect(component.renderChatEnded())
          .not.toBeUndefined();
      });
    });

    describe('Chat styles', () => {
      describe('for mobile devices', () => {
        it('it adds a class specific to it', () => {
          mockIsMobileBrowserValue = true;
          component = domRender(<Chat chat={chatProp} />);

          expect(component.containerClasses())
            .toEqual('containerMobileClasses');
        });
      });

      describe('for desktop devices', () => {
        it('does not add a class specific to it', () => {
          mockIsMobileBrowserValue = false;
          component = domRender(<Chat chat={chatProp} />);

          expect(component.containerClasses())
            .toBeUndefined();
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

        it('should not return anything', () => {
          expect(component.renderChatMenu())
            .toBeFalsy();
        });
      });

      describe('when state.showMenu is true', () => {
        beforeEach(() => {
          component = domRender(<Chat chat={chatProp} />);
          component.setState({ showMenu: true });
        });

        it('should return the chat menu', () => {
          expect(component.renderChatMenu())
            .not.toBeFalsy();
        });
      });
    });
  });
});

