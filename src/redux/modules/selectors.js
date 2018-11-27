import { createSelector } from 'reselect';

import { getShowOfflineChat,
  getOfflineFormEnabled,
  getIsChatting,
  getThemeColor as getChatThemeColor,
  getThemePosition as getChatThemePosition,
  getStandaloneMobileNotificationVisible,
  getChatConnected as getNewChatConnected,
  getBadgeColor as getAccountSettingsBadgeColor,
  getChatBadgeEnabled } from './chat/chat-selectors';
import { getZopimChatOnline,
  getZopimChatConnected,
  getZopimIsChatting,
  getZopimChatOpen } from './zopimChat/zopimChat-selectors';
import {
  getSettingsChatSuppress,
  getSettingsLauncherSetHideWhenChatOffline,
  getSettingsColorLauncher,
  getSettingsColorLauncherText
} from './settings/settings-selectors';
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
  getLauncherVisible as getBaseLauncherVisible,
  getChatStandalone,
  getUserMinimizedChatBadge } from './base/base-selectors';
import { settings } from 'service/settings';
import { getIsShowHCIntroState } from './helpCenter/helpCenter-selectors';
import { isMobileBrowser } from 'utility/devices';
import { FONT_SIZE } from 'src/constants/shared';
import { EMBED_MAP, LAUNCHER } from 'constants/shared';

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

export const getResetToContactFormOnChatOffline = (state) =>
  !getZopimChatOnline(state) && !getZopimIsChatting(state)
  && getSubmitTicketEmbed(state) && getZopimChatOpen(state)
  && getActiveEmbed(state) === 'ticketSubmissionForm';

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

const getCoreColor = createSelector(
  [getEmbeddableConfig, getConfigColor, getChatThemeColor],
  (embeddableConfig, configColor, chatThemeColor) => {
    return (embeddableConfig.cp4 && chatThemeColor) ? chatThemeColor : configColor;
  }
);

const getWidgetColor = (state) => getCoreColor(state);

export const getChatBadgeColor = (state) => {
  const configColor = getConfigColor(state);

  return {
    base: getSettingsColorLauncher(state) || getAccountSettingsBadgeColor(state) || configColor.base,
    text: getSettingsColorLauncherText(state) || configColor.text
  };
};

const getLauncherColor = (state) => {
  return getShowChatBadgeLauncher(state) ? getChatBadgeColor(state) : getCoreColor(state);
};

export const getColor = (state, frame = 'webWidget') => {
  if (frame === 'webWidget') {
    return getWidgetColor(state);
  }

  return getLauncherColor(state);
};

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

const getShouldHideLauncher = createSelector(
  [getSettingsLauncherSetHideWhenChatOffline, getChatOnline, getChatStandalone],
  (hideLauncherWhenChatOffline, isChatOnline, isChatStandalone) => {
    return hideLauncherWhenChatOffline && !isChatOnline && isChatStandalone;
  }
);

export const getLauncherVisible = createSelector(
  [ getBaseLauncherVisible,
    getIsChannelAvailable,
    getHiddenByHideAPI,
    getHiddenByActivateAPI,
    getIsWidgetReady,
    getShouldHideLauncher ],
  (launcherVisible, isChannelAvailable, hiddenByHide, hiddenByActivate, isWidgetReady, shouldHideLauncher) => {
    return launcherVisible
      && isChannelAvailable
      && !hiddenByHide
      && !hiddenByActivate
      && isWidgetReady
      && !shouldHideLauncher;
  }
);

export const getFrameVisible = (state, frame = 'webWidget') => {
  if (frame === 'webWidget' || frame === 'ipmWidget') {
    return getWebWidgetVisible(state);
  }
  return getLauncherVisible(state);
};

export const getWidgetDisplayInfo = createSelector(
  [getLauncherVisible, getWebWidgetVisible, getZopimChatOpen, getActiveEmbed],
  (launcherVisible, webWidgetVisible, zopimChatOpen, activeEmbed) => {
    if (webWidgetVisible) {
      return EMBED_MAP[activeEmbed];
    } else if (zopimChatOpen) {
      return EMBED_MAP.zopimChat;
    } else if (launcherVisible) {
      return LAUNCHER;
    } else {
      return 'hidden';
    }
  }
);

export const getShowChatBadgeLauncher = createSelector(
  [getUserMinimizedChatBadge, getChatStandalone, getChatOnline, getChatBadgeEnabled, getIsChatting],
  (isMinimizedChatBadge, isChatStandalone, chatOnline, chatBadgeEnabled, isChatting) => {
    return !isMinimizedChatBadge &&
      isChatStandalone &&
      !isMobileBrowser() &&
      chatOnline &&
      chatBadgeEnabled &&
      !isChatting;
  }
);

export const getFrameStyle = (state, frame) => {
  if (frame === 'webWidget' || frame === 'chatPreview' || frame === 'webWidgetPreview') {
    const margin = settings.get('margin');

    return {
      marginLeft: margin,
      marginRight: margin
    };
  } else {
    const defaultFrameStyle = {
      height: '50px',
      minHeight: '50px',
      marginTop: '10px',
      marginBottom: '10px',
      marginLeft: '20px',
      marginRight: '20px',
      zIndex: settings.get('zIndex') - 1
    };

    if (!getShowChatBadgeLauncher(state)) {
      return defaultFrameStyle;
    }

    return {
      ...defaultFrameStyle,
      height: '210px',
      minHeight: '210px',
      width: '254px',
      minWidth: '254px',
      marginTop: '7px',
      marginBottom: '7px',
      marginLeft: '7px',
      marginRight: '7px'
    };
  }
};
