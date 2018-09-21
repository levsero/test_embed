import { createSelector } from 'reselect';

import { getShowOfflineChat,
  getOfflineFormEnabled,
  getStandaloneMobileNotificationVisible } from './chat/chat-selectors';
import { getZopimChatOnline } from './zopimChat/zopimChat-selectors';
import { getSettingsChatSuppress } from './settings/settings-selectors';
import { getEmbeddableConfigEnabled, getAgentAvailability } from './talk/talk-selectors';
import { getActiveTicketForm, getTicketForms } from './submitTicket/submitTicket-selectors';
import { getActiveEmbed,
  getHelpCenterEmbed,
  getSubmitTicketEmbed,
  getZopimChatEmbed,
  getTalkEmbed,
  getChatEmbed as getNewChatEmbed,
  getIPMWidget } from './base/base-selectors';

import { settings } from 'service/settings';
import { getHasSearched,
  getContextualHelpRequestNeeded,
  getArticleViewActive } from './helpCenter/helpCenter-selectors';
import { isMobileBrowser } from 'utility/devices';

import { MAX_WIDGET_HEIGHT_NO_SEARCH, WIDGET_MARGIN } from 'src/constants/shared';
/*
 * Terms:
 * Available: When an embed is part of config, not suppressed and has all the conditions to be used.
 * Enabled: When an embed is part of config, not suppressed but does not have all the conditions to be used
 */

const getChatEmbed = (state) => getNewChatEmbed(state) || getZopimChatEmbed(state);
const getWidgetFixedFrameStyles = createSelector(
  [getStandaloneMobileNotificationVisible,
    getHasSearched,
    getContextualHelpRequestNeeded,
    getIPMWidget,
    getArticleViewActive,
    getHelpCenterEmbed],
  (standaloneMobileNotificationVisible,
    hasSearched, contextualHelpRequestNeeded,
    isUsingIPMWidgetOnly,
    articleViewActive,
    helpCenterEnabled) => {
    if (isUsingIPMWidgetOnly) {
      return {};
    }

    const hcSuppressed = settings.get('helpCenter.suppress');

    if (!hcSuppressed && !isMobileBrowser() && helpCenterEnabled && !hasSearched &&
        !contextualHelpRequestNeeded && !articleViewActive) {
      return {
        maxHeight: `${MAX_WIDGET_HEIGHT_NO_SEARCH + WIDGET_MARGIN}px`
      };
    }

    if (standaloneMobileNotificationVisible) {
      return {
        height: '33%',
        background: 'transparent'
      };
    }
    return {};
  }
);

export const getChatOnline = (state) => getZopimChatOnline(state) || !getShowOfflineChat(state);

export const getChatEnabled = (state) => getChatEmbed(state) && !getSettingsChatSuppress(state);

export const getChatOfflineAvailable = (state) => getChatEnabled(state) &&
  !getChatOnline(state) && getNewChatEmbed(state) && getOfflineFormEnabled(state) && !getSubmitTicketEmbed(state);

export const getChatAvailable = (state) => getChatEnabled(state) && getChatOnline(state);
export const getShowTalkBackButton = (state) => {
  return getHelpCenterEmbed(state) || getChatAvailable(state) || getSubmitTicketEmbed(state);
};
export const getTalkEnabled = (state) => getTalkEmbed(state) && getEmbeddableConfigEnabled(state);
export const getTalkAvailable = (state) => getTalkEnabled(state) && getAgentAvailability(state);
export const getShowTicketFormsBackButton = createSelector(
  [getActiveTicketForm, getTicketForms, getActiveEmbed],
  (activeForm, ticketForms, activeEmbed) => {
    return activeForm && ticketForms.length > 1 && activeEmbed === 'ticketSubmissionForm';
  }
);

export const getFixedStyles = (state, frame = 'webWidget') => {
  if (frame === 'webWidget') {
    return getWidgetFixedFrameStyles(state);
  }
  return {};
};

export const getIsOnInitialDesktopSearchScreen = (state) => {
  return !!getFixedStyles(state, 'webWidget').maxHeight;
};

export const getMaxWidgetHeight = (state, frame = 'webWidget') => {
  const fixedStyles = getFixedStyles(state, frame);

  if (getIsOnInitialDesktopSearchScreen(state) && fixedStyles.maxHeight) {
    return parseInt(fixedStyles.maxHeight) - WIDGET_MARGIN;
  }

  return undefined;
};
