describe('base selectors', () => {
  let getZopimChatEmbed;

  beforeEach(() => {
    mockery.enable();

    const selectorsPath = buildSrcPath('redux/modules/base/selectors');

    mockery.registerAllowable(selectorsPath);

    const selectors = requireUncached(selectorsPath);

    getZopimChatEmbed = selectors.getZopimChatEmbed;
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
});
