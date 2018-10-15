describe('selectors', () => {
  let getShowTalkBackButton,
    getChatEnabled,
    getChatAvailable,
    getChatOnline,
    getTalkEnabled,
    getTalkAvailable,
    getShowTicketFormsBackButton,
    getChatOfflineAvailable,
    getFixedStyles,
    getIsOnInitialDesktopSearchScreen,
    getMaxWidgetHeight,
    getHelpCenterAvailable,
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
    offlineFormEnabledValue,
    isMobile,
    ipmWidget,
    standaloneMobileNotificationVisible,
    mockSettingsGetFn,
    isShowHCIntroState,
    hasPassedAuth,
    mockIsOnHelpCenterPage,
    mockIsChatting,
    getSubmitTicketAvailable,
    getColor,
    getPosition,
    embeddableConfig,
    configColor,
    chatThemeColor,
    chatThemePosition,
    getChannelChoiceAvailable;

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
  isMobile = false;
  ipmWidget = false;
  standaloneMobileNotificationVisible = false;
  getMaxWidgetHeight = false;
  mockSettingsGetFn = () => false;
  isShowHCIntroState = false;
  hasPassedAuth = false;
  mockIsOnHelpCenterPage = false;
  mockIsChatting = false;
  embeddableConfig = {};
  configColor = {};
  chatThemeColor = {};
  chatThemePosition = {};

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
        getZopimChatEmbed: () => zopimChatEmbedValue,
        getIPMWidget: () => ipmWidget,
        getHasPassedAuth: () => hasPassedAuth,
        getEmbeddableConfig: () => embeddableConfig,
        getConfigColor: () => configColor
      },
      './settings/settings-selectors': {
        getSettingsChatSuppress: () => settingsChatSuppressValue
      },
      './chat/chat-selectors': {
        getShowOfflineChat: () => showOfflineFormValue,
        getOfflineFormEnabled: () => offlineFormEnabledValue,
        getStandaloneMobileNotificationVisible: () => standaloneMobileNotificationVisible,
        getIsChatting: () => mockIsChatting,
        getThemeColor: () => chatThemeColor,
        getThemePosition: () => chatThemePosition
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
      },
      'utility/devices': {
        isMobileBrowser: () => isMobile
      },
      'src/constants/shared': {
        MAX_WIDGET_HEIGHT_NO_SEARCH: 150,
        WIDGET_MARGIN: 15,
        FONT_SIZE: 14
      },
      './helpCenter/helpCenter-selectors': {
        getIsShowHCIntroState: () => isShowHCIntroState
      },
      'service/settings': {
        settings: {
          get: mockSettingsGetFn
        }
      },
      'utility/pages': {
        isOnHelpCenterPage: () => mockIsOnHelpCenterPage
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
    getFixedStyles = selectors.getFixedStyles;
    getIsOnInitialDesktopSearchScreen = selectors.getIsOnInitialDesktopSearchScreen;
    getMaxWidgetHeight = selectors.getMaxWidgetHeight;
    getHelpCenterAvailable = selectors.getHelpCenterAvailable;
    getSubmitTicketAvailable = selectors.getSubmitTicketAvailable;
    getChannelChoiceAvailable = selectors.getChannelChoiceAvailable;
    getColor = selectors.getColor;
    getPosition = selectors.getPosition;
  });

  describe('getMaxWidgetHeight', () => {
    let result;

    beforeEach(() => {
      result = getMaxWidgetHeight();
    });

    describe('when isOnInitialDesktopSearchScreen is true and maxHeight styles are present', () => {
      beforeAll(() => {
        isMobile = false;
        helpCenterEmbedValue = true;
        mockSettingsGetFn = () => false;
        isShowHCIntroState = true;
        hasPassedAuth = true;
        activeEmbedValue = 'helpCenterForm';
      });

      it('returns small height', () => {
        expect(result)
          .toEqual(150);
      });
    });
  });

  describe('getIsOnInitialDesktopSearchScreen', () => {
    let result;

    beforeEach(() => {
      result = getIsOnInitialDesktopSearchScreen();
    });

    describe('when maxHeight override style exists', () => {
      beforeAll(() => {
        isMobile = false;
        helpCenterEmbedValue = true;
        mockSettingsGetFn = () => false;
        isShowHCIntroState = true;
        hasPassedAuth = true;
        activeEmbedValue = 'helpCenterForm';
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when maxHeight override style does not exist', () => {
      beforeAll(() => {
        isMobile = true;
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });
  });

  describe('getFixedStyles', () => {
    let result,
      mockFrameType;

    beforeEach(() => {
      result = getFixedStyles({}, mockFrameType);
    });

    describe('when frame is launcher', () => {
      beforeAll(() => {
        mockFrameType = 'launcher';
      });

      it('returns no styles', () => {
        expect(result)
          .toEqual({});
      });
    });

    describe('when frame is webWidget', () => {
      beforeAll(() => {
        mockFrameType = 'webWidget';
      });

      describe('when using ipm widget only', () => {
        beforeAll(() => {
          ipmWidget = true;
        });

        afterEach(() => {
          ipmWidget = false;
        });

        it('returns no styles', () => {
          expect(result)
            .toEqual({});
        });
      });

      describe('when on initial search screen', () => {
        beforeAll(() => {
          isMobile = false;
          helpCenterEmbedValue = true;
          mockSettingsGetFn = () => false;
          isShowHCIntroState = true;
          hasPassedAuth = true;
          activeEmbedValue = 'helpCenterForm';
        });

        afterEach(() => {
          helpCenterEmbedValue = false;
        });

        it('returns maxHeight styles', () => {
          expect(result)
            .toEqual({
              maxHeight: '165px'
            });
        });
      });

      describe('when HC is suppressed', () => {
        beforeAll(() => {
          mockSettingsGetFn = () => true;
        });

        it('does not return maxHeight styles', () => {
          expect(result.maxHeight)
            .toBeFalsy();
        });
      });

      describe('when hasPassedAuth is false', () => {
        beforeAll(() => {
          hasPassedAuth = false;
        });

        it('does not return maxHeight styles', () => {
          expect(result.maxHeight)
            .toBeFalsy();
        });
      });

      describe('when activeEmbed is not helpCenterForm', () => {
        beforeAll(() => {
          activeEmbedValue = 'chat';
        });

        it('does not return maxHeight styles', () => {
          expect(result.maxHeight)
            .toBeFalsy();
        });
      });

      describe('when standaloneMobileNotificationVisible is true', () => {
        beforeAll(() => {
          standaloneMobileNotificationVisible = true;
        });

        afterEach(() => {
          standaloneMobileNotificationVisible = false;
        });

        it('returns mobile styles', () => {
          expect(result)
            .toEqual({
              height: '23.928571428571427rem',
              background: 'transparent',
              bottom: 0,
              top: 'initial'
            });
        });
      });

      describe('when no styles are needed', () => {
        it('returns no styles', () => {
          expect(result)
            .toEqual({});
        });
      });
    });
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
        helpCenterEmbedValue = false;
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

  describe('getHelpCenterAvailable', () => {
    let result;

    beforeEach(() => {
      result = getHelpCenterAvailable();
    });

    describe('when helpCenter is enabled', () => {
      beforeAll(() => {
        helpCenterEmbedValue = true;
      });

      describe('when helpCenter is suppressed', () => {
        beforeAll(() => {
          mockSettingsGetFn = () => true;
        });

        it('returns false', () => {
          expect(result)
            .toEqual(false);
        });
      });

      describe('when helpCemter is not suppressed', () => {
        beforeAll(() => {
          mockSettingsGetFn = () => false;
        });

        describe('when the application is authenticated', () => {
          beforeAll(() => {
            hasPassedAuth = true;
          });

          it('returns true', () => {
            expect(result)
              .toEqual(true);
          });
        });

        describe('when the application is not authenticated', () => {
          beforeAll(() => {
            hasPassedAuth = false;
          });

          it('returns false', () => {
            expect(result)
              .toEqual(false);
          });
        });
      });
    });

    describe('when helpCenter is not enabled', () => {
      beforeAll(() => {
        helpCenterEmbedValue = false;
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });
  });

  describe('getSubmitTicketAvailable', () => {
    let result;

    beforeEach(() => {
      result = getSubmitTicketAvailable();
    });

    describe('when submitTicketEmbed exists', () => {
      beforeAll(() => {
        submitTicketEmbedValue = true;
      });

      describe('when contactForm is suppressed', () => {
        beforeAll(() => {
          mockSettingsGetFn = () => true;
        });

        it('returns false', () => {
          expect(result)
            .toEqual(false);
        });
      });

      describe('when contactForm is not suppressed', () => {
        beforeAll(() => {
          mockSettingsGetFn = () => false;
        });

        it('returns true', () => {
          expect(result)
            .toEqual(true);
        });
      });
    });

    describe('when submitTicketEmbed does not exist', () => {
      beforeAll(() => {
        submitTicketEmbedValue = false;
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });
  });

  describe('getChannelChoiceAvailable', () => {
    let result,
      channelChoiceSettings;

    beforeEach(() => {
      result = getChannelChoiceAvailable();
    });

    describe('when channelChoice is enabled', () => {
      beforeAll(() => {
        // ChannelChoice enabled
        submitTicketEmbedValue = true;
        channelChoiceSettings = [{ enabled: true }, false];

        // Talk not available
        talkEmbedValue = false;
        talkEmbeddableConfigEnabledValue = false;
        agentAvailabilityValue = false;

        // Chat available
        chatEmbedValue = true;
        settingsChatSuppressValue = false;
        zopimChatOnlineValue = true;
        showOfflineFormValue = false;

        // Is not chatting
        mockIsChatting = false;

        mockSettingsGetFn = jasmine.createSpy('settingsFn').and.returnValues(...channelChoiceSettings);
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when talk is enabled', () => {
      beforeAll(() => {
        // ChannelChoice disabled
        submitTicketEmbedValue = false;
        channelChoiceSettings = [{ enabled: false }, true];

        // Talk available
        talkEmbedValue = true;
        talkEmbeddableConfigEnabledValue = true;
        agentAvailabilityValue = true;

        // Chat available
        chatEmbedValue = true;
        settingsChatSuppressValue = false;
        zopimChatOnlineValue = true;
        showOfflineFormValue = false;

        // Is not chatting
        mockIsChatting = false;

        mockSettingsGetFn = jasmine.createSpy('settingsFn').and.returnValues(...channelChoiceSettings);
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when channelChoice and talk is not enabled', () => {
      beforeAll(() => {
        // ChannelChoice not enabled
        submitTicketEmbedValue = false;
        channelChoiceSettings = [{ enabled: false }, true];

        // Talk not available
        talkEmbedValue = false;
        talkEmbeddableConfigEnabledValue = false;
        agentAvailabilityValue = false;

        // Chat available
        chatEmbedValue = true;
        settingsChatSuppressValue = false;
        zopimChatOnlineValue = true;
        showOfflineFormValue = false;

        // Is not chatting
        mockIsChatting = false;

        mockSettingsGetFn = jasmine.createSpy('settingsFn').and.returnValues(...channelChoiceSettings);
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });

    describe('when no channels are available', () => {
      beforeAll(() => {
        // ChannelChoice not enabled
        submitTicketEmbedValue = false;
        channelChoiceSettings = [{ enabled: false }, true];

        // Is not chatting
        mockIsChatting = false;

        mockSettingsGetFn = jasmine.createSpy('settingsFn').and.returnValues(...channelChoiceSettings);
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });

    describe('when either the user or agent is chatting', () => {
      beforeAll(() => {
        // ChannelChoice enabled
        submitTicketEmbedValue = true;
        channelChoiceSettings = [{ enabled: true }, false];

        // Talk available
        talkEmbedValue = true;
        talkEmbeddableConfigEnabledValue = true;
        agentAvailabilityValue = true;

        // Chat available
        chatEmbedValue = true;
        settingsChatSuppressValue = false;
        zopimChatOnlineValue = true;
        showOfflineFormValue = false;

        // Is not chatting
        mockIsChatting = true;

        mockSettingsGetFn = jasmine.createSpy('settingsFn').and.returnValues(...channelChoiceSettings);
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });
  });

  describe('getColor', () => {
    let result;

    describe('when cp4 config', () => {
      beforeEach(() => {
        embeddableConfig = { cp4: true };
        chatThemeColor = 'blue';

        result = getColor();
      });

      it('returns chat theme color', () => {
        expect(result)
          .toBe('blue');
      });
    });

    describe('when not cp4 config', () => {
      beforeEach(() => {
        embeddableConfig = { cp4: false };
        chatThemeColor = 'blue';
        configColor = 'white';

        result = getColor();
      });

      it('returns config color', () => {
        expect(result)
          .toBe('white');
      });
    });
  });

  describe('getPosition', () => {
    let result;

    describe('when cp4 config', () => {
      beforeEach(() => {
        embeddableConfig = { cp4: true, position: 'left' };
        chatThemePosition = 'right';

        result = getPosition();
      });

      it('returns chat theme postion', () => {
        expect(result)
          .toBe('right');
      });
    });

    describe('when not cp4 config', () => {
      beforeEach(() => {
        embeddableConfig = { position: 'left' };
        chatThemePosition = 'right';

        result = getPosition();
      });

      it('returns config position', () => {
        expect(result)
          .toBe('left');
      });
    });
  });
});
