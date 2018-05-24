describe('selectors', () => {
  let getShowTalkBackButton,
    getChatEnabled,
    getChatAvailable,
    getChatOnline,
    getTalkEnabled,
    getTalkAvailable,
    getShowTicketFormsBackButton,
    settingsChatSuppressValue,
    zopimChatOnlineValue,
    showOfflineFormValue,
    helpCenterEmbedValue,
    submitTicketEmbedValue,
    chatEmbedValue,
    zopimChatEmbedValue,
    talkEmbedValue,
    talkEmbeddableConfigEnabledValue,
    agentAvailabilityValue,
    activeTicketFormValue,
    activeEmbedValue,
    ticketFormsValue;

  beforeEach(() => {
    mockery.enable();

    const selectorsPath = buildSrcPath('redux/modules/selectors');

    activeEmbedValue = '';
    settingsChatSuppressValue = false;
    zopimChatOnlineValue = false;
    showOfflineFormValue = true;
    helpCenterEmbedValue = false;
    submitTicketEmbedValue = false;
    chatEmbedValue = false;
    zopimChatEmbedValue = false;
    talkEmbedValue = false;
    talkEmbeddableConfigEnabledValue = false;
    agentAvailabilityValue = false;
    activeTicketFormValue = null;
    ticketFormsValue = [];

    initMockRegistry({
      './base/base-selectors': {
        getActiveEmbed: () => activeEmbedValue,
        getHelpCenterEmbed: () => helpCenterEmbedValue,
        getSubmitTicketEmbed: () => submitTicketEmbedValue,
        getChatEmbed: () => chatEmbedValue,
        getTalkEmbed: () => talkEmbedValue,
        getZopimChatEmbed: () => zopimChatEmbedValue
      },
      './settings/settings-selectors': {
        getSettingsChatSuppress: () => settingsChatSuppressValue
      },
      './chat/chat-selectors': {
        getShowOfflineChat: () => showOfflineFormValue
      },
      './zopimChat/zopimChat-selectors': {
        getZopimChatOnline: () => zopimChatOnlineValue
      },
      './talk/talk-selectors': {
        getEmbeddableConfigEnabled: () => talkEmbeddableConfigEnabledValue,
        getAgentAvailability: () => agentAvailabilityValue
      },
      './submitTicket/submitTicket-selectors': {
        getActiveTicketForm: () => activeTicketFormValue,
        getTicketForms: () => ticketFormsValue
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
    getShowTicketFormsBackButton = selectors.getShowTicketFormsBackButton;
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

    describe('when showOfflineForm is false', () => {
      beforeEach(() => {
        chatEmbedValue = true;
        showOfflineFormValue = false;
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

    describe('when showOfflineForm is false', () => {
      beforeEach(() => {
        showOfflineFormValue = false;
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
        describe('when showOfflineForm is false', () => {
          beforeEach(() => {
            chatEmbedValue = true;
            showOfflineFormValue = false;
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

    describe('when talk is available and agent availability is true', () => {
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

  describe('getShowTicketFormsBackButton', () => {
    let result;

    describe('when submitTicket is the active embed and has an activeForm and more then 1 form', () => {
      beforeEach(() => {
        activeEmbedValue = 'submitTicket';
        activeTicketFormValue = 1;
        ticketFormsValue = [1, 2, 3];

        result = getShowTicketFormsBackButton();
      });

      it('returns true', () => {
        expect(result)
          .toBe(true);
      });
    });

    describe('when submitTicket is not the active embed', () => {
      beforeEach(() => {
        activeEmbedValue = 'chat';
        activeTicketFormValue = 1;
        ticketFormsValue = [1, 2, 3];
        result = getShowTicketFormsBackButton();
      });

      it('returns false', () => {
        expect(result)
          .toBe(false);
      });
    });

    describe('when active ticket form is falsy', () => {
      beforeEach(() => {
        activeEmbedValue = 'submitTicket';
        activeTicketFormValue = null;
        ticketFormsValue = [1, 2, 3];
        result = getShowTicketFormsBackButton();
      });

      it('returns false', () => {
        expect(result)
          .toBeFalsy();
      });
    });

    describe('when there is only one form', () => {
      beforeEach(() => {
        activeEmbedValue = 'submitTicket';
        activeTicketFormValue = 1;
        ticketFormsValue = [1];
        result = getShowTicketFormsBackButton();
      });

      it('returns false', () => {
        expect(result)
          .toBe(false);
      });
    });
  });
});
