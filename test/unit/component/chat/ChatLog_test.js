describe('ChatLog component', () => {
  let ChatLog,
    mockChats;
  const chatLogPath = buildSrcPath('component/chat/ChatLog');

  beforeEach(() => {
    resetDOM();
    mockery.enable();

    mockChats = new Map();
    mockChats.set(0, { nick: 'visitor', type: 'chat.msg' });

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
    let component,
      result;

    describe('when chats contain no messages', () => {
      beforeEach(() => {
        component = instanceRender(<ChatLog chats={new Map()} />);
        result = component.render();
      });

      it('should not render any children', () => {
        expect(result.props.children.length)
          .toEqual(0);
      });
    });

    describe('when chats contain at least a single message', () => {
      beforeEach(() => {
        component = instanceRender(<ChatLog chats={mockChats} />);
        result = component.render();
      });

      it('should render ChatMessages as children', () => {
        expect(result.props.children.length)
          .toBeGreaterThan(0);
      });
    });
  });

  describe('renderChatMessage', () => {
    let component,
      chatMessage;

    describe(`when agent's avatar does not exist`, () => {
      beforeEach(() => {
        component = instanceRender(<ChatLog chats={mockChats} />);
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
        agents = { [agentChat.nick]: { avatar_path: 'trollolol.jpg' } }; // eslint-disable-line camelcase

        component = instanceRender(<ChatLog chats={mockChats} agents={agents} />);
        chatMessage = component.renderChatMessage(agentChat, 0);
      });

      it('should not be empty for the avatarPath', () => {
        const expected = agents[agentChat.nick].avatar_path;

        expect(chatMessage.props.avatarPath)
          .toEqual(expected);
      });
    });

    describe(`when the user is an agent`, () => {
      beforeEach(() => {
        component = instanceRender(<ChatLog chats={mockChats} isAgent={true} />);
        chatMessage = component.renderChatMessage({ nick: 'agent:smith' }, 0);
      });

      it('should show the avatar', () => {
        expect(chatMessage.props.showAvatar)
          .toEqual(true);
      });
    });

    describe(`when the user is a visitor`, () => {
      beforeEach(() => {
        component = instanceRender(<ChatLog chats={mockChats} isAgent={false} />);
        chatMessage = component.renderChatMessage({ nick: 'visitor' }, 0);
      });

      it('should not show the avatar', () => {
        expect(chatMessage.props.showAvatar)
          .toEqual(false);
      });
    });
  });
});
