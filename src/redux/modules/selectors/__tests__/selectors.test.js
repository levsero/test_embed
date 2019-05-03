/* eslint-disable camelcase */
import _ from 'lodash';
import 'utility/i18nTestHelper';
import * as globals from 'utility/globals';
import * as devices from 'utility/devices';
import { testTranslationStringSelector } from 'src/util/testHelpers';

import * as selectors from 'src/redux/modules/selectors/selectors';
import * as zopimChatSelectors from 'src/redux/modules/zopimChat/zopimChat-selectors';
import * as chatSelectors from 'src/redux/modules/chat/chat-selectors/selectors';
import * as chatReselectors from 'src/redux/modules/chat/chat-selectors/reselectors';

// Cannot mock base-selectors due to reimports.
import * as screens from 'src/redux/modules/talk/talk-screen-types';
import { i18n } from 'src/service/i18n';
import { getModifiedState } from 'src/fixtures/selectors-test-state';
import { LAUNCHER } from 'constants/shared';
import { CONNECTION_STATUSES } from 'constants/chat';

const stateLauncherSettings = (settings) => {
  return {
    base: { locale: 'en-US' },
    settings: {
      launcher: {
        settings
      }
    }
  };
};

const stateHelpCenterSettings = (settings) => {
  return {
    base: { locale: 'en-US' },
    settings: {
      helpCenter: settings
    }
  };
};

const stateContactFormSettings = (settings) => {
  return {
    base: { locale: 'en-US' },
    settings: {
      contactForm: {
        settings: settings
      }
    }
  };
};

const stateAnswerBotSettings = (settings) => {
  return {
    base: {
      locale: 'en-US',
      embeddableConfig: {
        brand: undefined
      }
    },
    settings: {
      answerBot: settings
    }
  };
};

const stateAttachmentSettings = (configAttachments, settingsAttachments) => {
  return {
    base: {
      embeddableConfig: {
        embeds: {
          ticketSubmissionForm: {
            props: {
              attachmentsEnabled: configAttachments
            }
          }
        }
      }
    },
    settings: {
      contactForm: {
        settings: {
          attachments: settingsAttachments
        }
      }
    }
  };
};

describe('selectors', () => {
  let state;

  describe('getHideZendeskLogo', () => {
    beforeEach(() => {
      state = {
        base: {
          embeddableConfig: {
            hideZendeskLogo: false
          }
        },
        chat: {
          accountSettings: {
            branding: {
              hide_branding: false // eslint-disable-line camelcase
            }
          }
        }
      };
    });

    it('returns true if accountSettings hide_branding is true', () => {
      state.chat.accountSettings.branding.hide_branding = true; // eslint-disable-line camelcase

      expect(selectors.getHideZendeskLogo(state))
        .toEqual(true);
    });

    it('returns true if embeddableConfig hideZendeskLogo is true', () => {
      state.base.embeddableConfig.hideZendeskLogo = true;

      expect(selectors.getHideZendeskLogo(state))
        .toEqual(true);
    });

    it('returns false if embeddableConfig hideZendeskLogo and accountSettings hide_branding are false', () => {
      expect(selectors.getHideZendeskLogo(state))
        .toEqual(false);
    });
  });

  describe('answer bot', () => {
    test('getSettingsAnswerBotTitle', () => {
      const state = stateAnswerBotSettings({ title: { '*': 'answer bot title' } });
      const result = selectors.getSettingsAnswerBotTitle(state);

      expect(result)
        .toEqual('answer bot title');
    });

    test('getSettingsAnswerBotAvatarName', () => {
      const state = stateAnswerBotSettings({ avatar: { name: { '*': 'answer bot name' } } });
      const result = selectors.getSettingsAnswerBotAvatarName(state);

      expect(result)
        .toEqual('answer bot name');
    });

    describe('getAnswerBotEnabled', () => {
      const embeddableConfig = (answerBotEnabled) => (
        {
          embeddableConfig: {
            embeds: {
              helpCenterForm: {
                props: {
                  answerBotEnabled
                }
              }
            }
          }
        }
      );

      test('config is enabled and not suppressed', () => {
        const result = selectors.getAnswerBotEnabled({
          base: embeddableConfig(true),
          settings: {
            answerBot: {}
          }
        });

        expect(result)
          .toEqual(true);
      });

      test('config is enabled and suppressed', () => {
        const result = selectors.getAnswerBotEnabled({
          base: embeddableConfig(true),
          settings: {
            answerBot: {
              suppress: true
            }
          }
        });

        expect(result)
          .toEqual(false);
      });

      test('config is disabled', () => {
        const result = selectors.getAnswerBotEnabled({
          base: embeddableConfig(false),
          settings: {
            answerBot: {
            }
          }
        });

        expect(result)
          .toEqual(false);
      });
    });
  });

  describe('getLauncherChatLabel', () => {
    describe('when chatLabel is defined in launcher settings', () => {
      beforeEach(() => {
        state = stateLauncherSettings({ chatLabel: { '*': 'chat label' } });
      });

      it('returns the chatLabel', () => {
        expect(selectors.getLauncherChatLabel(state, {}))
          .toEqual('chat label');
      });
    });

    describe('when chatLabel is not defined in launcher settings', () => {
      beforeEach(() => {
        state = stateLauncherSettings({ chatLabel: null });

        jest.spyOn(i18n, 't')
          .mockReturnValue('Chat');
      });

      afterEach(() => {
        i18n.t.mockRestore();
      });

      it('returns the value from i18n', () => {
        expect(selectors.getLauncherChatLabel(state, {}))
          .toEqual('Chat');
        expect(i18n.t).toHaveBeenCalledWith('embeddable_framework.launcher.label.chat');
      });
    });
  });

  describe('getLauncherLabel', () => {
    describe('when label is defined in launcher settings', () => {
      beforeEach(() => {
        state = stateLauncherSettings({  label: { '*': 'launcher label'  } });
      });

      it('returns the label', () => {
        expect(selectors.getLauncherLabel(state, 'help'))
          .toEqual('launcher label');
      });
    });

    describe('when label is not defined in launcher settings', () => {
      beforeEach(() => {
        state = stateLauncherSettings({  label: null });

        jest.spyOn(i18n, 't')
          .mockImplementation(() => 'Help');
      });

      afterEach(() => {
        i18n.t.mockRestore();
      });

      it('returns the value from i18n', () => {
        expect(selectors.getLauncherLabel(state, 'embeddable_framework.launcher.label.help'))
          .toEqual('Help');
        expect(i18n.t).toHaveBeenCalledWith('embeddable_framework.launcher.label.help');
      });
    });
  });

  describe('getSettingsHelpCenterTitle', () => {
    describe('when title is defined in helpCenter settings', () => {
      beforeEach(() => {
        state = stateHelpCenterSettings({ title: { '*': 'helpCenter title' } });
      });

      it('returns the title', () => {
        expect(selectors.getSettingsHelpCenterTitle(state, 'embeddable_framework.helpCenter.form.title.help'))
          .toEqual('helpCenter title');
      });
    });

    describe('when title is not defined in helpCenter settings', () => {
      beforeEach(() => {
        state = stateHelpCenterSettings({  title: null });

        jest.spyOn(i18n, 't')
          .mockImplementation(() => 'Help');
      });

      afterEach(() => {
        i18n.t.mockRestore();
      });

      it('returns the value from i18n', () => {
        expect(selectors.getSettingsHelpCenterTitle(state, 'embeddable_framework.helpCenter.form.title.help'))
          .toEqual('Help');
        expect(i18n.t).toHaveBeenCalledWith('embeddable_framework.helpCenter.form.title.help');
      });
    });
  });

  describe('getSettingsHelpCenterMessageButton', () => {
    let state, label;

    beforeEach(() => {
      label = 'embeddable_framework.helpCenter.submitButton.label.submitTicket.message';
    });

    describe('when messageButton is defined in helpCenter settings', () => {
      beforeEach(() => {
        state = stateHelpCenterSettings({  messageButton: { '*': 'helpCenter messageButton'  } });
      });

      it('returns the messageButton', () => {
        expect(selectors.getSettingsHelpCenterMessageButton(state, label))
          .toEqual('helpCenter messageButton');
      });
    });

    describe('when messageButton is not defined in helpCenter settings', () => {
      beforeEach(() => {
        state = stateHelpCenterSettings({  messageButton: null });

        jest.spyOn(i18n, 't')
          .mockImplementation(() => 'Help');
      });

      afterEach(() => {
        i18n.t.mockRestore();
      });

      it('returns the value from i18n', () => {
        expect(selectors.getSettingsHelpCenterMessageButton(state, label))
          .toEqual('Help');
        expect(i18n.t).toHaveBeenCalledWith(label);
      });
    });
  });

  describe('getSettingsHelpCenterSearchPlaceholder', () => {
    describe('when searchPlaceholder is defined in helpCenter settings', () => {
      beforeEach(() => {
        state = stateHelpCenterSettings({  searchPlaceholder: { '*': 'helpCenter searchPlaceholder'  } });
      });

      it('returns the searchPlaceholder', () => {
        expect(selectors.getSettingsHelpCenterSearchPlaceholder(state))
          .toEqual('helpCenter searchPlaceholder');
      });
    });

    describe('when searchPlaceholder is not defined in helpCenter settings', () => {
      beforeEach(() => {
        state = stateHelpCenterSettings({  searchPlaceholder: null });

        jest.spyOn(i18n, 't')
          .mockImplementation(() => 'Help');
      });

      afterEach(() => {
        i18n.t.mockRestore();
      });

      it('returns the value from i18n', () => {
        expect(selectors.getSettingsHelpCenterSearchPlaceholder(state))
          .toEqual('Help');
        expect(i18n.t).toHaveBeenCalledWith('embeddable_framework.helpCenter.search.label.how_can_we_help');
      });
    });
  });

  describe('getSettingsHelpCenterChatButton', () => {
    describe('when chatButton is defined in helpCenter settings', () => {
      beforeEach(() => {
        state = stateHelpCenterSettings({  chatButton: { '*': 'helpCenter chatButton'  } });
      });

      it('returns the chatButton', () => {
        expect(selectors.getSettingsHelpCenterChatButton(state))
          .toEqual('helpCenter chatButton');
      });
    });

    describe('when chatButton is not defined in helpCenter settings', () => {
      beforeEach(() => {
        state = stateHelpCenterSettings({  chatButton: null });

        jest.spyOn(i18n, 't')
          .mockImplementation(() => 'Help');
      });

      afterEach(() => {
        i18n.t.mockRestore();
      });

      it('returns the value from i18n', () => {
        expect(selectors.getSettingsHelpCenterChatButton(state))
          .toEqual('Help');
        expect(i18n.t).toHaveBeenCalledWith('embeddable_framework.common.button.chat');
      });
    });
  });

  describe('getContactFormTitle', () => {
    let state;

    describe('when a custom translation is defined in settings', () => {
      beforeEach(() => {
        state = stateContactFormSettings({ title: { '*': 'Mamma mia!' } });
      });

      it('returns the custom translation', () => {
        expect(selectors.getContactFormTitle(state))
          .toEqual('Mamma mia!');
      });
    });

    describe('when a custom translation is not defined in settings', () => {
      beforeEach(() => {
        state = stateContactFormSettings({ title: null });

        jest.spyOn(i18n, 't')
          .mockImplementation(() => 'Contact Us');
      });

      afterEach(() => {
        i18n.t.mockRestore();
      });

      it('returns the value from i18n', () => {
        expect(selectors.getContactFormTitle(state))
          .toEqual('Contact Us');
        expect(i18n.t)
          .toHaveBeenCalledWith('embeddable_framework.submitTicket.form.title.message');
      });
    });
  });
});

describe('getHorizontalPosition', () => {
  let state;

  beforeEach(() => {
    state = {
      base: {
        embeddableConfig: {
          cp4: false,
          position: 'left'
        }
      },
      chat: {
        accountSettings: {
          theme: {}
        }
      },
      settings: {
        styling: {
          positionHorizontal: 'right'
        }
      }
    };
  });

  it('returns from settings if set', () => {
    expect(selectors.getHorizontalPosition(state))
      .toEqual('right');
  });

  it('returns embeddableConfig if settings is not set', () => {
    state.settings.styling.positionHorizontal = null;

    expect(selectors.getHorizontalPosition(state))
      .toEqual('left');
  });
});

describe('getAttachmentsEnabled', () => {
  it('returns true when settings and config attachments are enabled', () => {
    const state = stateAttachmentSettings(true, true);

    expect(selectors.getAttachmentsEnabled(state))
      .toBe(true);
  });

  it('returns false when settings attachments are not enabled', () => {
    const state = stateAttachmentSettings(true, false);

    expect(selectors.getAttachmentsEnabled(state))
      .toBe(false);
  });

  it('returns false when config attachments are not enabled', () => {
    const state = stateAttachmentSettings(false, true);

    expect(selectors.getAttachmentsEnabled(state))
      .toBe(false);
  });
});

describe('getTalkEnabled', () => {
  test.each([
    [true,   true,   'nickname',  false],
    [true,   false,  'nickname',  false],
    [true,   true,   '', false],
    [false,  false,  undefined, false],
    [false,  true,   'nick',  true ]
  ])('when talkSuppressed is %p, && talkEmbed is %p, && talkNickname is %p, it returns %p',
    (suppressed, talkEmbed, talkNickname, expected) => {
      expect(
        selectors.getTalkEnabled.resultFunc(suppressed, talkEmbed, talkNickname)
      ).toEqual(expected);
    }
  );
});

describe('getTalkAvailable', () => {
  test.each([
    [true,   true,   true ],
    [true,   false,  false],
    [false,  false,  false],
    [false,  true,   false]
  ])('when talkEnabled is %p, && configEnabled is %p, it returns %p',
    (talkEnabled, configEnabled, expected) => {
      expect(
        selectors.getTalkAvailable.resultFunc(talkEnabled, configEnabled)
      ).toEqual(expected);
    }
  );
});

describe('getTalkOnline', () => {
  test.each([
    [true,   true,   true ],
    [true,   false,  false],
    [false,  false,  false],
    [false,  true,   false]
  ])('when talkAvailable is %p, && agentsAvailable is %p, it returns %p',
    (talkAvailable, agentsAvailable, expected) => {
      expect(
        selectors.getTalkOnline.resultFunc(talkAvailable, agentsAvailable)
      ).toEqual(expected);
    }
  );
});

describe('getTalkTitle', () => {
  const mockTitle = 'No, you hang up!';
  const callSelector = (title, screen) => (
    selectors.getTalkTitle.resultFunc(title, screen)
  );

  beforeEach(() => {
    jest.spyOn(i18n, 't');
    i18n.getSettingTranslation = jest.fn((tran) => tran);
  });

  afterEach(() => {
    i18n.t.mockRestore();
  });

  describe('when on the SUCCESS_NOTIFICATION_SCREEN', () => {
    describe('when no setting is passed', () => {
      it('returns the default translation', () => {
        callSelector(null, screens.SUCCESS_NOTIFICATION_SCREEN);

        expect(i18n.t).toHaveBeenCalledWith(
          'embeddable_framework.talk.notify.success.title'
        );
      });
    });

    describe('when a setting is passed', () => {
      it('returns the setting', () => {
        const result = callSelector(
          mockTitle, screens.SUCCESS_NOTIFICATION_SCREEN
        );

        expect(result).toEqual(mockTitle);
        expect(i18n.t).not.toHaveBeenCalled();
      });
    });
  });

  describe('when on the PHONE_ONLY_SCREEN', () => {
    describe('when no setting is passed', () => {
      it('returns the default translation', () => {
        callSelector(null, screens.PHONE_ONLY_SCREEN);

        expect(i18n.t).toHaveBeenCalledWith(
          'embeddable_framework.talk.phoneOnly.title'
        );
      });
    });

    describe('when a setting is passed', () => {
      it('returns the setting', () => {
        expect(callSelector(mockTitle, screens.PHONE_ONLY_SCREEN))
          .toEqual(mockTitle);
      });
    });
  });

  describe('when passed any other screen or nonsense', () => {
    const testScreens = [
      screens.CALLBACK_ONLY_SCREEN,
      screens.CALLBACK_AND_PHONE_SCREEN,
      'NONSENSE_SCREEN'
    ];

    describe('when no setting is passed', () => {
      testScreens.forEach((screen) => {
        it('returns the default translation', () => {
          callSelector(null, screen);

          expect(i18n.t).toHaveBeenCalledWith(
            'embeddable_framework.talk.form.title'
          );
        });
      });
    });

    describe('when a setting is passed', () => {
      testScreens.forEach((screen) => {
        it('returns the setting', () => {
          expect(callSelector(mockTitle, screen))
            .toEqual(mockTitle);
        });
      });
    });
  });
});

describe('getTalkNickname', () => {
  const config = {
    props: {
      nickname: 'Support'
    }
  };
  const callSelector = (setting) => (
    selectors.getTalkNickname.resultFunc(setting, config)
  );

  describe('when there is a nickname setting provided', () => {
    it('returns the setting', () => {
      expect(callSelector('setting nickname'))
        .toEqual('setting nickname');
    });
  });

  describe('when there is no setting provided', () => {
    it('returns the default config nickname', () => {
      expect(callSelector(null)).toEqual('Support');
    });
  });
});

describe('getFrameStyle', () => {
  let result,
    frames;

  beforeEach(() => {
    result = null;
    frames = ['webWidget', 'chatPreview', 'webWidgetPreview'];
  });

  const testFrames = (expectedResult) => {
    describe('when frame is ', () => {
      _.forEach(frames, (frame) => {
        it(frame, () => {
          result = selectors.getFrameStyle(getModifiedState(), frame);

          expect(result).toEqual({
            marginLeft: expectedResult,
            marginRight: expectedResult
          });
        });
      });
    });
  };

  describe('when is a known frame', () => {
    describe('when is popout', () => {
      beforeEach(() => {
        jest.spyOn(globals, 'isPopout').mockReturnValue(true);
      });

      afterEach(() => {
        globals.isPopout.mockRestore();
      });

      testFrames('0');
    });

    describe('when not popout', () => {
      beforeEach(() => {
        jest.spyOn(globals, 'isPopout').mockReturnValue(false);
      });

      afterEach(() => {
        globals.isPopout.mockRestore();
      });

      testFrames(8);
    });
  });
  describe('when not a known frame', () => {
    it('when should show chat badge launcher', () => {
      jest.spyOn(devices,'isMobileBrowser').mockReturnValue(false);
      jest.spyOn(zopimChatSelectors, 'getZopimChatOnline').mockReturnValue(true);
      jest.spyOn(chatSelectors, 'getIsChatting').mockReturnValue(false);

      result = selectors.getFrameStyle(getModifiedState());

      expect(result).toEqual({
        height: '210px',
        minHeight: '210px',
        width: '254px',
        minWidth: '254px',
        marginTop: '7px',
        marginBottom: '7px',
        marginLeft: '7px',
        marginRight: '7px',
        zIndex: -11
      });

      devices.isMobileBrowser.mockRestore();
      zopimChatSelectors.getZopimChatOnline.mockRestore();
      chatSelectors.getIsChatting.mockRestore();
    });

    it('when should not show chat badge launcher', () => {
      result = selectors.getFrameStyle(getModifiedState());

      expect(result).toEqual({
        height: '50px',
        marginBottom: '10px',
        marginLeft: '20px',
        marginRight: '20px',
        marginTop: '10px',
        minHeight: '50px',
        zIndex: -11
      });
    });
  });
});

describe('getShowChatBadgeLauncher', () => {
  let result;

  beforeEach(() => {
    jest.spyOn(devices,'isMobileBrowser').mockReturnValue(false);
    jest.spyOn(zopimChatSelectors, 'getZopimChatOnline').mockReturnValue(true);
    jest.spyOn(chatSelectors, 'getIsChatting').mockReturnValue(false);
    jest.spyOn(chatReselectors, 'getShowOfflineChat').mockReturnValue(false);
  });

  afterEach(() => {
    devices.isMobileBrowser.mockRestore();
    zopimChatSelectors.getZopimChatOnline.mockRestore();
    chatSelectors.getIsChatting.mockRestore();
    chatReselectors.getShowOfflineChat.mockRestore();
  });

  it('when should show', () => {
    result = selectors.getShowChatBadgeLauncher(getModifiedState());

    expect(result).toEqual(true);
  });

  describe('should not show because', () => {
    it('is minimized chat badge', () => {
      result = selectors.getShowChatBadgeLauncher(getModifiedState({
        base: { isChatBadgeMinimized: true }
      }));

      expect(result).toEqual(false);
    });

    it('this is not a Standalone', () => {
      result = selectors.getShowChatBadgeLauncher(getModifiedState({
        base: { embeddableConfig: { embeds: { zopimChat: { props: { standalone: false } } } } }
      }));

      expect(result).toEqual(false);
    });

    it('is mobile browser', () => {
      jest.spyOn(devices, 'isMobileBrowser').mockReturnValue(true);
      result = selectors.getShowChatBadgeLauncher(getModifiedState());

      expect(result).toEqual(false);
    });

    it('zopimChat is not online', () => {
      jest.spyOn(zopimChatSelectors, 'getZopimChatOnline').mockReturnValue(false);
      jest.spyOn(chatReselectors, 'getShowOfflineChat').mockReturnValue(true);
      result = selectors.getShowChatBadgeLauncher(getModifiedState());

      expect(result).toEqual(false);
    });

    it('chatBadge is not enabled', () => {
      result = selectors.getShowChatBadgeLauncher(getModifiedState({
        chat: { accountSettings: { banner: { enabled: false  } } }
      }));

      expect(result).toEqual(false);
    });

    it('is chatting', () => {
      result = selectors.getShowChatBadgeLauncher(getModifiedState({
        chat: { is_chatting: true }
      }));

      expect(result).toEqual(false);
    });
  });
});

describe('getMaxWidgetHeight', () => {
  // TODO - When selectors have been split
});

describe('getIsOnInitialDesktopSearchScreen', () => {
  // TODO - When selectors have been split
});

describe('getFixedStyles', () => {
  let result;

  describe('when frame is not webWidget', () => {
    it('returns no style', () => {
      result = selectors.getFixedStyles(getModifiedState(), 'notWebWidget');

      expect(result).toEqual({
      });
    });
  });
  // TODO - Complete when selectors have been split
});

describe('getResetToContactFormOnChatOffline', () => {
  describe('when values are incorrect', () => {
    test.each([
      [false, false, true, true, 'ticketSubmissionForm', true],
      [true, false, true, true, 'ticketSubmissionForm', false],
      [false, true, true, true, 'ticketSubmissionForm', false],
      [false, false, false, true, 'ticketSubmissionForm', false],
      [false, false, true, false, 'ticketSubmissionForm', false],
      [false, false, true, true, 'notTheRightForm', false],
    ])('when passed %p %p %p %p %p return %p',
      (embedName, form, status, chatting, isOpen, expectedValue) => {
        const result = selectors.getResetToContactFormOnChatOffline.resultFunc(
          embedName, form, status, chatting, isOpen);

        expect(result).toEqual(expectedValue);
      });
  });
});

describe('getChatOfflineAvailable', () => {
  let result;

  it('when values are correct', () => {
    result = selectors.getChatOfflineAvailable(getModifiedState());

    expect(result).toEqual(true);
  });

  describe('when values are incorrect', () => {
    test.each([
      ['chatEmbed is null',                   { base: { embeds: { chat: null } } }],
      ['zopimChat is online',                 { zopimChat: { status: 'online' } }],
      ['chat is not enabled in settings',     { settings: { chat: { suppress: true } } }],
      ['offlineForm is disabled in settings', { chat: { accountSettings: { offlineForm: { enabled: false } } } }],
      ['submissionForm embed exists',         { base: { embeds: { ticketSubmissionForm: {} } } }]
    ])('%p', (__title ,input) => {
      result = selectors.getChatOfflineAvailable(getModifiedState(input));

      expect(result).toEqual(false);
    });
  });
});

describe('getShowTalkBackButton', () => {
  test.each([
    ['all values false',              false,  false,  false,  false],
    ['helpcenter embed doesnt exist', true,   false,  false,  true],
    ['chat is not available',         false,  true,   false,  true],
    ['ticket embed does not exist',   false,  false,  true,   true]
  ])('%p', (__title, embedExists, chatIsAvailable, submitTicketEmbedExists, expectedValue) => {
    const result = selectors.getShowTalkBackButton.resultFunc(embedExists, chatIsAvailable, submitTicketEmbedExists);

    expect(result).toEqual(expectedValue);
  });
});

describe('getChatOnline', () => {
  let result;

  test.each([
    ['when neither are online', false, true, false],
    ['when zopimChat is online', true, false, true],
    ['when showOffline is false', false, false, true]
  ])('%p', (__title, zopimOnline, offlineChatVisible, expectedValue) => {
    jest.spyOn(zopimChatSelectors, 'getZopimChatOnline').mockReturnValue(zopimOnline);
    jest.spyOn(chatReselectors, 'getShowOfflineChat').mockReturnValue(offlineChatVisible);
    result = selectors.getChatOnline();

    expect(result).toEqual(expectedValue);
    zopimChatSelectors.getZopimChatOnline.mockRestore();
    chatReselectors.getShowOfflineChat.mockRestore();
  });
});

describe('getChatConnectionSuppressed', () => {
  test.each([
    ['chat delay is enabled',                          true,  false, false, false, false, true],
    ['when chatting and connection suppress is false', true, true, true, false, false, false],
    ['chat is connection suppressed',                  false, false, false, true, false, true],
    ['cookies are disabled',                           false, false, false, true, true, true],
  ])('%p', (
    __title,
    chatConnectOnDemand,
    isChatting,
    chatConnected,
    chatConnectionSuppress,
    cookiesDisabled,
    expectedValue) => {
    const result = selectors.getChatConnectionSuppressed.resultFunc(
      chatConnectOnDemand, isChatting, chatConnected, chatConnectionSuppress, cookiesDisabled);

    expect(result).toEqual(expectedValue);
  });
});

describe('getChatEnabled', () => {
  test.each([
    ['defaultstate', {}, true],
    ['chatEmbed is missing', { base: { embeds: { chat: null } } } , false],
    ['chat is suppressed', { settings: { chat: { suppress: true } } }, false],
    ['chat is connection suppressed', { settings: { chat: { connectionSuppress: true } } }, false],
  ])('%p', (__title, modifier, expectedValue) => {
    const result = selectors.getChatEnabled(getModifiedState(modifier));

    expect(result).toEqual(expectedValue);
  });
});

describe('getChatAvailable', () => {
  test.each([
    ['when values are correct', {}, true],
    ['when chatOffline is unavailable', {
      base: { embeds: { chat: null } },
      settings: { chat: { hideWhenOffline: false } }
    } , false],
    ['when settings hide chat offline', {
      settings: { chat: { hideWhenOffline: true } }
    },false ],
    ['when banned', { chat: { connection: 'closed', vendor: { zChat: { isBanned: () => true } } } }, false]
  ])('%p', (__title, modifier, expectedValue) => {
    const result = selectors.getChatAvailable(getModifiedState(modifier));

    expect(result).toEqual(expectedValue);
  });
});

describe('getShowTicketFormsBackButton', () => {
  test.each([
    ['Values are correct',        true,   [1, 2], 'ticketSubmissionForm', true],
    ['ActiveForm is invalid',     false,  [1, 2], 'ticketSubmissionForm', false],
    ['Less than 2 ticket forms',  true,   [1],    'ticketSubmissionForm', false],
    ['Incorrect embed',           true,   [1, 2], 'notTheRightForm',      false],
  ])('%p', (__title, activeForm, ticketForms, activeEmbed, expectedValue) => {
    const result = selectors.getShowTicketFormsBackButton.resultFunc(activeForm, ticketForms, activeEmbed);

    expect(result).toEqual(expectedValue);
  });
});

describe('getChatConnected', () => {
  let result;

  beforeEach(() => {
    jest.spyOn(zopimChatSelectors, 'getZopimChatConnected').mockReturnValue(false);
    jest.spyOn(chatReselectors, 'getChatConnected').mockReturnValue(false);
  });

  afterEach(() => {
    zopimChatSelectors.getZopimChatConnected.mockRestore();
    chatReselectors.getChatConnected.mockRestore();
  });

  it('when zopimChatConnected is true', () => {
    jest.spyOn(zopimChatSelectors, 'getZopimChatConnected').mockReturnValue(true);
    result = selectors.getChatConnected(getModifiedState());

    expect(result).toEqual(true);
  });

  it('when new chat is connected', () => {
    jest.spyOn(chatReselectors, 'getChatConnected').mockReturnValue(true);
    result = selectors.getChatConnected(getModifiedState());

    expect(result).toEqual(true);
  });

  it('when neither are connected', () => {
    result = selectors.getChatConnected(getModifiedState());

    expect(result).toEqual(false);
  });
});

describe('getChatReady', () => {
  test.each([
    ['when chat embed exists and chat is not connected',        true,   false,  false, false],
    ['when chat embed doesn\'t exist and chat is connected',    false,  false,  false, true],
    ['when chat embed exists exist and chat isn\'t connected',  true,   true,   false, true],
    ['when chat embed exists exist and chat is suppressed',     true,   false,  true,  true],
  ])('%p', (__title, chatEmbed, chatConnected, chatSupressed, expectedValue) => {
    const result = selectors.getChatReady.resultFunc(chatEmbed, chatConnected, chatSupressed);

    expect(result).toEqual(expectedValue);
  });
});

describe('getTalkReady', () => {
  test.each([
    ['talkEmbed exists and talk config isn\'t connected', {}, false, false],
    ['talkEmbed doesn\'t exist', null, false, true],
    ['talk config is connected', {}, true, true],
  ])('%p', (__title, talkEmbedValue, connectedVal, expectedValue) => {
    const result = selectors.getTalkReady({
      base: { embeds: { talk: talkEmbedValue } },
      talk: { embeddableConfig: { connected: connectedVal } }
    });

    expect(result).toEqual(expectedValue);
  });
});

describe('getIsWidgetReady', () => {
  test.each([
    ['all values are false, return false',
      false,  false,  false,  false,  false],
    ['bootupTimeout is true when others are false, return true',
      false,  false,  false,  true,   true],
    ['talkReady is true, others are false, return false',
      true,   false,  false,  false,  false],
    ['chatReady is true, others are false, return false',
      false,  true,   false,  false,  false],
    ['helpCenterReady is true, others are false, return false',
      false,  false,  true,   false,  false],
    ['all values are true, return true',
      true,   true,   true,   false,  true],
  ])('%p', (__title, talkReady, chatReady, hcReady, bootupTimeout, expectedValue) => {
    const result = selectors.getIsWidgetReady.resultFunc(talkReady,chatReady, hcReady, bootupTimeout);

    expect(result).toEqual(expectedValue);
  });
});

describe('getIpmHelpCenterAllowed', () => {
  test.each([
    ['helpCenter is disabled and ipm is allowed, return true', false, { ipmAllowed: true }, true],
    ['helpCenter is enabled and ipm is allowed, return false', true, { ipmAllowed: true }, false],
    ['helpCenter is disabled and ipm is disabled, return false', false, { ipmAllowed: false }, false],
  ])('%p', (__title, helpCenterEnabled, config, expectedValue) => {
    const result = selectors.getIpmHelpCenterAllowed.resultFunc(helpCenterEnabled, config);

    expect(result).toEqual(expectedValue);
  });
});

describe('getSubmitTicketAvailable', () => {
  test.each([
    ['embed exists and not suppressed', true, false, true],
    ['embed doesn\'t exist and not suppressed', false, false, false],
    ['embed exists and is suppressed', true, true, false],
  ])('%p', (__title, submitTicketEmbed, suppressed, expectedValue) => {
    const result = selectors.getSubmitTicketAvailable({
      base: { embeds: { ticketSubmissionForm: submitTicketEmbed } },
      settings: { contactForm: { settings: { suppress: suppressed } } }
    });

    expect(result).toEqual(expectedValue);
  });
});

describe('getChannelChoiceAvailable', () => {
  test.each([
    ['no channels are available and is not chatting',
      false,  false,  false,  false,  false,  false,  false],
    ['all channels are available but is chatting',
      true,   true,   true,   true,   true,   false,  false],
    ['all channels are available and is not chatting',
      true,   true,   true,   true,   true,   false,  true],
    ['talk is available and is not chatting',
      false,  false,  true,   false,  false,  false,  true],
    ['all non-talk channels are available and is not chatting',
      true,   true,   false,  true,   true,   false,  true],
    ['neither channelChoice or talk are available but others are and not chatting',
      false,  true,   false,  true,   true,   false,  false]
  ])('%p', (channelChoiceEnabled, submitTicketAvailable, talkOnline,
    chatAvailable, chatOfflineAvailable, isChatting, expectedValue) => {
    const result = selectors.getChannelChoiceAvailable.resultFunc(
      channelChoiceEnabled, submitTicketAvailable, talkOnline, chatAvailable, chatOfflineAvailable, isChatting);

    expect(result).toEqual(expectedValue);
  });
});

describe('getWebWidgetVisible', () => {
  // TODO when the file has been split, it's too painful right now
});

const stateColorSettings = (
  colors,
  cp4 = false
) => {
  return {
    base: {
      isChatBadgeMinimized: false,
      embeddableConfig: {
        color: '#embeddableConfig',
        textColor: '#embeddableConfigText',
        cp4,
      },
    },
    settings: {
      color: colors
    },
    chat: {
      accountSettings: {
        theme: {
          color: {
            primary: '#chatPrimary',
            banner: '#chatBadgeColor',
          }
        }
      }
    }
  };
};

const stateLauncherColorSettings = (color, cp4Enabled = false) => {
  return _.merge(stateColorSettings(color, cp4Enabled), {
    zopimChat: {},
    base: {
      embeddableConfig: {
        embeds: { zopimChat: { props: { standalone: true } } }
      }
    },
    chat: {
      agents: {},
      rating: {},
      is_chatting: false,
      accountSettings: {
        banner: {
          enabled: true
        },
        rating: {}
      }
    }
  });
};

describe('getColor', () => {
  describe('when the frame is a "webWidget"', () => {
    describe('when it is not a cp4 account', () => {
      describe('settings colors and theme are set', () => {
        it('returns the settings colors', () => {
          const state = stateColorSettings({
            theme: '#abcabc',
            launcher: '#691840',
            launcherText: '#FF4500',
            button: '#555555',
            resultLists: '#111111',
            header: '#203D9D',
            articleLinks: '#123123'
          },
          false);

          const result = selectors.getColor(state, 'webWidget');

          expect(result).toEqual({
            articleLinks: '#123123',
            base: '#abcabc',
            button: '#555555',
            header: '#203D9D',
            launcher: '#691840',
            launcherText: '#FF4500',
            resultLists: '#111111',
            theme: '#abcabc',
            text: '#embeddableConfigText',
          });
        });

        describe('when settings theme is not set', () => {
          it('uses the embeddableConfig color', () => {
            const state = stateColorSettings({
              launcher: '#691840'
            },
            false);

            const result = selectors.getColor(state, 'webWidget');

            expect(result).toEqual({
              launcher: '#691840',
              base: '#embeddableConfig',
              text: '#embeddableConfigText'
            });
          });
        });
      });
    });

    describe('when it is a cp4 account', () => {
      describe('when settings colors are set', () => {
        const state = stateColorSettings({
          theme: '#abcabc',
          launcher: '#691840',
          launcherText: '#FF4500',
          button: '#555555',
          resultLists: '#111111',
          header: '#203D9D',
          articleLinks: '#123123'
        },
        true);

        it('uses the chat settings color', () => {
          const result = selectors.getColor(state, 'webWidget');

          expect(result).toEqual({
            articleLinks: '#123123',
            base: '#abcabc',
            button: '#555555',
            header: '#203D9D',
            launcher: '#691840',
            launcherText: '#FF4500',
            resultLists: '#111111',
            theme: '#abcabc'
          });
        });
      });

      describe('with no settings colors set', () => {
        const state = stateColorSettings({}, true);

        it('uses the chat theme color', () => {
          const result = selectors.getColor(state, 'webWidget');

          expect(result).toEqual({
            base: '#chatPrimary',
          });
        });
      });
    });
  });

  describe('when the frame is a launcher', () => {
    describe('when launcherText is set', () => {
      it('uses the launcherText color', () => {
        const state = stateLauncherColorSettings({
          launcherText: '#555555'
        },
        false);

        const result = selectors.getColor(state, 'launcher');

        expect(result).toEqual({
          base: '#embeddableConfig',
          launcherText: '#555555'
        });
      });
    });

    describe('theme and launcher are set', () => {
      it('uses the launcher color', () => {
        const state = stateLauncherColorSettings({
          theme: '#abcabc',
          launcher: '#691840'
        },
        false);

        const result = selectors.getColor(state, 'launcher');

        expect(result).toEqual({
          base: '#691840',
          launcherText: '#embeddableConfigText'
        });
      });

      describe('settings launcher is not set', () => {
        it('uses the settings theme', () => {
          const state = stateLauncherColorSettings({
            theme: '#abcabc'
          },
          false);

          const result = selectors.getColor(state, 'launcher');

          expect(result).toEqual({
            base: '#abcabc',
            launcherText: '#embeddableConfigText'
          });
        });
      });

      describe('settings colors are not set', () => {
        describe('and chat badge and cp4 are false', () => {
          it('uses the embeddableConfig', () => {
            const state = stateLauncherColorSettings({}, false);

            const result = selectors.getColor(state, 'launcher');

            expect(result).toEqual({
              base: '#embeddableConfig',
              launcherText: '#embeddableConfigText'
            });
          });

          describe('and chat badge is true', () => {
            beforeEach(() => {
              jest.spyOn(devices,'isMobileBrowser').mockReturnValue(false);
              jest.spyOn(chatReselectors, 'getShowOfflineChat').mockReturnValue(false);
            });

            describe('and cp4 is true', () => {
              it('uses the cp4 admin color', () => {
                const state = stateLauncherColorSettings({}, true);

                const result = selectors.getColor(state, 'launcher');

                expect(result).toEqual({
                  base: '#chatBadgeColor',
                  launcherText: '#embeddableConfigText'
                });
              });
            });

            describe('and cp4 is false', () => {
              it('uses the chat badge color', () => {
                const state = stateLauncherColorSettings({}, false);

                const result = selectors.getColor(state, 'launcher');

                expect(result).toEqual({
                  base: '#chatBadgeColor',
                  launcherText: '#embeddableConfigText'
                });
              });
            });
          });
        });
      });
    });
  });
});

describe('getPosition', () => {
  test.each([
    ['chatPhase 4 and position is set', { cp4: true, position: 'l' }, 'ctp', 'ctp'],
    ['not chatPhase 4', { cp4: false, position: 'l' }, 'ctp', 'l'],
    ['chatPhase 4 but chatThemePosition is undefined', { cp4: false, position: 'l' }, undefined, 'l'],
    ['not chatPhase 4 and chatThemePosition is undefined', { cp4: false, position: 'l' }, undefined, 'l'],
  ])('%p', (__title, embeddableConfig, chatThemePosition, expectedValue) => {
    const result = selectors.getPosition.resultFunc(embeddableConfig,chatThemePosition);

    expect(result).toEqual(expectedValue);
  });
});

describe('getLauncherVisible', () => {
  test.each([
    ['all values correct',        true,   true,   false,  false,  true,   true],
    ['launcher is not visible',   false,  true,   false,  false,  true,   false],
    ['channel is not available',  true,   false,  false,  false,  true,   false],
    ['is hidden by hide',         true,   true,   true,   false,  true,   false],
    ['is hidden by activate',     true,   true,   false,  true,   true,   false],
    ['widget is not ready',       true,   true,   false,  false,  false,  false],
  ])('%p', (__title, launcherVisible, channelAvailale, hiddenByHide, hiddenByActivate, widgetReady, expectedValue) => {
    const result = selectors.getLauncherVisible.resultFunc(
      launcherVisible, channelAvailale,hiddenByHide, hiddenByActivate, widgetReady);

    expect(result).toEqual(expectedValue);
  });
});

describe('getWidgetDisplayInfo', () => {
  test.each([
    ['widget is not visible, zopim is not open, launcher is not visible', false, false, false, '', 'hidden'],
    ['launcher is visible', true, false, false, '', LAUNCHER],
    ['widget is visible', false, true, false, 'channelChoice', 'contactOptions'],
    ['zopimChat is active', false, false, true, '', 'chat'],

  ])('%p', (__title, launcherVisible, webWidgetVisible, zopimChatOpen, activeEmbed, expectedValue) => {
    const result = selectors.getWidgetDisplayInfo.resultFunc(
      launcherVisible, webWidgetVisible, zopimChatOpen, activeEmbed);

    expect(result).toEqual(expectedValue);
  });
});

describe('getContactOptionsChatLabelOnline', () => {
  testTranslationStringSelector(selectors.getContactOptionsChatLabelOnline);
});

describe('getContactOptionsChatLabelOffline', () => {
  testTranslationStringSelector(selectors.getContactOptionsChatLabelOffline);
});

describe('getContactOptionsContactFormLabel', () => {
  testTranslationStringSelector(selectors.getContactOptionsContactFormLabel);
});

describe('getContactOptionsButton', () => {
  testTranslationStringSelector(selectors.getContactOptionsButton);
});

describe('getChatConnectionConnecting', () => {
  const state = (enabled, connection, cookies = true) => getModifiedState({
    base: {
      embeds: {
        chat: enabled
      }
    },
    chat: {
      connection
    },
    settings: {
      cookies
    }
  });

  test('chat is not enabled', () => {
    const result = selectors.getChatConnectionConnecting(state(false, ''));

    expect(result).toEqual(false);
  });

  test('chat is closed', () => {
    const result = selectors.getChatConnectionConnecting(state(true, CONNECTION_STATUSES.CLOSED));

    expect(result).toEqual(false);
  });

  test('chat is connecting', () => {
    const result = selectors.getChatConnectionConnecting(state(true, CONNECTION_STATUSES.CONNECTING));

    expect(result).toEqual(true);
  });

  test('cookies is disabled', () => {
    const result = selectors.getChatConnectionConnecting(state(true, CONNECTION_STATUSES.CONNECTING, false));

    expect(result).toEqual(false);
  });
});

