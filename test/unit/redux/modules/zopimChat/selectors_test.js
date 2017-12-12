describe('zopimChat selectors', () => {
  let getZopimChatStatus;

  beforeEach(() => {
    mockery.enable();

    const selectorsPath = buildSrcPath('redux/modules/zopimChat/selectors');

    mockery.registerAllowable(selectorsPath);

    const selectors = requireUncached(selectorsPath);

    getZopimChatStatus = selectors.getZopimChatStatus;
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
});
