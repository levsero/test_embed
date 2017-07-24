fdescribe('ChatLog component', () => {
  let ChatLog,
    mockChats,
    mockAgents;
  const chatLogPath = buildSrcPath('component/chat/ChatLog');

  beforeEach(() => {
    resetDOM();
    mockery.enable();

    mockChats = new Map();
    /* eslint-disable camelcase */
    mockChats.set(0, { display_name: 'Visitor 24382671', nick: 'visitor', type: 'chat.msg' });
    mockChats.set(1, { display_name: 'weil ecneret', nick: 'agent:2454047', type: 'chat.msg' });
    mockChats.set(2, { display_name: 'Visitor 24382671', nick: 'visitor', type: 'chat.msg' });
    mockChats.set(3, { display_name: 'bob', nick: 'agent:1221212', type: 'chat.msg' });
    mockChats.set(4, { display_name: 'Visitor 24382671', nick: 'visitor', type: 'chat.msg' });
    mockChats.set(5, { display_name: 'weil ecneret', nick: 'agent:2454047', type: 'chat.msg' });
    mockChats.set(6, { display_name: 'weil ecneret', nick: 'agent:2454047', type: 'chat.msg' });

    mockAgents = {
      'agent:2454047': { avatar_path: 'https://www.fakeSite.com/img/weilEcneret.jpg' },
      'agent:1221212': {}
    };
    /* eslint-enable camelcase */

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
        component = domRender(
          <ChatLog
            agents={mockAgents}
            chats={new Map()}
            userColor='#FFFFFF' />);
      });

      // it('should not render anything', () => {
      //   expect(component)
      //     .toBeNull();
      // });
    });

    describe('when chats contain at least a single message', () => {
      beforeEach(() => {
        component = domRender(
          <ChatLog
            agents={mockAgents}
            chats={mockChats}
            userColor='#FFFFFF' />);
      });

      it('should render the component', () => {
        expect(component)
          .toBeTruthy();
      });
    });
  });

  it('should contain at least 1 element for mockChats', () => {
    expect(mockChats.size)
      .toBeGreaterThan(0);
  });

  describe('keepFirstName', () => {
    beforeEach(() => {
      instanceRender(
        <ChatLog
          agents={mockAgents}
          chats={mockChats}
          userColor='#FFFFFF' />
      );
    });

    it('should keep the display_name for the first message of agent', () => {
      const expectation = [
        'Visitor 24382671',
        'weil ecneret',
        'Visitor 24382671',
        'bob',
        'Visitor 24382671',
        'weil ecneret',
        ''
      ];

      _.each([...mockChats.values()], (chat, key) => {
        expect(chat.display_name)
          .toEqual(expectation[key]);
      });
    });
  });

  describe('applyAvatarFlag', () => {
    beforeEach(() => {
      instanceRender(
        <ChatLog
          agents={mockAgents}
          chats={mockChats}
          userColor='#FFFFFF' />
      );
    });

    it('should apply a avatar flag to the last group message of an agent', () => {
      const expectation = [
        undefined,
        mockAgents['agent:2454047'].avatarPath,
        undefined,
        undefined,
        undefined,
        undefined,
        mockAgents['agent:2454047'].avatarPath
      ];

      _.each([...mockChats.values()], (chat, key) => {
        expect(chat.avatar_path)
          .toEqual(expectation[key]);
      });
    });
  });
});
