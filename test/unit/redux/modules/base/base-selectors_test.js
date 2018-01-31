describe('base selectors', () => {
  let getZopimChatEmbed,
    getHelpCenterEmbed,
    getTalkEmbed,
    getActiveEmbed,
    getChatEmbed,
    getAuthenticated,
    getEmbedShown;

  beforeEach(() => {
    mockery.enable();

    const selectorsPath = buildSrcPath('redux/modules/base/base-selectors');

    mockery.registerAllowable(selectorsPath);

    const selectors = requireUncached(selectorsPath);

    getZopimChatEmbed = selectors.getZopimChatEmbed;
    getActiveEmbed = selectors.getActiveEmbed;
    getHelpCenterEmbed = selectors.getHelpCenterEmbed;
    getTalkEmbed = selectors.getTalkEmbed;
    getChatEmbed = selectors.getChatEmbed;
    getAuthenticated = selectors.getAuthenticated;
    getEmbedShown = selectors.getEmbedShown;
  });

  describe('getActiveEmbed', () => {
    let result;
    const mockState = {
      base: {
        activeEmbed: 'chat'
      }
    };

    beforeEach(() => {
      result = getActiveEmbed(mockState);
    });

    it('returns the current active embed', () => {
      expect(result)
        .toEqual('chat');
    });
  });

  describe('getZopimChatEmbed', () => {
    let result;
    const mockState = {
      base: {
        embeds: {
          zopimChat: true
        }
      }
    };

    beforeEach(() => {
      result = getZopimChatEmbed(mockState);
    });

    it('returns the current state of embed.zopimChat', () => {
      expect(result)
        .toEqual(true);
    });
  });

  describe('getHelpCenterEmbed', () => {
    let result;
    const mockState = {
      base: {
        embeds: {
          helpCenterForm: true
        }
      }
    };

    beforeEach(() => {
      result = getHelpCenterEmbed(mockState);
    });

    it('returns the current state of embed.helpCenterForm', () => {
      expect(result)
        .toEqual(true);
    });
  });

  describe('getTalkEmbed', () => {
    let result;
    const mockState = {
      base: {
        embeds: {
          talk: true
        }
      }
    };

    beforeEach(() => {
      result = getTalkEmbed(mockState);
    });

    it('returns the current state of embed.talk', () => {
      expect(result)
        .toEqual(true);
    });
  });

  describe('getChatEmbed', () => {
    let result;
    const mockState = {
      base: {
        embeds: {
          chat: true
        }
      }
    };

    beforeEach(() => {
      result = getChatEmbed(mockState);
    });

    it('returns the current state of embed.chat', () => {
      expect(result)
        .toEqual(true);
    });
  });

  describe('getAuthenticated', () => {
    let result;
    const mockState = {
      base: {
        authenticated: true
      }
    };

    beforeEach(() => {
      result = getAuthenticated(mockState);
    });

    it('returns the current state of authenticated', () => {
      expect(result)
        .toEqual(true);
    });
  });

  describe('getEmbedShown', () => {
    let result;
    const mockState = {
      base: {
        embedShown: true
      }
    };

    beforeEach(() => {
      result = getEmbedShown(mockState);
    });

    it('returns the current state of embedShown', () => {
      expect(result)
        .toEqual(true);
    });
  });
});
