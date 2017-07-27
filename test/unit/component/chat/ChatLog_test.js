describe('ChatLog component', () => {
  let ChatLog;
  const chatLogPath = buildSrcPath('component/chat/ChatLog');

  /* eslint-disable camelcase */
  const createAgentChat = () => ({ display_name: 'weil ecneret', nick: 'agent:2454047' });
  const createAgentChatTwo = () => ({ display_name: 'bob', nick: 'agent:1337' });
  const createVisitorChat = () => ({ display_name: 'Terry', nick: 'visitor' });
  const mockAgents = {
    'agent:2454047': { avatar_path: 'https://www.fakeSite.com/img/weilEcneret.jpg' },
    'agent:1337`': {}
  };
  /* eslint-enable camelcase */

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
        component = instanceRender(
          <ChatLog chats={new Map()} />);
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

  describe('keepFirstName', () => {
    let component;
    const mockChats = new Map();
    const subjects = [
      { data: createAgentChat(), expectation: 'weil ecneret' },
      { data: createAgentChatTwo(), expectation: 'bob' },
      { data: createAgentChat(), expectation: 'weil ecneret' },
      { data: createAgentChat(), expectation: '' },
      { data: createAgentChatTwo(), expectation: 'bob' },
      { data: createAgentChatTwo(), expectation: '' }
    ];

    beforeEach(() => {
      component = instanceRender(
        <ChatLog userColor='#FFFFFF' />
      );
    });

    it('should test at least 1 element in the array', () => {
      expect(subjects.length)
        .toBeGreaterThan(0);
    });

    _.each(subjects, (subject, key) => {
      it(`should set display name to '${subject.expectation}' at index ${key}`, () => {
        mockChats.set(key, subject.data);

        const chatList = component.keepFirstName([...mockChats.values()]);

        expect(chatList[key].display_name)
          .toEqual(subject.expectation);
      });
    });
  });

  describe('applyAvatarFlag', () => {
    let component,
      chatList;
    const processChat = (map, key, data) => {
      map.set(key, data);
      chatList = [...map.values()];
      chatList = component.applyAvatarFlag(chatList);
    };

    beforeEach(() => {
      component = instanceRender(
        <ChatLog
          agents={mockAgents}
          userColor='#FFFFFF' />
      );
    });

    describe('when there is a single message', () => {
      beforeEach(() => {
        const chats = new Map();

        processChat(chats, 0, createAgentChat());
      });

      it('should set showAvatar to true for that message', () => {
        expect(chatList[0].showAvatar)
          .toEqual(true);
      });
    });

    describe('when there are multiple message from the same agent', () => {
      beforeEach(() => {
        const chats = new Map();

        processChat(chats, 0, createAgentChat());
        processChat(chats, 1, createAgentChat());
        processChat(chats, 2, createAgentChat());
      });

      it('should only set showAvatar to true for the last message', () => {
        expect(chatList[0].showAvatar)
          .toEqual(false);

        expect(chatList[1].showAvatar)
          .toEqual(false);

        expect(chatList[2].showAvatar)
          .toEqual(true);
      });
    });

    describe(`when multiple agents are sending messages`, () => {
      beforeEach(() => {
        const chats = new Map();

        processChat(chats, 0, createAgentChat());
        processChat(chats, 1, createAgentChatTwo());
        processChat(chats, 2, createAgentChatTwo());
        processChat(chats, 3, createAgentChat());
        processChat(chats, 5, createAgentChat());
      });

      it('should only set showAvatar to true their last message', () => {
        expect(chatList[0].showAvatar)
          .toEqual(true);

        expect(chatList[1].showAvatar)
          .toEqual(false);

        expect(chatList[2].showAvatar)
          .toEqual(true);

        expect(chatList[3].showAvatar)
          .toEqual(false);

        expect(chatList[4].showAvatar)
          .toEqual(true);
      });
    });
  });

  describe('processChatList', () => {
    let component,
      chatList;
    const processChat = (map, key, data) => {
      map.set(key, data);
      chatList = [...map.values()];
      component.processChatList(chatList);
    };

    beforeEach(() => {
      component = instanceRender(
        <ChatLog
          agents={mockAgents}
          userColor='#FFFFFF' />
      );
      spyOn(component, 'keepFirstName');
      spyOn(component, 'applyAvatarFlag');
    });

    describe('when that last chatMessage is a visitor', () => {
      beforeEach(() => {
        const chats = new Map();

        processChat(chats, 0, createVisitorChat());
      });

      it('should not call keepFirstName', () => {
        expect(component.keepFirstName)
          .not.toHaveBeenCalled();
      });

      it('should not call applyAvatarFlag', () => {
        expect(component.applyAvatarFlag)
          .not.toHaveBeenCalled();
      });
    });

    describe('when there are no messages', () => {
      beforeEach(() => {
        component.processChatList([]);
      });

      it('should not call keepFirstName', () => {
        expect(component.keepFirstName)
          .not.toHaveBeenCalled();
      });

      it('should not call applyAvatarFlag', () => {
        expect(component.applyAvatarFlag)
          .not.toHaveBeenCalled();
      });
    });

    describe('when that last chatMessage is an agent', () => {
      beforeEach(() => {
        const chats = new Map();

        processChat(chats, 0, createAgentChat());
      });

      it('should call keepFirstName', () => {
        expect(component.keepFirstName)
          .toHaveBeenCalled();
      });

      it('should call applyAvatarFlag', () => {
        expect(component.applyAvatarFlag)
          .toHaveBeenCalled();
      });
    });
  });
});
