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

      it('should render ChatMessages as children', () => {
        expect(chatLog.props.children.length)
          .toBeGreaterThan(0);
      });
    });
  });

  describe('renderChatGroup', () => {
    let component,
      agents,
      mockChat,
      result;

    beforeEach(() => {
      agents = { 'agent:1234': { avatar_path: 'www.fakeSite.com/bob.jpg' } }; // eslint-disable-line camelcase
    });

    describe('when chat group is of agent type', () => {
      beforeEach(() => {
        mockChat = { nick: 'agent:1234' };
        component = instanceRender(<ChatLog agents={agents} chats={new Map()} />);
        result = component.renderChatGroup([mockChat], 0);
      });

      it('passes isAgent as true', () => {
        expect(result.props.isAgent)
          .toEqual(true);
      });

      it(`passes the agent's avatarPath`, () => {
        expect(result.props.avatarPath)
          .toEqual(agents[mockChat.nick].avatar_path);
      });
    });

    describe('when chat group is of visitor type', () => {
      beforeEach(() => {
        mockChat = { nick: 'visitor' };
        component = instanceRender(<ChatLog agents={agents} chats={new Map()} />);
        result = component.renderChatGroup([mockChat], 0);
      });

      it('passes isAgent as false', () => {
        expect(result.props.isAgent)
          .toEqual(false);
      });

      it(`does not pass the avatarPath`, () => {
        expect(result.props.avatarPath)
          .toEqual('');
      });
    });
  });

  describe('processChatGroup', () => {
    let component,
      previousUser,
      groupCount,
      userData;

    describe('when current user is not the previous user', () => {
      beforeAll(() => {
        userData = { nick: 'visitor' };
        component = instanceRender(<ChatLog chats={new Map()} />);
        previousUser = component.previousUser;
        groupCount = component.groupCount;
        component.processChatGroup(userData);
      });

      it('assigns current user as the new previous user', () => {
        expect(component.previousUser)
          .not.toEqual(previousUser);

        expect(component.previousUser)
          .toEqual(userData.nick);
      });

      it('increments the group counter by 1', () => {
        const expected = groupCount + 1;

        expect(component.groupCount)
          .toEqual(expected);
      });
    });

    describe('when current user is the previous user', () => {
      beforeAll(() => {
        userData = { nick: 'visitor' };
        component = instanceRender(<ChatLog chats={mockChats} />);
        previousUser = component.previousUser;
        groupCount = component.groupCount;
        component.processChatGroup(userData);
      });

      it('does not reassign the previous user', () => {
        expect(component.previousUser)
          .toEqual(previousUser);
      });

      it('does not increment the group counter by 1', () => {
        expect(component.groupCount)
          .toEqual(groupCount);
      });
    });
  });
});
