import { store } from 'service/persistence';
import { isTokenValid } from 'src/redux/modules/base/helpers/auth';
import _ from 'lodash';
import { createSelector } from 'reselect';
import { isOnHelpCenterPage } from 'utility/pages';

export const getSubmitTicketEmbed = (state) => !!state.base.embeds.ticketSubmissionForm;
export const getZopimChatEmbed = (state) => !!state.base.embeds.zopimChat;
export const getChatEmbed = (state) => !!state.base.embeds.chat;
export const getHelpCenterEmbed = (state) => !!state.base.embeds.helpCenterForm;
export const getTalkEmbed = (state) => !!state.base.embeds.talk;
export const getActiveEmbed = (state) => state.base.activeEmbed;
export const getWidgetShown = (state) => state.base.widgetShown;
export const getIPMWidget = (state) => !!state.base.embeds.ipmWidget;
export const getNewHeight = (state) => !!state.base.arturos.newHeight;

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
    return _.get(embeddableConfig, 'embeds.helpCenterForm.props.contextualHelpEnabled', false);
  }
);
export const getHelpCenterSignInRequired = createSelector(
  getEmbeddableConfig,
  (embeddableConfig) => {
    return _.get(embeddableConfig, 'embeds.helpCenterForm.props.signInRequired', false);
  }
);
export const getQueue = (state) => state.base.queue;
export const getHasPassedAuth = createSelector(
  [getBaseIsAuthenticated, getHelpCenterSignInRequired],
  (isAuthenticated, helpCenterSignInRequired) => {
    return isAuthenticated || !helpCenterSignInRequired || isOnHelpCenterPage();
  }
);
