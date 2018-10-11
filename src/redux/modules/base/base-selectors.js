import { store } from 'service/persistence';
import { isTokenValid } from 'src/redux/modules/base/helpers/auth';
import { createSelector } from 'reselect';
import { isOnHelpCenterPage } from 'utility/pages';
import { EMBED_MAP, LAUNCHER } from 'constants/shared';

const getHiddenByHideAPI = (state) => state.base.hidden.hideApi;
const getHiddenByActivateAPI = (state) => state.base.hidden.activateApi;
const getWebWidgetVisible = (state) => {
  return state.base.webWidgetVisible && !getHiddenByHideAPI(state);
};
const getLauncherVisible = (state) => {
  return state.base.launcherVisible && !getHiddenByHideAPI(state) && !getHiddenByActivateAPI(state);
};

export const getSubmitTicketEmbed = (state) => !!state.base.embeds.ticketSubmissionForm;
export const getZopimChatEmbed = (state) => !!state.base.embeds.zopimChat;
export const getChatEmbed = (state) => !!state.base.embeds.chat;
export const getHelpCenterEmbed = (state) => !!state.base.embeds.helpCenterForm;
export const getTalkEmbed = (state) => !!state.base.embeds.talk;
export const getActiveEmbed = (state) => state.base.activeEmbed;
export const getWidgetShown = (state) => state.base.widgetShown;
export const getIPMWidget = (state) => !!state.base.embeds.ipmWidget;
export const getOnApiListeners = (state) => state.base.onApiListeners;
export const getWidgetInitialised = (state) => state.base.widgetInitialised;

export const getFrameVisible = (state, frame = 'webWidget') => {
  if (frame === 'webWidget') {
    return getWebWidgetVisible(state);
  }
  return getLauncherVisible(state);
};

export const getChatStandalone = (state) => {
  const otherProducts = getSubmitTicketEmbed(state) ||
                        getHelpCenterEmbed(state) ||
                        getTalkEmbed(state);

  return getChatEmbed(state) && !otherProducts;
};

export const getOAuth = () => {
  return store.get('zE_oauth');
};

export const getAuthToken = () => {
  const oauth = getOAuth();

  return (oauth && oauth.token) ? oauth.token : null;
};
export const getHasWidgetShown = (state) => state.base.hasWidgetShown;
export const getBaseIsAuthenticated = () => isTokenValid(getOAuth());
export const getIsAuthenticationPending = (state) => state.base.isAuthenticationPending;
export const getEmbeddableConfig = (state) => state.base.embeddableConfig;
export const getHelpCenterContextualEnabled = createSelector(
  getEmbeddableConfig,
  (embeddableConfig) => {
    return embeddableConfig.embeds.helpCenterForm.props.contextualHelpEnabled;
  }
);
export const getHelpCenterSignInRequired = createSelector(
  getEmbeddableConfig,
  (embeddableConfig) => {
    return embeddableConfig.embeds.helpCenterForm.props.signInRequired;
  }
);
export const getQueue = (state) => state.base.queue;
export const getHasPassedAuth = createSelector(
  [getBaseIsAuthenticated, getHelpCenterSignInRequired],
  (isAuthenticated, helpCenterSignInRequired) => {
    return isAuthenticated || !helpCenterSignInRequired || isOnHelpCenterPage();
  }
);
export const getZopimId = createSelector(
  [getEmbeddableConfig],
  (embeddableConfig) => {
    return embeddableConfig.embeds.zopimChat.props.zopimId;
  }
);
export const getConfigColor = createSelector(
  [getEmbeddableConfig],
  (embeddableConfig) => ({ base: embeddableConfig.color, text: embeddableConfig.textColor })
);
export const getChatOverrideProxy = createSelector(
  [getEmbeddableConfig],
  (embeddableConfig) => {
    return embeddableConfig.embeds.zopimChat.props.overrideProxy;
  }
);
export const getZChatConfig = createSelector(
  [getZopimId, getChatOverrideProxy],
  (zopimId, overrideProxy) => {
    /* eslint-disable camelcase */
    return {
      account_key: zopimId,
      ...(overrideProxy && { override_proxy: overrideProxy })
    };
    /* eslint-enable camelcase */
  }
);
export const getWidgetDisplayInfo = createSelector(
  [getWidgetShown, getActiveEmbed],
  (widgetShown, activeEmbed) => {
    if (widgetShown) {
      return EMBED_MAP[activeEmbed];
    } else {
      return LAUNCHER;
    }
  }
);
