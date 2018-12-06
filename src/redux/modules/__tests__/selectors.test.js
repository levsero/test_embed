import * as selectors from '../selectors';

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
