describe('chat history selectors', () => {
  let getHasMoreHistory,
    getHistoryRequestStatus,
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
});
