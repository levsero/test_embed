describe('selectors', () => {
  let settingsChatSuppressValue,
    zopimChatOnlineValue,
    zopimIsChattingValue,
    zopimChatOpenValue,
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
    configColor,
    chatThemeColor,
    chatThemePosition,
    newChatConnectedValue,
    zopimChatConnectedValue,
    embeddableConfigConnectedValue,
    embeddableConfigValue,
    hiddenByHideAPIValue,
    hiddenByActivateAPIValue,
    bootupTimeoutValue,
    webWidgetVisibleValue,
    launcherVisibleValue,
    settingsLauncherSetHideWhenChatOfflineValue,
    chatStandaloneValue,
    userMinimizedChatBadgeValue,
    chatBadgeColorValue,
    selectors;

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
  mockSettingsGetFn = () => false;
  isShowHCIntroState = false;
  hasPassedAuth = false;
  mockIsOnHelpCenterPage = false;
  mockIsChatting = false;
  embeddableConfigValue = {};
  configColor = {};
  chatThemeColor = {};
  chatThemePosition = {};
  bootupTimeoutValue = false;
  webWidgetVisibleValue = false;
  launcherVisibleValue = false;
  settingsLauncherSetHideWhenChatOfflineValue = false;
  chatStandaloneValue = false;
  userMinimizedChatBadgeValue = false;
  chatBadgeColorValue = '#333';

  beforeEach(() => {
    mockery.enable();

    const selectorsPath = buildSrcPath('redux/modules/selectors');

    initMockRegistry({
      'constants/shared': {
        EMBED_MAP: {
          helpCenterForm: 'helpCenter'
        },
        LAUNCHER: 'launcher'
      },
      './base/base-selectors': {
        getActiveEmbed: () => activeEmbedValue,
        getHelpCenterEmbed: () => helpCenterEmbedValue,
        getSubmitTicketEmbed: () => submitTicketEmbedValue,
        getChatEmbed: () => chatEmbedValue,
        getTalkEmbed: () => talkEmbedValue,
        getZopimChatEmbed: () => zopimChatEmbedValue,
        getIPMWidget: () => ipmWidget,
        getHasPassedAuth: () => hasPassedAuth,
        getConfigColor: () => configColor,
        getEmbeddableConfig: () => embeddableConfigValue,
        getHiddenByHideAPI: () => hiddenByHideAPIValue,
        getHiddenByActivateAPI: () => hiddenByActivateAPIValue,
        getBootupTimeout: () => bootupTimeoutValue,
        getWebWidgetVisible: () => webWidgetVisibleValue,
        getLauncherVisible: () => launcherVisibleValue,
        getChatStandalone: () => chatStandaloneValue,
        getUserMinimizedChatBadge: () => userMinimizedChatBadgeValue
      },
      './settings/settings-selectors': {
        getSettingsChatSuppress: () => settingsChatSuppressValue,
        getSettingsLauncherSetHideWhenChatOffline: () => settingsLauncherSetHideWhenChatOfflineValue
      },
      './chat/chat-selectors': {
        getShowOfflineChat: () => showOfflineFormValue,
        getOfflineFormEnabled: () => offlineFormEnabledValue,
        getStandaloneMobileNotificationVisible: () => standaloneMobileNotificationVisible,
        getIsChatting: () => mockIsChatting,
        getThemeColor: () => chatThemeColor,
        getThemePosition: () => chatThemePosition,
        getChatConnected: () => newChatConnectedValue,
        getOfflineFormSettings: () => ({ enabled: offlineFormEnabledValue }),
        getBadgeColor: () => chatBadgeColorValue
      },
      './zopimChat/zopimChat-selectors': {
        getZopimChatOnline: () => zopimChatOnlineValue,
        getZopimChatConnected: () => zopimChatConnectedValue,
        getZopimIsChatting: () => zopimIsChattingValue,
        getZopimChatOpen: () => zopimChatOpenValue
      },
      './talk/talk-selectors': {
        getEmbeddableConfigEnabled: () => talkEmbeddableConfigEnabledValue,
        getAgentAvailability: () => agentAvailabilityValue,
        getEmbeddableConfigConnected: () => embeddableConfigConnectedValue
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

    selectors = requireUncached(selectorsPath);
  });

  describe('getFrameStyle', () => {
    let result,
      mockFrameType;

    beforeEach(() => {
      result = selectors.getFrameStyle({}, mockFrameType);
    });

    describe('when frame type is webWidget', () => {
      beforeAll(() => {
        mockFrameType = 'webWidget';
        mockSettingsGetFn = _.identity;
      });

      it('returns webWidget frame styles', () => {
        expect(result)
          .toEqual({
            marginLeft: 'margin',
            marginRight: 'margin'
          });
      });
    });

    describe('when frame type is launcher', () => {
      beforeAll(() => {
        mockFrameType = 'launcher';
      });

      describe('when chat badge should show', () => {
        beforeAll(() => {
          zopimChatOnlineValue = true;
          isMobile = false;
          chatStandaloneValue = true;
          mockSettingsGetFn = () => 1;
        });

        it('returns chat badge launcher styles', () => {
          expect(result)
            .toEqual({
              zIndex: 0,
              height: '210px',
              minHeight: '210px',
              width: '254px',
              minWidth: '254px',
              marginTop: '7px',
              marginBottom: '7px',
              marginLeft: '7px',
              marginRight: '7px'
            });
        });
      });

      describe('when chat badge should not show', () => {
        beforeAll(() => {
          chatStandaloneValue = false;
          mockSettingsGetFn = () => 1;
        });

        it('returns chat badge launcher styles', () => {
          expect(result)
            .toEqual({
              height: '50px',
              minHeight: '50px',
              marginTop: '10px',
              marginBottom: '10px',
              marginLeft: '20px',
              marginRight: '20px',
              zIndex: 0
            });
        });
      });
    });
  });

  describe('getShowChatBadgeLauncher', () => {
    let result,
      mockState;

    beforeEach(() => {
      result = selectors.getShowChatBadgeLauncher(mockState);
    });

    describe('when not chat standalone', () => {
      beforeAll(() => {
        zopimChatOnlineValue = true;
        userMinimizedChatBadgeValue = false;
        isMobile = false;
        chatStandaloneValue = false;
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });

    describe('when on mobile', () => {
      beforeAll(() => {
        zopimChatOnlineValue = true;
        userMinimizedChatBadgeValue = false;
        isMobile = true;
        chatStandaloneValue = true;
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });

    describe('when chat badge minimized', () => {
      beforeAll(() => {
        zopimChatOnlineValue = true;
        userMinimizedChatBadgeValue = true;
        isMobile = false;
        chatStandaloneValue = true;
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });

    describe('when chat not online', () => {
      beforeAll(() => {
        zopimChatOnlineValue = false;
        userMinimizedChatBadgeValue = false;
        isMobile = false;
        chatStandaloneValue = true;
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });

    describe('when we should show chat badge', () => {
      beforeAll(() => {
        zopimChatOnlineValue = true;
        userMinimizedChatBadgeValue = false;
        isMobile = false;
        chatStandaloneValue = true;
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });
  });

  describe('getMaxWidgetHeight', () => {
    let result;

    beforeEach(() => {
      result = selectors.getMaxWidgetHeight();
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
      result = selectors.getIsOnInitialDesktopSearchScreen();
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
      result = selectors.getFixedStyles({}, mockFrameType);
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

  describe('getResetToContactFormOnChatOffline', () => {
    let result;

    beforeEach(() => {
      result = selectors.getResetToContactFormOnChatOffline();
    });

    describe('when all values are correct', () => {
      beforeAll(() => {
        zopimChatOnlineValue = false;
        zopimIsChattingValue = false;
        submitTicketEmbedValue = true;
        zopimChatOpenValue = true;
        activeEmbedValue = 'ticketSubmissionForm';
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });
    describe('when values are incorrect', () => {
      describe('getZopimChatOnline is true', () => {
        beforeAll(() => {
          zopimChatOnlineValue = true;
          zopimIsChattingValue = false;
          submitTicketEmbedValue = true;
          zopimChatOpenValue = true;
          activeEmbedValue = 'ticketSubmissionForm';
        });

        it('returns false', () => {
          expect(result)
            .toEqual(false);
        });
      });

      describe('getZopimIsChatting is true', () => {
        beforeAll(() => {
          zopimChatOnlineValue = false;
          zopimIsChattingValue = true;
          submitTicketEmbedValue = true;
          zopimChatOpenValue = true;
          activeEmbedValue = 'ticketSubmissionForm';
        });

        it('returns false', () => {
          expect(result)
            .toEqual(false);
        });
      });

      describe('getSubmitTicketEmbed is false', () => {
        beforeAll(() => {
          zopimChatOnlineValue = false;
          zopimIsChattingValue = false;
          submitTicketEmbedValue = false;
          zopimChatOpenValue = true;
          activeEmbedValue = 'ticketSubmissionForm';
        });

        it('returns false', () => {
          expect(result)
            .toEqual(false);
        });
      });

      describe('getZopimChatOpen is false', () => {
        beforeAll(() => {
          zopimChatOnlineValue = false;
          zopimIsChattingValue = false;
          submitTicketEmbedValue = true;
          zopimChatOpenValue = false;
          activeEmbedValue = 'ticketSubmissionForm';
        });

        it('returns false', () => {
          expect(result)
            .toEqual(false);
        });
      });

      describe('getActiveAmbed is not \'ticketSubmissionForm\'', () => {
        beforeAll(() => {
          zopimChatOnlineValue = false;
          zopimIsChattingValue = false;
          submitTicketEmbedValue = true;
          zopimChatOpenValue = true;
          activeEmbedValue = 'zopimChat';
        });

        it('returns false', () => {
          expect(result)
            .toEqual(false);
        });
      });
    });
  });

  describe('getChatOfflineAvailable', () => {
    let result;

    beforeEach(() => {
      result = selectors.getChatOfflineAvailable();
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

    beforeEach(() => {
      result = selectors.getShowTalkBackButton();
    });

    describe('when helpCenter is available', () => {
      beforeAll(() => {
        helpCenterEmbedValue = true;
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when zopimChat is available', () => {
      beforeAll(() => {
        zopimChatEmbedValue = true;
        zopimChatOnlineValue = true;
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when showOfflineForm is false', () => {
      beforeAll(() => {
        chatEmbedValue = true;
        showOfflineFormValue = false;
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when submitTicket is available', () => {
      beforeAll(() => {
        submitTicketEmbedValue = true;
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
        result = selectors.getChatOnline();
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });

    describe('when zopimChat is online', () => {
      beforeEach(() => {
        zopimChatOnlineValue = true;
        result = selectors.getChatOnline();
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when showOfflineForm is false', () => {
      beforeEach(() => {
        showOfflineFormValue = false;
        result = selectors.getChatOnline();
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
        result = selectors.getChatEnabled();
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
          result = selectors.getChatEnabled();
        });

        it('returns true', () => {
          expect(result)
            .toEqual(true);
        });
      });

      describe('when chat embed exists', () => {
        beforeEach(() => {
          chatEmbedValue = true;
          result = selectors.getChatEnabled();
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
          result = selectors.getChatEnabled();
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
        result = selectors.getChatAvailable();
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
            result = selectors.getChatAvailable();
          });

          it('returns true', () => {
            expect(result)
              .toEqual(true);
          });
        });

        describe('when zopimChat is offline', () => {
          beforeEach(() => {
            zopimChatOnlineValue = false;
            offlineFormEnabledValue = false;
            showOfflineFormValue = true;
            result = selectors.getChatAvailable();
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
            result = selectors.getChatAvailable();
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
            result = selectors.getChatAvailable();
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
          result = selectors.getChatEnabled();
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
          result = selectors.getTalkEnabled();
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
          result = selectors.getTalkEnabled();
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
        result = selectors.getTalkEnabled();
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

        result = selectors.getTalkAvailable();
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
        result = selectors.getTalkAvailable();
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
        result = selectors.getTalkAvailable();
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

        result = selectors.getShowTicketFormsBackButton();
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
        result = selectors.getShowTicketFormsBackButton();
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
        result = selectors.getShowTicketFormsBackButton();
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
        result = selectors.getShowTicketFormsBackButton();
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
      result = selectors.getHelpCenterAvailable();
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

  describe('getHelpCenterReady', () => {
    let result;

    beforeEach(() => {
      result = selectors.getHelpCenterReady();
    });

    describe('when helpCenter is not enabled', () => {
      beforeAll(() => {
        helpCenterEmbedValue = false;
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when helpCenter is enabled by not authenitcated', () => {
      beforeAll(() => {
        helpCenterEmbedValue = true;
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });

    describe('when helpCenter is enabled and authenticated', () => {
      beforeAll(() => {
        helpCenterEmbedValue = true;
        hasPassedAuth = true;
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });
  });

  describe('getChatConnected', () => {
    let result;

    beforeEach(() => {
      result = selectors.getChatConnected();
    });

    describe('when zopimChatConnected is true', () => {
      beforeAll(() => {
        zopimChatConnectedValue = true;
        newChatConnectedValue = false;
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when newChatConnected is true', () => {
      beforeAll(() => {
        zopimChatConnectedValue = false;
        newChatConnectedValue = true;
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when zopimChatConnected and newChatConnected are false', () => {
      beforeAll(() => {
        newChatConnectedValue = false;
        zopimChatConnectedValue = false;
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });
  });

  describe('getChatReady', () => {
    let result;

    beforeEach(() => {
      result = selectors.getChatReady();
    });

    describe('when getChatEmbed is false', () => {
      beforeAll(() => {
        zopimChatEmbedValue = false;
        chatEmbedValue = false;
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when getChatEmbed and getChatConnected are false', () => {
      beforeAll(() => {
        zopimChatConnectedValue = false;
        newChatConnectedValue = false;
        zopimChatEmbedValue = true;
        chatEmbedValue = true;
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });

    describe('when getChatConnected is true', () => {
      beforeAll(() => {
        zopimChatEmbedValue = true;
        newChatConnectedValue = true;
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });
  });

  describe('getTalkReady', () => {
    let result;

    beforeEach(() => {
      result = selectors.getTalkReady();
    });

    describe('when getTalkEmbed is false', () => {
      beforeAll(() => {
        talkEmbedValue = false;
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when getTalkEmbed and getEmbeddableConfigConnected are false', () => {
      beforeAll(() => {
        talkEmbedValue = true;
        embeddableConfigConnectedValue = false;
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });

    describe('when getEmbeddableConfigConnected is false', () => {
      beforeAll(() => {
        talkEmbedValue = true;
        embeddableConfigConnectedValue = true;
      });

      it('returns false', () => {
        expect(result)
          .toEqual(true);
      });
    });
  });

  describe('getIsWidgetReady', () => {
    let result;

    beforeEach(() => {
      result = selectors.getIsWidgetReady();
    });

    describe('when getTalkReady is false', () => {
      beforeAll(() => {
        talkEmbedValue = true;
        embeddableConfigConnectedValue = false;
      });

      afterAll(() => {
        talkEmbedValue = false;
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });

    describe('when getChatReady is false', () => {
      beforeAll(() => {
        zopimChatConnectedValue = false;
        newChatConnectedValue = false;
        zopimChatEmbedValue = true;
        chatEmbedValue = true;
      });

      afterAll(() => {
        chatEmbedValue = false;
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });

    describe('when getHelpCenterReady is false', () => {
      beforeAll(() => {
        helpCenterEmbedValue = true;
      });

      afterAll(() => {
        helpCenterEmbedValue = false;
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });

    describe('when all embeds are ready', () => {
      beforeAll(() => {
        talkEmbedValue = false;
        chatEmbedValue = false;
        zopimChatEmbedValue = false;
        helpCenterEmbedValue = false;
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when embeds are not ready but bootup timeout is finished', () => {
      beforeAll(() => {
        bootupTimeoutValue = true;
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });
  });

  describe('getIpmHelpCenterAllowed', () => {
    let result;

    beforeEach(() => {
      result = selectors.getIpmHelpCenterAllowed();
    });

    describe('when helpCenterEmbed is true', () => {
      beforeAll(() => {
        helpCenterEmbedValue = true;
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });

    describe('when helpCenterEmbed is false', () => {
      beforeAll(() => {
        helpCenterEmbedValue = false;
        embeddableConfigValue = { ipmAllowed: false };
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });

      describe('when config.ipm is true', () => {
        beforeAll(() => {
          helpCenterEmbedValue = false;
          embeddableConfigValue = { ipmAllowed: true };
        });

        it('returns true', () => {
          expect(result)
            .toEqual(true);
        });
      });
    });
  });

  describe('getSubmitTicketAvailable', () => {
    let result;

    beforeEach(() => {
      result = selectors.getSubmitTicketAvailable();
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
      result = selectors.getChannelChoiceAvailable();
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

    describe('when frame is WebWidget', () => {
      describe('when cp4 config', () => {
        beforeEach(() => {
          embeddableConfigValue = { cp4: true };
          chatThemeColor = 'blue';

          result = selectors.getColor({}, 'webWidget');
        });

        it('returns chat theme color', () => {
          expect(result)
            .toBe('blue');
        });
      });

      describe('when not cp4 config', () => {
        beforeEach(() => {
          embeddableConfigValue = { cp4: false };
          chatThemeColor = 'blue';
          configColor = 'white';

          result = selectors.getColor({}, 'webWidget');
        });

        it('returns config color', () => {
          expect(result)
            .toBe('white');
        });
      });
    });

    describe('when frame is launcher', () => {
      beforeAll(() => {
        chatStandaloneValue = false;
      });

      describe('when chat badge is not shown', () => {
        describe('when cp4 config', () => {
          beforeEach(() => {
            embeddableConfigValue = { cp4: true };
            chatThemeColor = 'blue';

            result = selectors.getColor({}, 'launcher');
          });

          it('returns chat theme color', () => {
            expect(result)
              .toBe('blue');
          });
        });

        describe('when not cp4 config', () => {
          beforeEach(() => {
            embeddableConfigValue = { cp4: false };
            chatThemeColor = 'blue';
            configColor = 'white';

            result = selectors.getColor({}, 'launcher');
          });

          it('returns config color', () => {
            expect(result)
              .toBe('white');
          });
        });
      });

      describe('when chat badge is shown', () => {
        beforeAll(() => {
          zopimChatOnlineValue = true;
          chatStandaloneValue = true;
          isMobile = false;
        });

        beforeEach(() => {
          result = selectors.getColor({}, 'launcher');
        });

        describe('when there are settings defined', () => {
          beforeAll(() => {
            mockSettingsGetFn = () => '#fff';
          });

          afterAll(() => {
            mockSettingsGetFn = () => false;
          });

          it('returns the settings as the color', () => {
            expect(result)
              .toEqual({
                base: '#fff',
                text: '#fff'
              });
          });
        });

        describe('when badge color is defined', () => {
          beforeAll(() => {
            chatThemeColor = 'blue';
            configColor = {
              base: 'white',
              text: 'blue'
            };
            chatBadgeColorValue = 'red';
          });

          it('sets the base to the badge color', () => {
            expect(result.base)
              .toEqual('red');
          });

          it('sets the text to the config color', () => {
            expect(result.text)
              .toEqual('blue');
          });
        });

        describe('when badge color is not defined', () => {
          beforeAll(() => {
            chatThemeColor = 'blue';
            configColor = {
              base: 'white',
              text: 'blue'
            };
            chatBadgeColorValue = undefined;
          });

          it('sets the base to the config color', () => {
            expect(result.base)
              .toEqual('white');
          });

          it('sets the text to the config color', () => {
            expect(result.text)
              .toEqual('blue');
          });
        });
      });
    });
  });

  describe('getWebWidgetVisible', () => {
    let result;

    beforeEach(() => {
      result = selectors.getWebWidgetVisible();
    });

    describe('when getBaseWebWidgetVisible is false', () => {
      beforeAll(() => {
        webWidgetVisibleValue = false;
      });

      afterAll(() => {
        webWidgetVisibleValue = true;
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });

    describe('when getIsWidgetReady is false', () => {
      beforeAll(() => {
        helpCenterEmbedValue = true;
        hasPassedAuth = false;
        bootupTimeoutValue = false;
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });

    describe('when getHiddenByHideAPI is true', () => {
      beforeAll(() => {
        hiddenByHideAPIValue = true;
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });

    describe('when getBaseWebWidgetVisible and getIsWidgetReady is true', () => {
      beforeAll(() => {
        webWidgetVisibleValue = true;
        hiddenByHideAPIValue = false;
        bootupTimeoutValue = true;
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });
  });

  describe('getPosition', () => {
    let result;

    describe('when cp4 config', () => {
      beforeEach(() => {
        embeddableConfigValue = { cp4: true, position: 'left' };
        chatThemePosition = 'right';

        result = selectors.getPosition();
      });

      it('returns chat theme postion', () => {
        expect(result)
          .toBe('right');
      });
    });

    describe('when not cp4 config', () => {
      beforeEach(() => {
        embeddableConfigValue = { position: 'left' };
        chatThemePosition = 'right';

        result = selectors.getPosition();
      });

      it('returns config position', () => {
        expect(result)
          .toBe('left');
      });
    });
  });

  describe('getLauncherVisible', () => {
    let result;

    beforeEach(() => {
      result = selectors.getLauncherVisible();
    });

    describe('when getBaseLauncherVisible is false', () => {
      beforeAll(() => {
        launcherVisibleValue = false;
      });

      afterAll(() => {
        launcherVisibleValue = true;
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });

    describe('when getIsWidgetReady is false', () => {
      beforeAll(() => {
        helpCenterEmbedValue = true;
        hasPassedAuth = false;
        bootupTimeoutValue = false;
      });

      beforeAll(() => {
        helpCenterEmbedValue = false;
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });

    describe('when getHiddenByActivateAPI is true', () => {
      beforeAll(() => {
        hiddenByActivateAPIValue = true;
      });

      afterAll(() => {
        hiddenByActivateAPIValue = false;
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });

    describe('when getHiddenByHideAPI is true', () => {
      beforeAll(() => {
        hiddenByHideAPIValue = true;
      });

      afterAll(() => {
        hiddenByHideAPIValue = false;
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });

    describe('when getBaseWebWidgetVisible and getIsWidgetReady is true', () => {
      beforeAll(() => {
        webWidgetVisibleValue = true;
        hiddenByHideAPIValue = false;
        bootupTimeoutValue = true;
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('shouldHideLauncher', () => {
      beforeAll(() => {
        webWidgetVisibleValue = true;
        hiddenByHideAPIValue = false;
        bootupTimeoutValue = true;
      });

      describe('when we should hide the launcher', () => {
        beforeAll(() => {
          zopimChatOnlineValue = false;
          showOfflineFormValue = true;
          chatStandaloneValue = true;
          settingsLauncherSetHideWhenChatOfflineValue = true;
        });

        afterEach(() => {
          zopimChatOnlineValue = true;
          showOfflineFormValue = false;
          chatStandaloneValue = false;
          settingsLauncherSetHideWhenChatOfflineValue = false;
        });

        it('returns false', () => {
          expect(result)
            .toEqual(false);
        });
      });
    });
  });

  describe('getWidgetDisplayInfo', () => {
    let result;

    beforeAll(() => {
      hasPassedAuth = true;
      helpCenterEmbedValue = true;
      hiddenByHideAPIValue = false;
      hiddenByActivateAPIValue = false;
      bootupTimeoutValue = true;
      mockSettingsGetFn = () => false;
      activeEmbedValue = 'helpCenterForm';
    });

    beforeEach(() => {
      result = selectors.getWidgetDisplayInfo();
    });

    describe('when launcher is visible', () => {
      beforeAll(() => {
        launcherVisibleValue = true;
      });

      it('returns launcher', () => {
        expect(result)
          .toEqual('launcher');
      });
    });

    describe('when launcher is not visible', () => {
      beforeAll(() => {
        launcherVisibleValue = false;
      });

      it('returns the active embed part of the map', () => {
        expect(result)
          .toEqual('helpCenter');
      });
    });
  });
});
