describe('selectors', () => {
  let getShowTalkBackButton,
    getChatEnabled,
    getChatAvailable,
    getChatOnline,
    getTalkEnabled,
    getTalkAvailable,
    settingsChatSuppressValue,
    zopimChatOnlineValue,
    chatOnlineValue,
    helpCenterEmbedValue,
    submitTicketEmbedValue,
    chatEmbedValue,
    zopimChatEmbedValue,
    talkEmbedValue,
    talkEmbeddableConfigEnabledValue,
    agentAvailabilityValue;

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
    talkEmbedValue = false;
    talkEmbeddableConfigEnabledValue = false;
    agentAvailabilityValue = false;

    initMockRegistry({
      './base/selectors': {
        getHelpCenterEmbed: () => helpCenterEmbedValue,
        getSubmitTicketEmbed: () => submitTicketEmbedValue,
        getChatEmbed: () => chatEmbedValue,
        getTalkEmbed: () => talkEmbedValue,
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
      },
      './talk/talk-selectors': {
        getEmbeddableConfigEnabled: () => talkEmbeddableConfigEnabledValue,
        getAgentAvailability: () => agentAvailabilityValue
      }
    });

    mockery.registerAllowable(selectorsPath);

    const selectors = requireUncached(selectorsPath);

    getChatAvailable = selectors.getChatAvailable;
    getChatEnabled = selectors.getChatEnabled;
    getChatOnline = selectors.getChatOnline;
    getShowTalkBackButton = selectors.getShowTalkBackButton;
    getTalkEnabled = selectors.getTalkEnabled;
    getTalkAvailable = selectors.getTalkAvailable;
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

  describe('getTalkEnabled', () => {
    describe('when embeddableConfigEnabled and talkEmbed are true', () => {
      let result;

      beforeEach(() => {
        talkEmbeddableConfigEnabledValue = true;
        talkEmbedValue = true;

        result = getTalkEnabled();
      });

      it('returns true', () => {
        expect(result)
          .toBe(true);
      });
    });

    describe('when embeddableConfigEnabled is false', () => {
      let result;

      beforeEach(() => {
        talkEmbedValue = true;
        result = getTalkEnabled();
      });

      it('returns false', () => {
        expect(result)
          .toBe(false);
      });
    });

    describe('when talkEmbed is false', () => {
      let result;

      beforeEach(() => {
        talkEmbeddableConfigEnabledValue = true;
        result = getTalkEnabled();
      });

      it('returns false', () => {
        expect(result)
          .toBe(false);
      });
    });
  });

  describe('getTalkAvailable', () => {
    let result;

    describe('when talk is avalilable and agent availability is true', () => {
      beforeEach(() => {
        talkEmbeddableConfigEnabledValue = true;
        talkEmbedValue = true;
        agentAvailabilityValue = true;

        result = getTalkAvailable();
      });

      it('returns true', () => {
        expect(result)
          .toBe(true);
      });
    });

    describe('when talk is not available', () => {
      beforeEach(() => {
        agentAvailabilityValue = true;
        result = getTalkAvailable();
      });

      it('returns false', () => {
        expect(result)
          .toBe(false);
      });
    });

    describe('when agent availability is false', () => {
      beforeEach(() => {
        talkEmbeddableConfigEnabledValue = true;
        talkEmbedValue = true;
        result = getTalkAvailable();
      });

      it('returns false', () => {
        expect(result)
          .toBe(false);
      });
    });
  });
});
