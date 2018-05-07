import Map from 'core-js/library/es6/map';

describe('chat history selectors', () => {
  let getHasMoreHistory,
    getHistoryRequestStatus,
    getGroupedPastChatsBySession,
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
    getGroupedPastChatsBySession = selectors.getGroupedPastChatsBySession;
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

  describe('getGroupedPastChatsBySession', () => {
    let result;

    beforeEach(() => {
      result = getGroupedPastChatsBySession({
        chat: {
          chatHistory: {
            chats: new Map([
              [1, { chat: 'a', timestamp: 1, first: true }],
              [2, { chat: 'b', timestamp: 2 }],
              [3, { chat: 'c', timestamp: 3 }],
              [4, { chat: 'd', timestamp: 4 }],
              [5, { chat: 'e', timestamp: 5, first: true }]
            ])
          }
        }
      });
    });

    it('returns grouped chats by session', () => {
      expect(result.length)
        .toEqual(2);
    });

    it('returns grouped past chats in order', () => {
      expect(_.map(result[0], (val, key) => key))
        .toEqual(['1', '2', '3', '4']);
    });
  });
});
