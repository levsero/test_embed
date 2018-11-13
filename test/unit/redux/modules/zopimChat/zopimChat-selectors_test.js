describe('zopimChat selectors', () => {
  let getZopimChatStatus,
    getZopimChatConnected,
    getZopimIsChatting,
    getZopimChatOpen;

  beforeEach(() => {
    mockery.enable();

    const selectorsPath = buildSrcPath('redux/modules/zopimChat/zopimChat-selectors');

    mockery.registerAllowable(selectorsPath);

    const selectors = requireUncached(selectorsPath);

    getZopimChatStatus = selectors.getZopimChatStatus;
    getZopimChatConnected = selectors.getZopimChatConnected;
    getZopimIsChatting = selectors.getZopimIsChatting;
    getZopimChatOpen = selectors.getZopimChatOpen;
  });

  describe('getZopimChatStatus', () => {
    let result;
    const mockState = {
      zopimChat: {
        status: 'online'
      }
    };

    beforeEach(() => {
      result = getZopimChatStatus(mockState);
    });

    it('returns the current state of zopimChat.status', () => {
      expect(result)
        .toEqual('online');
    });
  });

  describe('getZopimChatConnected', () => {
    let result;
    const mockState = {
      zopimChat: {
        connected: true
      }
    };

    beforeEach(() => {
      result = getZopimChatConnected(mockState);
    });

    it('returns the current state of zopimChat.connected', () => {
      expect(result)
        .toEqual(true);
    });
  });

  describe('getZopimIsChatting', () => {
    let result;
    const mockState = {
      zopimChat: {
        isChatting: false
      }
    };

    beforeEach(() => {
      result = getZopimIsChatting(mockState);
    });

    it('returns the current state of zopimChat.isChatting', () => {
      expect(result)
        .toEqual(false);
    });
  });

  describe('getZopimChatOpen', () => {
    let result;
    const mockState = {
      zopimChat: {
        isOpen: true
      }
    };

    beforeEach(() => {
      result = getZopimChatOpen(mockState);
    });

    it('returns the current state of zopimChat.isOpen', () => {
      expect(result)
        .toEqual(true);
    });
  });
});
