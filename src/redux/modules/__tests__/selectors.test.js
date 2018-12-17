import * as selectors from '../selectors';
import { i18n } from 'service/i18n';

const stateSetting = (settings) => {
  return {
    base: { locale: 'en-US' },
    settings: {
      launcher: {
        settings
      }
    }
  };
};

describe('selectors', () => {
  describe('getHideZendeskLogo', () => {
    let state;

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
    let state;

    describe('when chatLabel is defined in launcher settings', () => {
      beforeEach(() => {
        state = stateSetting({ chatLabel: { '*': 'chat label' } });
      });

      it('returns the chatLabel', () => {
        expect(selectors.getLauncherChatLabel(state, {}))
          .toEqual('chat label');
      });
    });

    describe('when chatLabel is not defined in launcher settings', () => {
      beforeEach(() => {
        state = stateSetting({ chatLabel: null });

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
    let state;

    describe('when label is defined in launcher settings', () => {
      beforeEach(() => {
        state = stateSetting({  label: { '*': 'launcher label'  } });
      });

      it('returns the label', () => {
        expect(selectors.getLauncherLabel(state, 'help'))
          .toEqual('launcher label');
      });
    });

    describe('when label is not defined in launcher settings', () => {
      beforeEach(() => {
        state = stateSetting({  label: null });

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
});
