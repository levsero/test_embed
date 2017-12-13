describe('base selectors', () => {
  let getZopimChatEmbed, getHelpCenterEmbed, getTalkEmbed;

  beforeEach(() => {
    mockery.enable();

    const selectorsPath = buildSrcPath('redux/modules/base/selectors');

    mockery.registerAllowable(selectorsPath);

    const selectors = requireUncached(selectorsPath);

    getZopimChatEmbed = selectors.getZopimChatEmbed;
    getHelpCenterEmbed = selectors.getHelpCenterEmbed;
    getTalkEmbed = selectors.getTalkEmbed;
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
});
