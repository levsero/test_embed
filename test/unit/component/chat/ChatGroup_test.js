describe('ChatGroup component', () => {
  let ChatGroup;
  const chatGroupPath = buildSrcPath('component/chat/ChatGroup');

  beforeEach(() => {
    resetDOM();
    mockery.enable();

    initMockRegistry({
      './ChatGroup.sass': {
        locals: {}
      },
      'component/chat/ChatMessage': {
        ChatMessage: class extends Component {
          render = () => <div />;
        }
      }
    });

    mockery.registerAllowable(chatGroupPath);
    ChatGroup = requireUncached(chatGroupPath).ChatGroup;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('renderChatMessage', () => {
    let component,
      chatMessage;
    const chatData = { display_name: 'bob', avatar_path: 'bobbalicious.jpg' }; // eslint-disable-line camelcase
    const children = [chatData, chatData, chatData];

    describe('when user is agent', () => {
      beforeEach(() => {
        component = instanceRender(
          <ChatGroup
            avatarPath={chatData.avatar_path}
            isAgent={true}
            children={children} />);
      });

      describe('when the message is the first', () => {
        beforeEach(() => {
          chatMessage = component.renderChatMessage(chatData, 0);
        });

        it(`passes the agent's name`, () => {
          expect(chatMessage.props.name)
            .toEqual(chatData.display_name);
        });

        it('passes showAvatar as false', () => {
          expect(chatMessage.props.showAvatar)
            .toEqual(false);
        });

        it('passes an empty avatarPath', () => {
          expect(chatMessage.props.avatarPath)
            .toEqual('');
        });
      });

      describe('when the message is the last', () => {
        beforeEach(() => {
          chatMessage = component.renderChatMessage(chatData, 2);
        });

        it('passes an empty name', () => {
          expect(chatMessage.props.name)
            .toEqual('');
        });

        it('passes showAvatar as true', () => {
          expect(chatMessage.props.showAvatar)
            .toEqual(true);
        });

        it(`passes the agent's avatarPath`, () => {
          expect(chatMessage.props.avatarPath)
            .toEqual(chatData.avatar_path);
        });
      });

      describe('when the message neither first or last', () => {
        beforeEach(() => {
          chatMessage = component.renderChatMessage(chatData, 1);
        });

        it('passes an empty name', () => {
          expect(chatMessage.props.name)
            .toEqual('');
        });

        it('passes showAvatar as false', () => {
          expect(chatMessage.props.showAvatar)
            .toEqual(false);
        });

        it('passes an empty avatarPath', () => {
          expect(chatMessage.props.avatarPath)
            .toEqual('');
        });
      });
    });
  });
});
