describe('chat selectors', () => {
  let getAgents,
    getAttachmentsEnabled,
    getConciergeSettings,
    getConnection,
    getCurrentMessage,
    getChatEvents,
    getChatMessages,
    getChatMessagesByAgent,
    getChatNotification,
    getChatOnline,
    getChatRating,
    getChatScreen,
    getChatStatus,
    getChatVisitor,
    getGroupedChatLog,
    getIsChatting,
    getNotificationCount,
    getPostchatFormSettings,
    getPrechatFormSettings,
    getPrechatFormFields,
    getRatingSettings,
    getUserSoundSettings;

  beforeEach(() => {
    mockery.enable();

    const chatSelectorsPath = buildSrcPath('redux/modules/chat/chat-selectors');

    mockery.registerAllowable(chatSelectorsPath);

    const selectors = requireUncached(chatSelectorsPath);

    getAgents = selectors.getAgents;
    getAttachmentsEnabled = selectors.getAttachmentsEnabled;
    getConciergeSettings = selectors.getConciergeSettings;
    getConnection = selectors.getConnection;
    getCurrentMessage = selectors.getCurrentMessage;
    getChatEvents = selectors.getChatEvents;
    getChatMessages = selectors.getChatMessages;
    getChatMessagesByAgent = selectors.getChatMessagesByAgent;
    getChatNotification = selectors.getChatNotification;
    getChatOnline = selectors.getChatOnline;
    getChatRating = selectors.getChatRating;
    getChatScreen = selectors.getChatScreen;
    getChatStatus = selectors.getChatStatus;
    getChatVisitor = selectors.getChatVisitor;
    getGroupedChatLog = selectors.getGroupedChatLog;
    getIsChatting = selectors.getIsChatting;
    getNotificationCount = selectors.getNotificationCount;
    getPostchatFormSettings = selectors.getPostchatFormSettings;
    getPrechatFormFields = selectors.getPrechatFormFields;
    getPrechatFormSettings = selectors.getPrechatFormSettings;
    getRatingSettings = selectors.getRatingSettings;
    getUserSoundSettings = selectors.getUserSoundSettings;
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

  describe('getRatingSettings', () => {
    let result;
    const ratingSettings = { enabled: true };
    const mockChatSettings = {
      chat: {
        accountSettings: {
          rating: ratingSettings
        }
      }
    };

    beforeEach(() => {
      result = getRatingSettings(mockChatSettings);
    });

    it('returns the value of accountSettings.rating', () => {
      expect(result)
        .toEqual(ratingSettings);
    });
  });

  describe('getPrechatFormSettings', () => {
    let result;
    const mockChatSettings = {
      chat: {
        accountSettings: {
          prechatForm: 'foo'
        }
      }
    };

    beforeEach(() => {
      result = getPrechatFormSettings(mockChatSettings);
    });

    it('returns the value of accountSettings.prechatForm', () => {
      expect(result)
        .toEqual('foo');
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

    it('returns the current state of connection', () => {
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

  describe('getChatMessagesByAgent', () => {
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
      result = getChatMessagesByAgent(mockChatSettings);
    });

    it('returns the chats from only agents', () => {
      expect(result.length)
        .toEqual(1);

      expect(result[0].nick)
        .toEqual('agent');
    });
  });

  describe('getChatMessages', () => {
    let result;
    const mockChats = [
      { nick: 'visitor', type: 'chat.memberjoined' },
      { nick: 'visitor', type: 'chat.msg' },
      { nick: 'visitor', type: 'chat.file' },
      { nick: 'visitor', type: 'chat.rating' },
      { nick: 'visitor', type: 'chat.memberleave' }
    ];
    const mockChatSettings = {
      chat: {
        chats: { values: () => mockChats }
      }
    };

    beforeEach(() => {
      result = getChatMessages(mockChatSettings);
    });

    it('returns only whitelisted message types chats', () => {
      expect(result.length)
        .toEqual(2);

      expect(result[0].type)
        .toEqual('chat.msg');

      expect(result[1].type)
        .toEqual('chat.file');
    });
  });

  describe('getChatEvents', () => {
    let result;
    const mockChats = [
      { nick: 'visitor', type: 'chat.memberjoin' },
      { nick: 'visitor', type: 'chat.msg' },
      { nick: 'visitor', type: 'chat.file' },
      { nick: 'visitor', type: 'chat.rating' },
      { nick: 'visitor', type: 'chat.memberleave' }
    ];
    const mockChatSettings = {
      chat: {
        chats: { values: () => mockChats }
      }
    };

    beforeEach(() => {
      result = getChatEvents(mockChatSettings);
    });

    it('returns only whitelisted event type chats', () => {
      expect(result.length)
        .toEqual(3);

      expect(result[0].type)
        .toEqual('chat.memberjoin');

      expect(result[1].type)
        .toEqual('chat.rating');

      expect(result[2].type)
        .toEqual('chat.memberleave');
    });
  });

  describe('getGroupedChatLog', () => {
    let result,
      mockChats,
      mockChatSettings,
      expectedResult;

    describe('when passed a chat log containing valid messages and events', () => {
      beforeEach(() => {
        mockChats = [
          { nick: 'visitor', type: 'chat.memberjoin', timestamp: 1 },
          { nick: 'visitor', type: 'chat.msg', msg: 'Hello', timestamp: 2 },
          { nick: 'visitor', type: 'chat.msg', msg: 'Help please', timestamp: 3 },
          { nick: 'agent', type: 'chat.memberjoin', timestamp: 4 },
          { nick: 'agent', type: 'chat.msg', msg: 'Hi', timestamp: 5 },
          { nick: 'agent', type: 'chat.msg', msg: 'How can I help you?', timestamp: 6 },
          { nick: 'visitor', type: 'chat.msg', msg: 'My laptop is broken', timestamp: 7 },
          { nick: 'agent', type: 'chat.msg', msg: 'Try turning it on and off again', timestamp: 8 },
          { nick: 'visitor', type: 'chat.msg', msg: 'That fixed it!', timestamp: 9 },
          { nick: 'visitor', type: 'chat.rating', new_rating: 'good', timestamp: 10 },
          { nick: 'visitor', type: 'chat.memberleave', timestamp: 11 }
        ];

        mockChatSettings = {
          chat: {
            chats: { values: () => mockChats }
          }
        };

        expectedResult = {
          1: [mockChats[0]],
          2: [mockChats[1], mockChats[2]],
          4: [mockChats[3]],
          5: [mockChats[4], mockChats[5]],
          7: [mockChats[6]],
          8: [mockChats[7]],
          9: [mockChats[8]],
          10: [mockChats[9]],
          11: [mockChats[10]]
        };

        result = getGroupedChatLog(mockChatSettings);
      });

      it('returns chats with messages from a single user grouped under the first timestamp, and with events ungrouped', () => {
        expect(result)
          .toEqual(expectedResult);
      });
    });

    describe('when passed a chat log which begins with an event', () => {
      beforeEach(() => {
        mockChats = [
          { nick: 'visitor', type: 'chat.memberjoin', timestamp: 1 },
          { nick: 'visitor', type: 'chat.msg', msg: 'Hello', timestamp: 2 }
        ];

        mockChatSettings = {
          chat: {
            chats: { values: () => mockChats }
          }
        };

        expectedResult = {
          1: [mockChats[0]],
          2: [mockChats[1]]
        };

        result = getGroupedChatLog(mockChatSettings);
      });

      it('parses the chat log successfully', () => {
        expect(result)
          .toEqual(expectedResult);
      });
    });

    describe('when passed a chat log which begins with a message', () => {
      beforeEach(() => {
        mockChats = [
          { nick: 'visitor', type: 'chat.msg', msg: 'Hello', timestamp: 1 },
          { nick: 'visitor', type: 'chat.memberjoin', timestamp: 2 }
        ];

        mockChatSettings = {
          chat: {
            chats: { values: () => mockChats }
          }
        };

        expectedResult = {
          1: [mockChats[0]],
          2: [mockChats[1]]
        };

        result = getGroupedChatLog(mockChatSettings);
      });

      it('parses the chat log successfully', () => {
        expect(result)
          .toEqual(expectedResult);
      });
    });

    describe('when passed a chat log with non-whitelisted events or messages', () => {
      beforeEach(() => {
        mockChats = [
          { nick: 'visitor', type: 'chat.membercartwheeled', timestamp: 1 },
          { nick: 'visitor', type: 'chat.msg', msg: 'Hello', timestamp: 2 },
          { nick: 'visitor', type: 'chat.package', package: 'suspicious.exe', timestamp: 3 },
          { nick: 'agent', type: 'chat.msg', msg: 'Hey', timestamp: 4 }
        ];

        mockChatSettings = {
          chat: {
            chats: { values: () => mockChats }
          }
        };

        expectedResult = {
          2: [mockChats[1]],
          4: [mockChats[3]]
        };

        result = getGroupedChatLog(mockChatSettings);
      });

      it('filters out the invalid chats', () => {
        expect(result)
          .toEqual(expectedResult);
      });
    });
  });

  describe('getChatOnline', () => {
    let result;

    describe('when the agent is online', () => {
      beforeEach(() => {
        const mockState = {
          chat: { account_status: 'online' }
        };

        result = getChatOnline(mockState);
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when the agent is away', () => {
      beforeEach(() => {
        const mockState = {
          chat: { account_status: 'away' }
        };

        result = getChatOnline(mockState);
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when the agent is offline', () => {
      beforeEach(() => {
        const mockState = {
          chat: { account_status: 'offline' }
        };

        result = getChatOnline(mockState);
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });
  });

  describe('getChatRating', () => {
    let result;
    const mockChatSettings = {
      chat: {
        rating: 'good'
      }
    };

    beforeEach(() => {
      result = getChatRating(mockChatSettings);
    });

    it('returns the current state of rating', () => {
      expect(result)
        .toEqual('good');
    });
  });

  describe('getConciergeSettings', () => {
    let result;
    const mockChatSettings = {
      chat: {
        accountSettings: { concierge: 'foo.bar' }
      }
    };

    beforeEach(() => {
      result = getConciergeSettings(mockChatSettings);
    });

    it('returns the current state of accountSettings.concierge', () => {
      expect(result)
        .toEqual('foo.bar');
    });
  });

  describe('getAgents', () => {
    let result;
    const mockChatSettings = {
      chat: {
        agents: 'Link'
      }
    };

    beforeEach(() => {
      result = getAgents(mockChatSettings);
    });

    it('returns the current state of agents', () => {
      expect(result)
        .toEqual('Link');
    });
  });

  describe('getChatScreen', () => {
    let result;
    const mockChatSettings = {
      chat: {
        screen: 'chatting'
      }
    };

    beforeEach(() => {
      result = getChatScreen(mockChatSettings);
    });

    it('returns the current state of screen', () => {
      expect(result)
        .toEqual('chatting');
    });
  });

  describe('getCurrentMessage', () => {
    let result;
    const mockChatSettings = {
      chat: {
        currentMessage: 'printer is on fire'
      }
    };

    beforeEach(() => {
      result = getCurrentMessage(mockChatSettings);
    });

    it('returns the current state of currentMessage', () => {
      expect(result)
        .toEqual('printer is on fire');
    });
  });

  describe('getAttachmentsEnabled', () => {
    let result;
    const mockEnabled = true;
    const mockChatSettings = {
      chat: {
        accountSettings: {
          attachments: {
            enabled: mockEnabled
          }
        }
      }
    };

    beforeEach(() => {
      result = getAttachmentsEnabled(mockChatSettings);
    });

    it('returns the current state of attachmentsEnabled', () => {
      expect(result)
        .toEqual(mockEnabled);
    });
  });

  describe('getNotificationCount', () => {
    let result;
    const mockChatSettings = {
      chat: {
        notification: {
          count: 123
        }
      }
    };

    beforeEach(() => {
      result = getNotificationCount(mockChatSettings);
    });

    it(`returns the current state of the notification's count`, () => {
      expect(result)
        .toEqual(123);
    });
  });
});
