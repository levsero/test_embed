import * as selectors from '../selectors';
import { i18n } from 'service/i18n';

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
