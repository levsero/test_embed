describe('selectors', () => {
  let getShowTalkBackButton,
    getChatEnabled,
    getChatAvailable,
    getChatOnline,
    settingsChatSuppressValue,
    zopimChatOnlineValue,
    chatOnlineValue,
    helpCenterEmbedValue,
    submitTicketEmbedValue,
    chatEmbedValue,
    zopimChatEmbedValue;

  beforeEach(() => {
    mockery.enable();

    const selectorsPath = buildSrcPath('redux/modules/selectors');

    settingsChatSuppressValue = false;
    zopimChatOnlineValue = false;
    chatOnlineValue = false;
    helpCenterEmbedValue = false;
    submitTicketEmbedValue = false;
    chatEmbedValue = false;
    zopimChatEmbedValue = false;

    initMockRegistry({
      './base/selectors': {
        getHelpCenterEmbed: () => helpCenterEmbedValue,
        getSubmitTicketEmbed: () => submitTicketEmbedValue,
        getChatEmbed: () => chatEmbedValue,
        getZopimChatEmbed: () => zopimChatEmbedValue
      },
      './settings/selectors': {
        getSettingsChatSuppress: () => settingsChatSuppressValue
      },
      './chat/selectors': {
        getChatOnline: () => chatOnlineValue
      },
      './zopimChat/selectors': {
        getZopimChatOnline: () => zopimChatOnlineValue
      }
    });

    mockery.registerAllowable(selectorsPath);

    const selectors = requireUncached(selectorsPath);

    getChatAvailable = selectors.getChatAvailable;
    getChatEnabled = selectors.getChatEnabled;
    getChatOnline = selectors.getChatOnline;
    getShowTalkBackButton = selectors.getShowTalkBackButton;
  });

  describe('getShowTalkBackButton', () => {
    let result;

    describe('when no other embeds are available', () => {
      beforeEach(() => {
        result = getShowTalkBackButton();
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });

    describe('when helpCenter is available', () => {
      beforeEach(() => {
        helpCenterEmbedValue = true;
        result = getShowTalkBackButton();
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when zopimChat is available', () => {
      beforeEach(() => {
        zopimChatEmbedValue = true;
        zopimChatOnlineValue = true;
        result = getShowTalkBackButton();
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when chat is available', () => {
      beforeEach(() => {
        chatEmbedValue = true;
        chatOnlineValue = true;
        result = getShowTalkBackButton();
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when submitTicket is available', () => {
      beforeEach(() => {
        submitTicketEmbedValue = true;
        result = getShowTalkBackButton();
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });
  });

  describe('getChatOnline', () => {
    let result;

    describe('when neither zopimChat or chat are online', () => {
      beforeEach(() => {
        result = getChatOnline();
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });

    describe('when zopimChat is online', () => {
      beforeEach(() => {
        zopimChatOnlineValue = true;
        result = getChatOnline();
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when chat is online', () => {
      beforeEach(() => {
        chatOnlineValue = true;
        result = getChatOnline();
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });
  });

  describe('getChatEnabled', () => {
    let result;

    describe('when chat is suppressed', () => {
      beforeEach(() => {
        settingsChatSuppressValue = true;
        result = getChatEnabled();
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });

    describe('when chat is not suppressed', () => {
      describe('when zopimChat embed exists', () => {
        beforeEach(() => {
          zopimChatEmbedValue = true;
          result = getChatEnabled();
        });

        it('returns true', () => {
          expect(result)
            .toEqual(true);
        });
      });

      describe('when chat embed exists', () => {
        beforeEach(() => {
          chatEmbedValue = true;
          result = getChatEnabled();
        });

        it('returns true', () => {
          expect(result)
            .toEqual(true);
        });
      });

      describe('when neither chat or zopimChat embed exists', () => {
        beforeEach(() => {
          result = getChatEnabled();
        });

        it('returns false', () => {
          expect(result)
            .toEqual(false);
        });
      });
    });
  });

  describe('getChatAvailable', () => {
    let result;

    describe('when chat is suppressed', () => {
      beforeEach(() => {
        settingsChatSuppressValue = true;
        result = getChatAvailable();
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });

    describe('when chat is not suppressed', () => {
      describe('when zopimChat embed exists', () => {
        describe('when zopimChat is online', () => {
          beforeEach(() => {
            zopimChatEmbedValue = true;
            zopimChatOnlineValue = true;
            result = getChatAvailable();
          });

          it('returns true', () => {
            expect(result)
              .toEqual(true);
          });
        });

        describe('when zopimChat is offline', () => {
          beforeEach(() => {
            zopimChatEmbedValue = true;
            result = getChatAvailable();
          });

          it('returns false', () => {
            expect(result)
              .toEqual(false);
          });
        });
      });

      describe('when chat embed exists', () => {
        describe('when chat is online', () => {
          beforeEach(() => {
            chatEmbedValue = true;
            chatOnlineValue = true;
            result = getChatAvailable();
          });

          it('returns true', () => {
            expect(result)
              .toEqual(true);
          });
        });

        describe('when chat is offline', () => {
          beforeEach(() => {
            chatEmbedValue = true;
            result = getChatAvailable();
          });

          it('returns false', () => {
            expect(result)
              .toEqual(false);
          });
        });
      });

      describe('when neither chat or zopimChat embed exists', () => {
        beforeEach(() => {
          result = getChatEnabled();
        });

        it('returns false', () => {
          expect(result)
            .toEqual(false);
        });
      });
    });
  });
});
