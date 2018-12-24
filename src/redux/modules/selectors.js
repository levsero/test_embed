import { createSelector } from 'reselect';

import { getShowOfflineChat,
  getOfflineFormEnabled,
  getIsChatting,
  getThemeColor as getChatThemeColor,
  getThemePosition as getChatThemePosition,
  getStandaloneMobileNotificationVisible,
  getChatConnected as getNewChatConnected,
  getBadgeColor as getAccountSettingsBadgeColor,
  getHideBranding as getAccountSettingsHideBranding,
  getChatBadgeEnabled } from './chat/chat-selectors';
import { getZopimChatOnline,
  getZopimChatConnected,
  getZopimIsChatting,
  getZopimChatOpen } from './zopimChat/zopimChat-selectors';
import {
  getSettingsChatSuppress,
  getSettingsChatHideWhenOffline,
  getSettingsColorLauncher,
  getSettingsColorLauncherText,
  getSettingsHelpCenterSuppress,
  getHelpCenterChatButton,
  getHelpCenterMessageButton,
  getHelpCenterSearchPlaceholder,
  getHelpCenterTitle,
  getStylingPositionHorizontal,
  getStylingZIndex,
  getSettingsContactFormSuppress
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
  getUserMinimizedChatBadge,
  getChatBadgeArturoEnabled } from './base/base-selectors';
import { settings } from 'service/settings';
import { getIsShowHCIntroState } from './helpCenter/helpCenter-selectors';
import { isMobileBrowser } from 'utility/devices';
import { FONT_SIZE } from 'src/constants/shared';
import { EMBED_MAP, LAUNCHER } from 'constants/shared';
import { isPopout } from 'utility/globals';
import { getSettingsLauncherChatLabel, getSettingsLauncherLabel } from './settings/settings-selectors';
import { getLocale } from 'src/redux/modules/base/base-selectors';
import { i18n } from 'service/i18n';

import { MAX_WIDGET_HEIGHT_NO_SEARCH, WIDGET_MARGIN } from 'src/constants/shared';
/*
 * Terms:
 * Available: When an embed is part of config, not suppressed and has all the conditions to be used.
 * Enabled: When an embed is part of config, not suppressed but does not have all the conditions to be used
 */
const getHelpCenterEnabled = createSelector(
  [getHelpCenterEmbed, getSettingsHelpCenterSuppress],
  (helpCenterEmbed, suppress) => {
    return helpCenterEmbed && !suppress;
  }
);

const getLabel = (_, label) => label;

export const getSettingsHelpCenterTitle = createSelector(
  [getHelpCenterTitle, getLocale, getLabel],
  (helpCenterTitle, _locale, label) => (
    i18n.getSettingTranslation(helpCenterTitle) || i18n.t(label)
  )
);

export const getSettingsHelpCenterSearchPlaceholder = createSelector(
  [getHelpCenterSearchPlaceholder, getLocale],
  (helpCenterSearchPlaceholder, _locale) => (
    i18n.getSettingTranslation(helpCenterSearchPlaceholder) ||
    i18n.t('embeddable_framework.helpCenter.search.label.how_can_we_help')
  )
);

export const getSettingsHelpCenterMessageButton = createSelector(
  [getHelpCenterMessageButton, getLocale, getLabel],
  (helpCenterMessageButton, _locale, label) => (
    i18n.getSettingTranslation(helpCenterMessageButton) || i18n.t(label)
  )
);

export const getSettingsHelpCenterChatButton = createSelector(
  [getHelpCenterChatButton, getLocale],
  (helpCenterChatButton, _locale) => (
    i18n.getSettingTranslation(helpCenterChatButton) ||
      i18n.t('embeddable_framework.common.button.chat')
  )
);

export const getHelpCenterAvailable = createSelector(
  [getHelpCenterEnabled, getHasPassedAuth],
  (helpCenterEnabled, hasPassedAuth) => {
    return helpCenterEnabled && hasPassedAuth;
  }
);

export const getHelpCenterReady = (state) => !getHelpCenterEmbed(state) || getHasPassedAuth(state);

export const getLauncherChatLabel = createSelector(
  [getSettingsLauncherChatLabel, getLocale],
  (settingsLauncherChatLabel, _locale) => (
    i18n.getSettingTranslation(settingsLauncherChatLabel) ||
    i18n.t('embeddable_framework.launcher.label.chat')
  )
);

export const getLauncherLabel = createSelector(
  [getSettingsLauncherLabel, getLocale, getLabel],
  (settingsLauncherLabel, _locale, label) => (
    i18n.getSettingTranslation(settingsLauncherLabel) || i18n.t(label)
  )
);

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
        height: `${515/FONT_SIZE}rem`,
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
  const offlineFormOn = getChatOfflineAvailable(state) && !getSettingsChatHideWhenOffline(state);

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
  return getSubmitTicketEmbed(state) && !getSettingsContactFormSuppress(state);
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

export const getHorizontalPosition = createSelector(
  [getStylingPositionHorizontal, getPosition],
  (settingsPosition, configPosition) => {
    return settingsPosition || configPosition;
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
  [ getUserMinimizedChatBadge,
    getChatStandalone,
    getChatOnline,
    getChatBadgeEnabled,
    getIsChatting,
    getChatBadgeArturoEnabled ],
  (isMinimizedChatBadge, isChatStandalone, chatOnline, chatBadgeEnabled, isChatting, arturoEnabled) => {
    return arturoEnabled &&
      !isMinimizedChatBadge &&
      isChatStandalone &&
      !isMobileBrowser() &&
      chatOnline &&
      chatBadgeEnabled &&
      !isChatting;
  }
);

export const getFrameStyle = (state, frame) => {
  if (frame === 'webWidget' || frame === 'chatPreview' || frame === 'webWidgetPreview') {
    const margin = !isPopout() ? settings.get('margin') : '0';

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
      zIndex: getStylingZIndex(state) - 1
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

export const getHideZendeskLogo = (state) => {
  return getEmbeddableConfig(state).hideZendeskLogo || getAccountSettingsHideBranding(state);
};
