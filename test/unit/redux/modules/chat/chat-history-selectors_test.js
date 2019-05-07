describe('chat history selectors', () => {
  let getHasMoreHistory,
    getHistoryRequestStatus,
    getHistoryLength,
    getHasChatHistory,
    getGroupMessages,
    getEventMessage,
    CHAT_MESSAGE_EVENTS,
    CHAT_SYSTEM_EVENTS;

  beforeEach(() => {
    mockery.enable();

    const chatConstantsPath = basePath('src/constants/chat');

    CHAT_SYSTEM_EVENTS = requireUncached(chatConstantsPath).CHAT_SYSTEM_EVENTS;
    CHAT_MESSAGE_EVENTS = requireUncached(chatConstantsPath).CHAT_MESSAGE_EVENTS;

    initMockRegistry({
      'constants/chat': {
        CHAT_MESSAGE_EVENTS,
        CHAT_SYSTEM_EVENTS
      }
    });

    const chatHistorySelectorsPath = buildSrcPath('redux/modules/chat/chat-history-selectors');

    mockery.registerAllowable(chatHistorySelectorsPath);
    const selectors = requireUncached(chatHistorySelectorsPath);

    getHasMoreHistory = selectors.getHasMoreHistory;
    getHistoryRequestStatus = selectors.getHistoryRequestStatus;
    getHistoryLength = selectors.getHistoryLength;
    getHasChatHistory = selectors.getHasChatHistory;
    getGroupMessages = selectors.getGroupMessages;
    getEventMessage = selectors.getEventMessage;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('getHasMoreHistory', () => {
    let result;

    beforeEach(() => {
      result = getHasMoreHistory({
        chat: {
          chatHistory: {
            hasMore: true
          }
        }
      });
    });

    it('returns the has more state', () => {
      expect(result)
        .toEqual(true);
    });
  });

  describe('getHistoryRequestStatus', () => {
    let result;

    beforeEach(() => {
      result = getHistoryRequestStatus({
        chat: {
          chatHistory: {
            requestStatus: 'pending'
          }
        }
      });
    });

    it('returns the request status state', () => {
      expect(result)
        .toEqual('pending');
    });
  });

  describe('getHistoryLength', () => {
    let result;

    beforeEach(() => {
      const mockState = {
        chat: {
          chatHistory: {
            chats: new Map([
              [1, { nick: 'agent:123', type: 'chat.msg', timestamp: 1 }],
              [3, { nick: 'visitor:2', type: 'chat.msg', timestamp: 3 }],
              [5, { nick: 'agent:123', type: 'chat.msg', timestamp: 5 }],
              [7, { nick: 'agent:123', type: 'chat.msg', timestamp: 7 }]
            ])
          }
        }
      };

      result = getHistoryLength(mockState);
    });

    it('returns the correct size', () => {
      expect(result)
        .toEqual(4);
    });
  });

  describe('getGroupMessages', () => {
    let result;

    beforeEach(() => {
      const mockState = {
        chat: {
          chatHistory: {
            chats: new Map([
              [1, { nick: 'agent:123', type: 'chat.msg', timestamp: 1 }],
              [3, { nick: 'visitor:2', type: 'chat.msg', timestamp: 3 }],
              [5, { nick: 'agent:123', type: 'chat.msg', timestamp: 5 }],
              [7, { nick: 'agent:123', type: 'chat.msg', timestamp: 7 }]
            ])
          }
        }
      };

      result = getGroupMessages(mockState, [5, 7]);
    });

    it('returns the messages in the group', () => {
      expect(result)
        .toEqual([
          { nick: 'agent:123', type: 'chat.msg', timestamp: 5 },
          { nick: 'agent:123', type: 'chat.msg', timestamp: 7 }
        ]);
    });
  });

  describe('getEventMessage', () => {
    let result;

    beforeEach(() => {
      const mockState = {
        chat: {
          chatHistory: {
            chats: new Map([
              [1, { nick: 'agent:123', type: 'chat.msg', timestamp: 1 }],
              [3, { nick: 'visitor:2', type: 'member.join', timestamp: 3 }],
              [5, { nick: 'agent:123', type: 'chat.msg', timestamp: 5 }],
              [7, { nick: 'agent:123', type: 'chat.msg', timestamp: 7 }]
            ])
          }
        }
      };

      result = getEventMessage(mockState, 3);
    });

    it('returns the correct event message', () => {
      expect(result)
        .toEqual({ nick: 'visitor:2', type: 'member.join', timestamp: 3 });
    });
  });

  describe('getHasChatHistory', () => {
    let result;

    const getResult = (entries) => {
      return getHasChatHistory({
        chat: {
          chatHistory: {
            chats: new Map(entries)
          }
        }
      });
    };

    describe('when chat log entries are greater than zero', () => {
      it('returns true', () => {
        result = getResult([{}, {}]);

        expect(result).toEqual(true);
      });
    });

    describe('when chat log entries are zero', () => {
      it('returns false', () => {
        result = getResult([]);

        expect(result).toEqual(false);
      });
    });
    describe('when chat log entries are null', () => {
      it('returns false', () => {
        result = getResult(null);

        expect(result).toEqual(false);
      });
    });
  });
});
