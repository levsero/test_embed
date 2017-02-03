import SortedMap from 'collections/sorted-map';

describe('Chat component', () => {
  let Chat;
  const chatPath = buildSrcPath('component/chat/Chat');

  beforeEach(() => {
    resetDOM();
    mockery.enable();

    initMockRegistry({
      './Chat.sass': {
        locals: {}
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
      'component/container/Container': {
        Container: noopReactComponent()
      },
      'component/container/ScrollContainer': {
        ScrollContainer: noopReactComponent()
      },
      'src/redux/modules/chat': {
        sendMsg: noop,
        updateCurrentMsg: noop
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

  describe('renderChatLog', () => {
    let component;

    describe('when there are no messages', () => {
      beforeEach(() => {
        const chats = new SortedMap();
        const chatProp = { chats: chats };

        component = domRender(<Chat chat={chatProp} />);
      });

      it('should not return anything', () => {
        expect(component.renderChatLog())
          .toBeFalsy();
      });
    });

    describe('when there are messages', () => {
      beforeEach(() => {
        const chats = new SortedMap();

        chats.add({ timestamp: 123, type: 'chat.msg' }, 123);
        chats.add({ timestamp: 124, type: 'chat.msg' }, 124);

        const chatProp = { chats: chats };

        component = domRender(<Chat chat={chatProp} />);
      });

      it('should return the chat messages', () => {
        expect(component.renderChatLog().length)
          .toBe(2);
      });
    });
  });

  describe('renderChatEnded', () => {
    let component, chatProp;

    beforeEach(() => {
      const chats = new SortedMap();

      chatProp = { chats };
    });

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
        chatProp.chats.add({ timestamp: 123, type: 'chat.msg' }, 123);
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
        chatProp.chats.add({ timestamp: 123, type: 'chat.msg' }, 123);
        chatProp.is_chatting = false; // eslint-disable-line camelcase

        component = domRender(<Chat chat={chatProp} />);
      });

      it('should display chat end message', () => {
        expect(component.renderChatEnded())
          .not.toBeUndefined();
      });
    });
  });
});

