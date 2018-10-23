import { createSelector } from 'reselect';

import { getShowOfflineChat,
  getOfflineFormEnabled,
  getIsChatting,
  getThemeColor as getChatThemeColor,
  getThemePosition as getChatThemePosition,
  getStandaloneMobileNotificationVisible,
  getChatConnected as getNewChatConnected } from './chat/chat-selectors';
import { getZopimChatOnline, getZopimChatConnected } from './zopimChat/zopimChat-selectors';
import { getSettingsChatSuppress } from './settings/settings-selectors';
import {
  getEmbeddableConfigEnabled,
  getAgentAvailability,
  getEmbeddableConfigConnected } from './talk/talk-selectors';
import { getActiveTicketForm, getTicketForms } from './submitTicket/submitTicket-selectors';
import { getActiveEmbed,
  getHelpCenterEmbed,
  getSubmitTicketEmbed,
  getZopimChatEmbed,
  getTalkEmbed,
  getChatEmbed as getNewChatEmbed,
  getIPMWidget,
  getHasPassedAuth,
  getEmbeddableConfig,
  getHiddenByHideAPI,
  getConfigColor,
  getHiddenByActivateAPI,
  getBootupTimeout,
  getWebWidgetVisible as getBaseWebWidgetVisible,
  getLauncherVisible as getBaseLauncherVisible } from './base/base-selectors';
import { settings } from 'service/settings';
import { getIsShowHCIntroState } from './helpCenter/helpCenter-selectors';
import { isMobileBrowser } from 'utility/devices';
import { FONT_SIZE } from 'src/constants/shared';

import { MAX_WIDGET_HEIGHT_NO_SEARCH, WIDGET_MARGIN } from 'src/constants/shared';
/*
 * Terms:
 * Available: When an embed is part of config, not suppressed and has all the conditions to be used.
 * Enabled: When an embed is part of config, not suppressed but does not have all the conditions to be used
 */
const getHelpCenterEnabled = createSelector(
  [getHelpCenterEmbed],
  (helpCenterEmbed) => {
    const notSuppressed = !settings.get('helpCenter.suppress');

    return helpCenterEmbed && notSuppressed;
  }
);

export const getHelpCenterAvailable = createSelector(
  [getHelpCenterEnabled, getHasPassedAuth],
  (helpCenterEnabled, hasPassedAuth) => {
    return helpCenterEnabled && hasPassedAuth;
  }
);

export const getHelpCenterReady = (state) => !getHelpCenterEmbed(state) || getHasPassedAuth(state);

const getChatEmbed = (state) => getNewChatEmbed(state) || getZopimChatEmbed(state);
const getCanShowHelpCenterIntroState = createSelector(
  [getIsShowHCIntroState,
    getHelpCenterAvailable,
    getActiveEmbed],
  (isShowHCIntroState,
    isHelpCenterAvailable,
    activeEmbed) => {
    return !isMobileBrowser() && isShowHCIntroState && isHelpCenterAvailable && activeEmbed === 'helpCenterForm';
  }
);

const getWidgetFixedFrameStyles = createSelector(
  [getStandaloneMobileNotificationVisible,
    getIPMWidget,
    getCanShowHelpCenterIntroState],
  (standaloneMobileNotificationVisible,
    isUsingIPMWidgetOnly,
    canShowHelpCenterIntroState) => {
    if (isUsingIPMWidgetOnly) {
      return {};
    }

    if (canShowHelpCenterIntroState) {
      return {
        maxHeight: `${MAX_WIDGET_HEIGHT_NO_SEARCH + WIDGET_MARGIN}px`
      };
    }

    if (standaloneMobileNotificationVisible) {
      return {
        height: `${335/FONT_SIZE}rem`,
        bottom: 0,
        top: 'initial',
        background: 'transparent'
      };
    }

    return {};
  }
);
const getChannelChoiceEnabled = (state) => {
  return settings.get('contactOptions').enabled && getSubmitTicketAvailable(state);
};

export const getChatOnline = (state) => getZopimChatOnline(state) || !getShowOfflineChat(state);
export const getChatConnected = (state) => getZopimChatConnected(state) || getNewChatConnected(state);

export const getChatEnabled = (state) => getChatEmbed(state) && !getSettingsChatSuppress(state);
export const getChatReady = (state) => !getChatEmbed(state) || getChatConnected(state);

export const getChatOfflineAvailable = (state) => getChatEnabled(state) &&
  !getChatOnline(state) && getNewChatEmbed(state) && getOfflineFormEnabled(state) && !getSubmitTicketEmbed(state);

export const getChatAvailable = (state) => {
  const offlineFormOn = getChatOfflineAvailable(state);

  return getChatEnabled(state) && (getChatOnline(state) || offlineFormOn);
};
export const getShowTalkBackButton = (state) => {
  return getHelpCenterEmbed(state) || getChatAvailable(state) || getSubmitTicketEmbed(state);
};
export const getTalkEnabled = (state) => getTalkEmbed(state) && getEmbeddableConfigEnabled(state);
export const getTalkReady = (state) => !getTalkEmbed(state) || getEmbeddableConfigConnected(state);
export const getTalkAvailable = (state) => {
  return getTalkEnabled(state) && getAgentAvailability(state);
};
export const getShowTicketFormsBackButton = createSelector(
  [getActiveTicketForm, getTicketForms, getActiveEmbed],
  (activeForm, ticketForms, activeEmbed) => {
    return activeForm && ticketForms.length > 1 && activeEmbed === 'ticketSubmissionForm';
  }
);

export const getTalkStandalone = (state) => {
  return getTalkEnabled(state) && !getChatEmbed(state) && !getHelpCenterEmbed(state) && !getSubmitTicketEmbed(state);
};

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

export const getSubmitTicketAvailable = (state) => {
  return getSubmitTicketEmbed(state) && !settings.get('contactForm.suppress');
};

export const getChannelChoiceAvailable = createSelector(
  [getChannelChoiceEnabled,
    getSubmitTicketAvailable,
    getTalkAvailable,
    getChatAvailable,
    getChatOfflineAvailable,
    getIsChatting],
  (channelChoiceEnabled, submitTicketAvailable, talkAvailable, chatAvailable, chatOfflineAvailable, isChatting) => {
    const channelChoicePrerequisite = (channelChoiceEnabled || talkAvailable);
    const availableChannelCount = (submitTicketAvailable + talkAvailable + chatAvailable + chatOfflineAvailable);
    const channelsAvailable = (availableChannelCount > 1);

    return channelChoicePrerequisite && channelsAvailable && !isChatting;
  }
);

export const getColor = createSelector(
  [getEmbeddableConfig, getConfigColor, getChatThemeColor],
  (embeddableConfig, configColor, chatThemeColor) => {
    return (embeddableConfig.cp4 && chatThemeColor) ? chatThemeColor : configColor;
  }
);

export const getPosition = createSelector(
  [getEmbeddableConfig, getChatThemePosition],
  (embeddableConfig, chatThemePosition) => {
    return (embeddableConfig.cp4 && chatThemePosition) ? chatThemePosition : embeddableConfig.position;
  }
);

export const getIpmHelpCenterAllowed = createSelector(
  [getHelpCenterEmbed, getEmbeddableConfig],
  (helpCenterEnabled, config) => {
    return !helpCenterEnabled && config.ipmAllowed;
  }
);

export const getIsWidgetReady = createSelector(
  [ getTalkReady,
    getChatReady,
    getHelpCenterReady,
    getBootupTimeout ],
  (talkReady, chatReady, helpCenterReady, bootupTimeout) => {
    return (talkReady && chatReady && helpCenterReady) || bootupTimeout;
  }
);

const getIsChannelAvailable = createSelector(
  [ getChatAvailable,
    getTalkAvailable,
    getHelpCenterAvailable,
    getSubmitTicketAvailable ],
  (chatAvailable, talkAvailable, helpCenterAvailable, submitTicketAvailable) => {
    return chatAvailable || talkAvailable || helpCenterAvailable || submitTicketAvailable;
  }
);

export const getWebWidgetVisible = (state) => {
  return getBaseWebWidgetVisible(state)
    && !getHiddenByHideAPI(state)
    && getIsWidgetReady(state);
};
export const getLauncherVisible = createSelector(
  [ getBaseLauncherVisible,
    getIsChannelAvailable,
    getHiddenByHideAPI,
    getHiddenByActivateAPI,
    getIsWidgetReady ],
  (launcherVisible, isChannelAvailable, hiddenByHide, hiddenByActivate, isWidgetReady) => {
    return launcherVisible
      && isChannelAvailable
      && !hiddenByHide
      && !hiddenByActivate
      && isWidgetReady;
  }
);

export const getFrameVisible = (state, frame = 'webWidget') => {
  if (frame === 'webWidget' || frame === 'ipmWidget') {
    return getWebWidgetVisible(state);
  }
  return getLauncherVisible(state);
};
