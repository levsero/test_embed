describe('ChatLog component', () => {
  let ChatLog,
    mockChats;
  const chatLogPath = buildSrcPath('component/chat/ChatLog');

  beforeEach(() => {
    mockery.enable();

    mockChats = new Map();
    mockChats.set(0, { nick: 'visitor', type: 'chat.msg' });

    initMockRegistry({
      './ChatLog.scss': {
        locals: {}
      },
      'component/chat/ChatGroup': {
        ChatGroup: class extends Component {
          constructor() {
            super();
            this.previousUser = null;
            this.groupCount = 0;
          }

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
      chatLog;

    describe('when chats contain no messages', () => {
      beforeEach(() => {
        component = instanceRender(<ChatLog chats={new Map()} />);
        chatLog = component.render();
      });

      it('should not render any children', () => {
        expect(chatLog.props.children.length)
          .toEqual(0);
      });
    });

    describe('when chats contain at least a single message', () => {
      beforeEach(() => {
        component = instanceRender(<ChatLog chats={mockChats} />);
        chatLog = component.render();
      });

      it('should render a ChatGroup as children', () => {
        expect(chatLog.props.children.length)
          .toBeGreaterThan(0);
      });
    });
  });

  describe('renderChatGroup', () => {
    let component,
      mockChat,
      chatGroup;
    const agents = { 'agent:1234': { avatar_path: 'www.fakeSite.com/bob.jpg' } }; // eslint-disable-line camelcase

    describe('when the messages are from an agent', () => {
      beforeEach(() => {
        mockChat = { nick: 'agent:1234' };
        component = instanceRender(<ChatLog agents={agents} chats={new Map()} />);
        chatGroup = component.renderChatGroup([mockChat], 0);
      });

      it('passes isAgent as true', () => {
        expect(chatGroup.props.isAgent)
          .toEqual(true);
      });

      it(`passes the agent's avatarPath`, () => {
        expect(chatGroup.props.avatarPath)
          .toEqual(agents[mockChat.nick].avatar_path);
      });
    });

    describe('when the messages are from a visitor', () => {
      beforeEach(() => {
        mockChat = { nick: 'visitor' };
        component = instanceRender(<ChatLog agents={agents} chats={new Map()} />);
        chatGroup = component.renderChatGroup([mockChat], 0);
      });

      it('passes isAgent as false', () => {
        expect(chatGroup.props.isAgent)
          .toEqual(false);
      });

      it(`does not pass the avatarPath`, () => {
        expect(chatGroup.props.avatarPath)
          .toEqual('');
      });
    });
  });

  describe('processChatGroup', () => {
    let component,
      oldPreviousUser,
      oldGroupCount,
      userData;

    describe('when the message is from a different user than the last', () => {
      beforeAll(() => {
        userData = { nick: 'visitor' };
        component = instanceRender(<ChatLog chats={new Map()} />);
        oldPreviousUser = component.previousUser;
        oldGroupCount = component.groupCount;
        component.processChatGroup(userData);
      });

      it('assigns current user as the new previous user', () => {
        expect(component.previousUser)
          .not.toEqual(oldPreviousUser);

        expect(component.previousUser)
          .toEqual(userData.nick);
      });

      it('increments the group counter by 1', () => {
        const expected = oldGroupCount + 1;

        expect(component.groupCount)
          .toEqual(expected);
      });
    });

    describe('when the message is from the same user as the last', () => {
      beforeAll(() => {
        userData = { nick: 'visitor' };
        component = instanceRender(<ChatLog chats={mockChats} />);
        oldPreviousUser = component.previousUser;
        oldGroupCount = component.groupCount;
        component.processChatGroup(userData);
      });

      it('does not reassign the previous user', () => {
        expect(component.previousUser)
          .toEqual(oldPreviousUser);
      });

      it('does not increment the group counter by 1', () => {
        expect(component.groupCount)
          .toEqual(oldGroupCount);
      });
    });
  });
});
