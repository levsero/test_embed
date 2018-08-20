describe('selectors', () => {
  let getShowTalkBackButton,
    getChatEnabled,
    getChatAvailable,
    getChatOnline,
    getTalkEnabled,
    getTalkAvailable,
    getShowTicketFormsBackButton,
    getChatOfflineAvailable,
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
    ticketFormsValue,
    offlineFormEnabledValue;

  activeEmbedValue = '';
  offlineFormEnabledValue = false;
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

  beforeEach(() => {
    mockery.enable();

    const selectorsPath = buildSrcPath('redux/modules/selectors');

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
        getShowOfflineChat: () => showOfflineFormValue,
        getOfflineFormEnabled: () => offlineFormEnabledValue
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
    getChatOfflineAvailable = selectors.getChatOfflineAvailable;
  });

  describe('getChatOfflineAvailable', () => {
    let result;

    beforeEach(() => {
      result = getChatOfflineAvailable();
    });

    describe('chat enabled status', () => {
      beforeAll(() => {
        showOfflineFormValue = true;
        zopimChatOnlineValue = false;
        chatEmbedValue = true;
        offlineFormEnabledValue = true;
        submitTicketEmbedValue = false;
      });

      describe('when chat enabled is true', () => {
        beforeAll(() => {
          zopimChatEmbedValue = true;
          settingsChatSuppressValue = false;
        });

        it('returns true', () => {
          expect(result)
            .toEqual(true);
        });
      });

      describe('when chat enabled is false', () => {
        beforeAll(() => {
          zopimChatEmbedValue = false;
          chatEmbedValue = false;
        });

        it('returns false', () => {
          expect(result)
            .toEqual(false);
        });
      });
    });

    describe('chat online status', () => {
      beforeAll(() => {
        settingsChatSuppressValue = false;
        chatEmbedValue = true;
        offlineFormEnabledValue = true;
        submitTicketEmbedValue = false;
      });

      describe('when chat online is true', () => {
        beforeAll(() => {
          zopimChatOnlineValue = true;
          showOfflineFormValue = false;
        });

        it('returns false', () => {
          expect(result)
            .toEqual(false);
        });
      });

      describe('when chat online is false', () => {
        beforeAll(() => {
          zopimChatOnlineValue = false;
          showOfflineFormValue = true;
        });

        it('returns true', () => {
          expect(result)
            .toEqual(true);
        });
      });
    });

    describe('chat new chat status', () => {
      beforeAll(() => {
        showOfflineFormValue = true;
        zopimChatOnlineValue = false;
        settingsChatSuppressValue = false;
        zopimChatEmbedValue = true;
        offlineFormEnabledValue = true;
        submitTicketEmbedValue = false;
      });

      describe('when new chat is true', () => {
        beforeAll(() => {
          chatEmbedValue = true;
        });

        it('returns true', () => {
          expect(result)
            .toEqual(true);
        });
      });

      describe('when new chat is false', () => {
        beforeAll(() => {
          chatEmbedValue = false;
        });

        it('returns false', () => {
          expect(result)
            .toEqual(false);
        });
      });
    });

    describe('chat offline form status', () => {
      beforeAll(() => {
        showOfflineFormValue = true;
        zopimChatOnlineValue = false;
        chatEmbedValue = true;
        settingsChatSuppressValue = false;
        submitTicketEmbedValue = false;
      });

      describe('when chat offline form enabled is true', () => {
        beforeAll(() => {
          offlineFormEnabledValue = true;
        });

        it('returns true', () => {
          expect(result)
            .toEqual(true);
        });
      });

      describe('when chat offline form enabled is false', () => {
        beforeAll(() => {
          offlineFormEnabledValue = false;
        });

        it('returns false', () => {
          expect(result)
            .toEqual(false);
        });
      });
    });

    describe('chat submit ticket embed status', () => {
      beforeAll(() => {
        showOfflineFormValue = true;
        zopimChatOnlineValue = false;
        chatEmbedValue = true;
        settingsChatSuppressValue = false;
        offlineFormEnabledValue = true;
      });

      describe('when submit ticket enabled is true', () => {
        beforeAll(() => {
          submitTicketEmbedValue = true;
        });

        it('returns false', () => {
          expect(result)
            .toEqual(false);
        });
      });

      describe('when submit ticket enabled is false', () => {
        beforeAll(() => {
          submitTicketEmbedValue = false;
        });

        it('returns true', () => {
          expect(result)
            .toEqual(true);
        });
      });
    });
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
        zopimChatOnlineValue = false;
        showOfflineFormValue = true;
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
      beforeEach(() => {
        settingsChatSuppressValue = false;
      });

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
          chatEmbedValue = false;
          zopimChatEmbedValue = false;
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
      beforeEach(() => {
        settingsChatSuppressValue = false;
      });

      describe('when zopimChat embed exists', () => {
        beforeEach(() => {
          zopimChatEmbedValue = true;
        });

        describe('when zopimChat is online', () => {
          beforeEach(() => {
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
            zopimChatOnlineValue = false;
            showOfflineFormValue = true;
            result = getChatAvailable();
          });

          it('returns false', () => {
            expect(result)
              .toEqual(false);
          });
        });
      });

      describe('when chat embed exists', () => {
        beforeEach(() => {
          chatEmbedValue = true;
        });

        describe('when showOfflineForm is false', () => {
          beforeEach(() => {
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
            zopimChatOnlineValue = false;
            showOfflineFormValue = true;
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
          chatEmbedValue = false;
          zopimChatEmbedValue = false;
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
    describe('when talkEmbed is true', () => {
      beforeEach(() => {
        talkEmbedValue = true;
      });

      describe('when embeddableConfigEnabled is true', () => {
        let result;

        beforeEach(() => {
          talkEmbeddableConfigEnabledValue = true;
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
          talkEmbeddableConfigEnabledValue = false;
          result = getTalkEnabled();
        });

        it('returns false', () => {
          expect(result)
            .toBe(false);
        });
      });
    });

    describe('when talkEmbed is false', () => {
      let result;

      beforeEach(() => {
        talkEmbedValue = false;
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
        talkEmbedValue = false;
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
        agentAvailabilityValue = false;
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
        activeEmbedValue = 'ticketSubmissionForm';
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
        activeEmbedValue = 'ticketSubmissionForm';
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
        activeEmbedValue = 'ticketSubmissionForm';
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
