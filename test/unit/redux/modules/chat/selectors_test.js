describe('chat selectors', () => {
  let getChatNotification,
    getPrechatFormFields,
    getPostchatFormSettings,
    getIsChatting,
    getChatVisitor,
    getUserSoundSettings,
    getConnection,
    getChatsByAgent,
    getChatStatus;

  beforeEach(() => {
    mockery.enable();

    const chatSelectorsPath = buildSrcPath('redux/modules/chat/selectors');

    mockery.registerAllowable(chatSelectorsPath);

    const selectors = requireUncached(chatSelectorsPath);

    getChatNotification = selectors.getChatNotification;
    getPrechatFormFields = selectors.getPrechatFormFields;
    getPostchatFormSettings = selectors.getPostchatFormSettings;
    getIsChatting = selectors.getIsChatting;
    getChatVisitor = selectors.getChatVisitor;
    getUserSoundSettings = selectors.getUserSoundSettings;
    getConnection = selectors.getConnection;
    getChatsByAgent = selectors.getChatsByAgent;
    getChatStatus = selectors.getChatStatus;
  });

  describe('getChatNotification', () => {
    let result,
      mockAgents,
      mockChats;
    const mockNotification = {
      nick: 'agent:007',
      display_name: 'bond',
      msg: 'how are you',
      show: true,
      playSound: true
    };

    describe('returns an object', () => {
      beforeEach(() => {
        mockAgents = { 'agent:007': { avatar_path: '/path/' } };
        mockChats = [{ nick: 'agent:007', type: 'chat.msg', msg: 'how are you' }];

        result = getChatNotification({
          chat: {
            notification: mockNotification,
            agents: mockAgents,
            chats: { values: () => mockChats }
          }
        });
      });

      it('with the reduced notification object', () => {
        expect(result)
          .toEqual(jasmine.objectContaining({
            nick: 'agent:007',
            display_name: 'bond',
            msg: 'how are you',
            show: true,
            playSound: true
          }));
      });

      it('with the agent properties', () => {
        expect(result)
          .toEqual(jasmine.objectContaining({
            nick: 'agent:007',
            display_name: 'bond',
            msg: 'how are you',
            avatar_path: '/path/'
          }));
      });
    });

    describe('when the first message is received from an agent', () => {
      beforeEach(() => {
        mockAgents = { 'agent:007': { avatar_path: '/path/' } };
        mockChats = [{ nick: 'agent:007', type: 'chat.msg', msg: 'how are you' }];

        result = getChatNotification({
          chat: {
            notification: mockNotification,
            agents: mockAgents,
            chats: { values: () => mockChats }
          }
        });
      });

      it('returns an object with proactive true', () => {
        expect(result.proactive)
          .toBe(true);
      });
    });

    describe('when more messages are received from the same agent', () => {
      beforeEach(() => {
        mockAgents = { 'agent:007': { avatar_path: '/path/' } };
        mockChats = [
          { nick: 'agent:007', type: 'chat.msg', msg: 'hi' },
          { nick: 'agent:007', type: 'chat.msg', msg: 'how are you' }
        ];

        result = getChatNotification({
          chat: {
            notification: mockNotification,
            agents: mockAgents,
            chats: { values: () => mockChats }
          }
        });
      });

      it('returns an object with proactive false', () => {
        expect(result.proactive)
          .toBe(false);
      });
    });

    describe('when more messages are received from a different agent', () => {
      beforeEach(() => {
        mockAgents = { 'agent:007': { avatar_path: '/path/' } };
        mockChats = [
          { nick: 'agent:other-agent', type: 'chat.msg', msg: 'other agent message' },
          { nick: 'agent:007', type: 'chat.msg', msg: 'how are you' }
        ];

        result = getChatNotification({
          chat: {
            notification: mockNotification,
            agents: mockAgents,
            chats: { values: () => mockChats }
          }
        });
      });

      it('returns an object with proactive true', () => {
        expect(result.proactive)
          .toBe(true);
      });
    });
  });

  describe('getPrechatFormFields', () => {
    let result;
    const mockAccountSettings = {
      prechatForm: {
        form: {
          0: { name: 'name', required: true },
          1: { name: 'email', required: true },
          2: { name: 'phone', label: 'Phone Number', required: false }
        }
      }
    };
    const expectedResult = {
      name: { name: 'name', required: true },
      email: { name: 'email', required: true },
      phone: { name: 'phone', label: 'Phone Number', required: false }
    };

    beforeEach(() => {
      result = getPrechatFormFields({
        chat: {
          accountSettings: mockAccountSettings
        }
      });
    });

    it('returns prechat fields grouped by their name', () => {
      expect(result)
        .toEqual(expectedResult);
    });
  });

  describe('getIsChatting', () => {
    let result;
    const mockChatSettings = {
      chat: {
        is_chatting: true
      }
    };

    beforeEach(() => {
      result = getIsChatting(mockChatSettings);
    });

    it('returns the current state of is_chatting', () => {
      expect(result)
        .toEqual(true);
    });
  });

  describe('getChatVisitor', () => {
    let result;
    const visitor = 'Batman';
    const mockChatSettings = {
      chat: {
        visitor
      }
    };

    beforeEach(() => {
      result = getChatVisitor(mockChatSettings);
    });

    it('returns the current state of chat.visitor', () => {
      expect(result)
        .toEqual(visitor);
    });
  });

  describe('getPostchatFormSettings', () => {
    let result;
    const mockHeader = 'Nice chatting with you!';
    const mockMessage = 'How would you rate the chat experience you just had?';
    const mockAccountSettings = {
      postchatForm: {
        header: mockHeader,
        message: mockMessage
      }
    };

    beforeEach(() => {
      result = getPostchatFormSettings({
        chat: { accountSettings: mockAccountSettings }
      });
    });

    it('returns the current state of header', () => {
      expect(result.header)
        .toEqual(mockHeader);
    });

    it('returns the current state of message', () => {
      expect(result.message)
        .toEqual(mockMessage);
    });
  });

  describe('getConnection', () => {
    let result;
    const mockChatSettings = {
      chat: {
        connection: 'connected'
      }
    };

    beforeEach(() => {
      result = getConnection(mockChatSettings);
    });

    it('returns the current state of is_chatting', () => {
      expect(result)
        .toEqual('connected');
    });
  });

  describe('getChatStatus', () => {
    let result;
    const mockChatSettings = {
      chat: {
        account_status: 'online'
      }
    };

    beforeEach(() => {
      result = getChatStatus(mockChatSettings);
    });

    it('returns the current state of account_status', () => {
      expect(result)
        .toEqual('online');
    });
  });

  describe('getUserSoundSettings', () => {
    let result;
    const mockChatSettings = {
      chat: {
        userSettings: { sound: true }
      }
    };

    beforeEach(() => {
      result = getUserSoundSettings(mockChatSettings);
    });

    it('returns the current state of is_chatting', () => {
      expect(result)
        .toEqual(true);
    });
  });

  describe('getChatsByAgent', () => {
    let result;
    const mockChats = [
      { nick: 'agent', type: 'chat.msg' },
      { nick: 'user', type: 'chat.msg' }
    ];
    const mockChatSettings = {
      chat: {
        chats: { values: () => mockChats }
      }
    };

    beforeEach(() => {
      result = getChatsByAgent(mockChatSettings);
    });

    it('returns the chats from only agents', () => {
      expect(result.length)
        .toEqual(1);

      expect(result[0].nick)
        .toEqual('agent');
    });
  });
});
