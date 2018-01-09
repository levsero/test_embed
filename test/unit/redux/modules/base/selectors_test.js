describe('base selectors', () => {
  let getZopimChatEmbed,
    getHelpCenterEmbed,
    getTalkEmbed,
    getZopimChatAvailable,
    settingsChatSuppressValue,
    zopimChatOnlineValue,
    getShowTalkBackButton;

  beforeEach(() => {
    mockery.enable();

    const selectorsPath = buildSrcPath('redux/modules/base/selectors');

    settingsChatSuppressValue = false;
    zopimChatOnlineValue = true;

    initMockRegistry({
      'src/redux/modules/settings/selectors': {
        getSettingsChatSuppress: () => settingsChatSuppressValue
      },
      'src/redux/modules/zopimChat/selectors': {
        getZopimChatOnline: () => zopimChatOnlineValue
      }
    });

    mockery.registerAllowable(selectorsPath);

    const selectors = requireUncached(selectorsPath);

    getZopimChatEmbed = selectors.getZopimChatEmbed;
    getHelpCenterEmbed = selectors.getHelpCenterEmbed;
    getTalkEmbed = selectors.getTalkEmbed;
    getZopimChatAvailable = selectors.getZopimChatAvailable;
    getShowTalkBackButton = selectors.getShowTalkBackButton;
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

  describe('getShowTalkBackButton', () => {
    let result;
    const mockState = {
      base: {
        embeds: {
          helpCenterForm: false,
          ticketSubmissionForm: false
        }
      }
    };

    describe('when no other embeds are available', () => {
      beforeEach(() => {
        zopimChatOnlineValue = false;
        result = getShowTalkBackButton(mockState);
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });

    describe('when helpCenter is available', () => {
      beforeEach(() => {
        mockState.base.embeds.helpCenterForm = true;
        result = getShowTalkBackButton(mockState);
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when zopimChat is online', () => {
      beforeEach(() => {
        result = getShowTalkBackButton(mockState);
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when submitTicket is available', () => {
      beforeEach(() => {
        mockState.base.embeds.ticketSubmissionForm = true;
        result = getShowTalkBackButton(mockState);
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });
  });

  describe('getZopimChatAvailable', () => {
    let result;
    const mockState = {
      base: {
        embeds: {
          zopimChat: true
        }
      }
    };

    describe('when getSettingsChatSuppress value is false and zopimChat embed and getZopimChatOnline is true', () => {
      beforeEach(() => {
        result = getZopimChatAvailable(mockState);
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when zopimChat embed is false', () => {
      beforeEach(() => {
        mockState.base.embeds.zopimChat = false;
        result = getZopimChatAvailable(mockState);
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });

    describe('when getSettingsChatSuppress value is true', () => {
      beforeEach(() => {
        settingsChatSuppressValue = true;
        result = getZopimChatAvailable(mockState);
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });

    describe('when getZopimChatOnline value is false', () => {
      beforeEach(() => {
        zopimChatOnlineValue = false;
        result = getZopimChatAvailable(mockState);
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });
  });
});
