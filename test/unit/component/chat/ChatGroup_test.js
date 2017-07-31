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
      result;
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
          result = component.renderChatMessage(chatData, 0);
        });

        it(`should pass the agent's name`, () => {
          expect(result.props.name)
            .toEqual(chatData.display_name);
        });

        it('should pass showAvatar as false', () => {
          expect(result.props.showAvatar)
            .toEqual(false);
        });

        it('should pass an empty avatarPath', () => {
          expect(result.props.avatarPath)
            .toEqual('');
        });
      });

      describe('when the message is the last', () => {
        beforeEach(() => {
          result = component.renderChatMessage(chatData, 2);
        });
        it('should pass an empty name', () => {
          expect(result.props.name)
            .toEqual('');
        });

        it('should pass showAvatar as true', () => {
          expect(result.props.showAvatar)
            .toEqual(true);
        });

        it(`should pass the agent's avatarPath`, () => {
          expect(result.props.avatarPath)
            .toEqual(chatData.avatar_path);
        });
      });

      describe('when the message neither first or last', () => {
        beforeEach(() => {
          result = component.renderChatMessage(chatData, 1);
        });
        it('should pass an empty name', () => {
          expect(result.props.name)
            .toEqual('');
        });

        it('should pass showAvatar as false', () => {
          expect(result.props.showAvatar)
            .toEqual(false);
        });

        it('should pass an empty avatarPath', () => {
          expect(result.props.avatarPath)
            .toEqual('');
        });
      });
    });
  });
});
