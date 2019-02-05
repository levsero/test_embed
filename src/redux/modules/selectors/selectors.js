import _ from 'lodash';
import { createSelector } from 'reselect';

import {
  getShowOfflineChat,
  getIsChatting,
  getThemeColor as getChatThemeColor,
  getThemePosition as getChatThemePosition,
  getStandaloneMobileNotificationVisible,
  getChatConnected as getNewChatConnected,
  getBadgeColor as getAccountSettingsBadgeColor,
  getHideBranding as getAccountSettingsHideBranding,
  getChatBadgeEnabled } from '../chat/chat-selectors';
import { getOfflineFormEnabled } from 'src/redux/modules/selectors/chat-linked-selectors';
import { getZopimChatOnline,
  getZopimChatConnected,
  getZopimIsChatting,
  getZopimChatOpen } from '../zopimChat/zopimChat-selectors';
import {
  getSettingsChatSuppress,
  getSettingsChatHideWhenOffline,
  getSettingsColorLauncher,
  getSettingsColorLauncherText,
  getSettingsColorTheme,
  getSettingsColor,
  getHelpCenterChatButton,
  getHelpCenterMessageButton,
  getHelpCenterSearchPlaceholder,
  getHelpCenterTitle,
  getStylingPositionHorizontal,
  getStylingZIndex,
  getSettingsContactFormSuppress,
  getSettingsContactFormAttachments,
  getSettingsTalkTitle,
  getSettingsTalkNickname,
  getSettingsTalkSuppress,
  getSettingsContactOptionsEnabled,
  getSettingsContactOptionsButton,
  getSettingsContactOptionsChatLabelOnline,
  getSettingsContactOptionsContactFormLabel,
  getSettingsContactFormTitle,
  getAnswerBotTitle,
  getAnswerBotAvatarName
} from '../settings/settings-selectors';
import {
  getEmbeddableConfigEnabled,
  getAgentAvailability,
  getEmbeddableConfigConnected as getTalkEmbeddableConfigConnected,
  getScreen
} from '../talk/talk-selectors';
import { getActiveTicketForm, getTicketForms } from '../submitTicket/submitTicket-selectors';
import { getActiveEmbed,
  getHelpCenterEmbed,
  getSubmitTicketEmbed,
  getZopimChatEmbed,
  getTalkEmbed,
  getChatEmbed as getNewChatEmbed,
  getIPMWidget,
  getEmbeddableConfig,
  getHiddenByHideAPI,
  getConfigColorBase,
  getConfigColorText,
  getHiddenByActivateAPI,
  getBootupTimeout,
  getWebWidgetVisible as getBaseWebWidgetVisible,
  getLauncherVisible as getBaseLauncherVisible,
  getChatStandalone,
  getUserMinimizedChatBadge,
  getConfigAttachmentsEnabled,
  getLocale,
  getTalkConfig,
  getFormTitleKey,
  getBrand,
  getAnswerBotEnabled
} from '../base/base-selectors';
import {
  getCanShowHelpCenterIntroState,
  getHelpCenterAvailable,
  getHelpCenterReady
} from 'src/redux/modules/selectors/helpCenter-linked-selectors';

import { settings } from 'service/settings';

import { isMobileBrowser } from 'utility/devices';
import { FONT_SIZE } from 'src/constants/shared';
import { EMBED_MAP, LAUNCHER } from 'constants/shared';
import { isPopout } from 'utility/globals';
import { getSettingsLauncherChatLabel, getSettingsLauncherLabel } from '../settings/settings-selectors';
import { i18n } from 'service/i18n';

import { MAX_WIDGET_HEIGHT_NO_SEARCH, WIDGET_MARGIN } from 'src/constants/shared';
import * as screens from 'src/redux/modules/talk/talk-screen-types';

/*
 * Terms:
 * Enabled: When an embed is part of config, not suppressed but does not have all the conditions to be used
 * Available: When an embed is part of config, not suppressed and has all the conditions to be used.
 * Online: When all of the above and there are agents to service the request
 */

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

export const getContactFormTitle = createSelector(
  [getSettingsContactFormTitle, getFormTitleKey, getLocale],
  (contactFormTitle, formTitleKey, _locale) => (
    i18n.getSettingTranslation(contactFormTitle) ||
    i18n.t(`embeddable_framework.submitTicket.form.title.${formTitleKey}`)
  )
);

export const getAnswerBotAvailable = getAnswerBotEnabled;

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

export const getSubmitTicketAvailable = (state) => {
  return getSubmitTicketEmbed(state) && !getSettingsContactFormSuppress(state);
};

const getChannelChoiceEnabled = (state) => {
  return getSettingsContactOptionsEnabled(state) && getSubmitTicketAvailable(state);
};

export const getChatOnline = (state) => getZopimChatOnline(state) || !getShowOfflineChat(state);
export const getChatConnected = (state) => getZopimChatConnected(state) || getNewChatConnected(state);

export const getChatEnabled = (state) => getChatEmbed(state) && !getSettingsChatSuppress(state);
export const getChatReady = createSelector([getChatEmbed, getChatConnected], (chatEmbed, chatConnected) =>
  !chatEmbed || chatConnected);

export const getChatOfflineAvailable = (state) => getChatEnabled(state) &&
  !getChatOnline(state) && getNewChatEmbed(state) && getOfflineFormEnabled(state) && !getSubmitTicketEmbed(state);

export const getResetToContactFormOnChatOffline = createSelector(
  [getZopimChatOnline, getZopimIsChatting, getSubmitTicketEmbed, getZopimChatOpen, getActiveEmbed],
  (zopimChatOnline, zopimChatting, submitTicketEmbed, zopimOpen, activeEmbed) =>
    (
      !zopimChatOnline && !zopimChatting
      && submitTicketEmbed && zopimOpen
      && activeEmbed === 'ticketSubmissionForm'
    )
);

export const getChatAvailable = (state) => {
  const offlineFormOn = getChatOfflineAvailable(state) && !getSettingsChatHideWhenOffline(state);

  return getChatEnabled(state) && (getChatOnline(state) || offlineFormOn);
};
export const getShowTalkBackButton = createSelector(
  [getHelpCenterEmbed, getChatAvailable, getSubmitTicketEmbed],
  (hcEmbed, chatAvailable, submitTicketEmbed) =>
    hcEmbed || chatAvailable || submitTicketEmbed
);
export const getTalkReady = (state) => !getTalkEmbed(state) || getTalkEmbeddableConfigConnected(state);

export const getTalkEnabled = createSelector(
  [getSettingsTalkSuppress, getTalkEmbed],
  (talkSuppressed, talkEmbed) => (
    !talkSuppressed && talkEmbed
  )
);

export const getTalkAvailable = createSelector(
  [getTalkEnabled, getEmbeddableConfigEnabled],
  (talkEnabled, configEnabled) => (
    talkEnabled && configEnabled
  )
);

export const getTalkOnline = createSelector(
  [getTalkAvailable, getAgentAvailability],
  (talkAvailable, agentsAvailable) => (
    talkAvailable && agentsAvailable
  )
);

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

export const getChannelChoiceAvailable = createSelector(
  [
    getChannelChoiceEnabled,
    getSubmitTicketAvailable,
    getTalkOnline,
    getChatAvailable,
    getChatOfflineAvailable,
    getIsChatting
  ],
  (
    channelChoiceEnabled,
    submitTicketAvailable,
    talkAvailable,
    chatAvailable,
    chatOfflineAvailable,
    isChatting
  ) => {
    const channelChoicePrerequisite = channelChoiceEnabled || talkAvailable;
    const availableChannelCount = submitTicketAvailable + talkAvailable + chatAvailable + chatOfflineAvailable;
    const channelsAvailable = availableChannelCount > 1;

    return channelChoicePrerequisite && channelsAvailable && !isChatting;
  }
);

export const getContactOptionsButton = createSelector(
  [getSettingsContactOptionsButton, getLocale],
  (settingsButton, _locale) => (
    i18n.getSettingTranslation(settingsButton) ||
    i18n.t('embeddable_framework.helpCenter.submitButton.label.submitTicket.contact')
  )
);

export const getContactOptionsChatLabelOnline = createSelector(
  [getSettingsContactOptionsChatLabelOnline, getLocale],
  (settingsLabel, _locale) => (
    i18n.getSettingTranslation(settingsLabel) ||
    i18n.t('embeddable_framework.common.button.chat')
  )
);

export const getContactOptionsContactFormLabel = createSelector(
  [getSettingsContactOptionsContactFormLabel, getLocale],
  (settingsLabel, _locale) => (
    i18n.getSettingTranslation(settingsLabel) ||
    i18n.t('embeddable_framework.channelChoice.button.label.submitTicket')
  )
);

const getCoreColor = createSelector(
  [getEmbeddableConfig, getSettingsColorTheme, getChatThemeColor, getConfigColorBase],
  (embeddableConfig, settingsColorTheme, chatThemeColor, configColorBase) => {
    return (embeddableConfig.cp4 && chatThemeColor) ? chatThemeColor : { base: settingsColorTheme || configColorBase };
  }
);

export const getWidgetColor = createSelector(
  [getCoreColor, getSettingsColor],
  (coreColor, settingsColors) => {
    return {
      ...settingsColors,
      ...coreColor
    };
  }
);

export const getShowChatBadgeLauncher = createSelector(
  [ getUserMinimizedChatBadge,
    getChatStandalone,
    getChatOnline,
    getChatBadgeEnabled,
    getIsChatting ],
  (isMinimizedChatBadge, isChatStandalone, chatOnline, chatBadgeEnabled, isChatting) => {
    return !isMinimizedChatBadge &&
      isChatStandalone &&
      !isMobileBrowser() &&
      chatOnline &&
      chatBadgeEnabled &&
      !isChatting;
  }
);

const getBaseColor = createSelector(
  [getSettingsColorLauncher, getShowChatBadgeLauncher, getAccountSettingsBadgeColor, getConfigColorBase],
  (settingsColor, showChatBadge, settingsBadgeColor, configColorBase) => {
    const chatBadgeColor = showChatBadge ? settingsBadgeColor : undefined;

    return settingsColor || chatBadgeColor || configColorBase;
  }
);

const getTextColor = createSelector(
  [getSettingsColorLauncherText, getConfigColorText],
  (settingsColorLauncherText, configColorText) => {
    return settingsColorLauncherText || configColorText;
  }
);

const getLauncherColor = createSelector(
  [getBaseColor, getTextColor],
  (baseColor, textColor) => {
    return {
      base: baseColor,
      launcherText: textColor
    };
  });

export const getColor = (state, frame) => {
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
    getTalkOnline,
    getHelpCenterAvailable,
    getSubmitTicketAvailable ],
  (chatAvailable, talkOnline, helpCenterAvailable, submitTicketAvailable) => {
    return chatAvailable || talkOnline || helpCenterAvailable || submitTicketAvailable;
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

    if (getShowChatBadgeLauncher(state)) {
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

    return defaultFrameStyle;
  }
};

export const getHideZendeskLogo = (state) => {
  return getEmbeddableConfig(state).hideZendeskLogo || getAccountSettingsHideBranding(state);
};

export const getAttachmentsEnabled = (state) => {
  return getConfigAttachmentsEnabled(state) && getSettingsContactFormAttachments(state);
};

export const getTalkTitle = createSelector(
  [getSettingsTalkTitle, getScreen, getLocale],
  (settingsTitle, screen, _locale) => {
    const title = i18n.getSettingTranslation(settingsTitle);

    switch (screen) {
      case screens.SUCCESS_NOTIFICATION_SCREEN:
        return title || i18n.t('embeddable_framework.talk.notify.success.title');
      case screens.PHONE_ONLY_SCREEN:
        return title || i18n.t('embeddable_framework.talk.phoneOnly.title');
      case screens.CALLBACK_ONLY_SCREEN:
      case screens.CALLBACK_AND_PHONE_SCREEN:
      default:
        return title || i18n.t('embeddable_framework.talk.form.title');
    }
  }
);

export const getTalkServiceUrl = createSelector(
  getTalkConfig,
  (config) => config.props.serviceUrl
);

export const getTalkNickname = createSelector(
  [getSettingsTalkNickname, getTalkConfig],
  (settingsNickname, config) => (
    settingsNickname || _.get(config, 'props.nickname')
  )
);

export const getSettingsAnswerBotTitle = createSelector(
  [getAnswerBotTitle, getBrand, getLocale],
  (answerBotTitle, brand, _locale) => (
    i18n.getSettingTranslation(answerBotTitle) || brand
      || i18n.t('embeddable_framework.answerBot.header.title')
  )
);

export const getSettingsAnswerBotAvatarName = createSelector(
  [getAnswerBotAvatarName, getBrand, getLocale],
  (answerBotAvatarName, brand, _locale) => (
    i18n.getSettingTranslation(answerBotAvatarName) || brand
      || i18n.t('embeddable_framework.answerBot.bot.name')
  )
);

export const getChannelAvailable = (state) => {
  return getSubmitTicketAvailable(state) || getTalkOnline(state) || getChatAvailable(state);
};
