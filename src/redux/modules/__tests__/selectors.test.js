import * as selectors from 'src/redux/modules/selectors';
import * as screens from 'src/redux/modules/talk/talk-screen-types';
import { i18n } from 'src/service/i18n';

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
    [true,   true,   false],
    [true,   false,  false],
    [false,  false,  false],
    [false,  true,   true ]
  ])('when talkSuppressed is %p, && talkEmbed is %p, it returns %p',
    (suppressed, talkEmbed, expected) => {
      expect(
        selectors.getTalkEnabled.resultFunc(suppressed, talkEmbed)
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
