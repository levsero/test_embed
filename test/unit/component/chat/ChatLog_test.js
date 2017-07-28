describe('ChatLog component', () => {
  let ChatLog;
  const chatLogPath = buildSrcPath('component/chat/ChatLog');

  beforeEach(() => {
    resetDOM();
    mockery.enable();

    initMockRegistry({
      './ChatLog.sass': {
        locals: {}
      },
      'component/chat/ChatMessage': {
        ChatMessage: class extends Component {
          render = () => <div />;
        }
      }
    });

    mockery.registerAllowable(chatLogPath);
    ChatLog = requireUncached(chatLogPath).ChatLog;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('render', () => {
    let component;

    describe('when chats contain no messages', () => {
      beforeEach(() => {
        component = instanceRender(<ChatLog />);
      });

      it('should not render anything', () => {
        expect(component.render())
          .toBeNull();
      });
    });

    describe('when chats contain at least a single message', () => {
      beforeEach(() => {
        let mockChats = new Map();

        mockChats.set(0, { nick: 'visitor' });
        component = instanceRender(
          <ChatLog chats={mockChats} />);
      });

      it('should render the component', () => {
        expect(component.render())
          .not.toBeNull();
      });
    });
  });

  describe('renderChatMessage', () => {
    let component,
      chatMessage;

    describe(`when agent's avatar does not exist`, () => {
      beforeEach(() => {
        component = instanceRender(<ChatLog />);
        chatMessage = component.renderChatMessage({}, 0);
      });

      it('should avatarPath should be empty', () => {
        expect(chatMessage.props.avatarPath)
          .toEqual('');
      });
    });

    describe(`when agent's avatar exists`, () => {
      let agentChat,
        agents;

      beforeEach(() => {
        agentChat = { nick: 'TerryWhy?' };
        agents = { [agentChat.nick]: { avatar_path: 'trollolol.jpg' } };

        component = instanceRender(<ChatLog agents={agents} />);
        chatMessage = component.renderChatMessage(agentChat, 0);
      });

      it('should avatarPath should not be empty', () => {
        const expected = agents[agentChat.nick].avatar_path;

        expect(chatMessage.props.avatarPath)
          .toEqual(expected);
      });
    });

    describe(`when the user is an agent`, () => {
      beforeEach(() => {
        component = instanceRender(<ChatLog />);
        chatMessage = component.renderChatMessage({ nick: 'agent:smith' }, 0);
      });

      it('should show the avatar', () => {
        expect(chatMessage.props.showAvatar)
          .toEqual(true);
      });
    });

    describe(`when the user is a visitor`, () => {
      beforeEach(() => {
        component = instanceRender(<ChatLog />);
        chatMessage = component.renderChatMessage({ nick: 'visitor' }, 0);
      });

      it('should not show the avatar', () => {
        expect(chatMessage.props.showAvatar)
          .toEqual(false);
      });
    });
  });
});
