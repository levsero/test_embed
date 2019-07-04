import _ from 'lodash';
import { createSelector } from 'reselect';

import {
  getShowOfflineChat,
  getIsChatting,
  getThemeColor as getChatThemeColor,
  getThemePosition as getChatThemePosition,
  getStandaloneMobileNotificationVisible,
  getChatConnected as getNewChatConnected,
  getChatConnectionMade,
  getBadgeColor as getAccountSettingsBadgeColor,
  getHideBranding as getAccountSettingsHideBranding,
  getChatBadgeEnabled,
  getChatBanned,
  getConnection as getChatConnection
} from '../chat/chat-selectors';
import { getOfflineFormEnabled } from 'src/redux/modules/selectors/chat-linked-selectors';
import {
  getZopimChatOnline,
  getZopimChatConnected,
  getZopimIsChatting,
  getZopimChatOpen
} from '../zopimChat/zopimChat-selectors';
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
  getSettingsContactOptionsChatLabelOffline,
  getSettingsContactOptionsContactFormLabel,
  getSettingsContactFormTitle,
  getAnswerBotTitle,
  getAnswerBotAvatarName,
  getSettingsChatConnectionSuppress,
  getSettingsChatConnectOnDemand,
  getCookiesDisabled,
  getSettingsAnswerBotSuppress,
  getSettingsSelectTicketFormLabel
} from '../settings/settings-selectors';
import {
  getEmbeddableConfigEnabled as getTalkEmbeddableConfigEnabled,
  getAgentAvailability,
  getEmbeddableConfigConnected as getTalkEmbeddableConfigConnected,
  getScreen
} from '../talk/talk-selectors';
import { getActiveTicketForm, getTicketForms } from '../submitTicket/submitTicket-selectors';
import {
  getActiveEmbed,
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
  getBrand
} from '../base/base-selectors';
import {
  getCanShowHelpCenterIntroState,
  getHelpCenterAvailable,
  getHelpCenterReady
} from 'src/redux/modules/selectors/helpCenter-linked-selectors';

import { settings } from 'service/settings';

import { isMobileBrowser } from 'utility/devices';
import { FONT_SIZE, EMBED_MAP, LAUNCHER, MAX_WIDGET_HEIGHT_NO_SEARCH, WIDGET_MARGIN } from 'constants/shared';
import { CONNECTION_STATUSES } from 'constants/chat';
import { isPopout } from 'utility/globals';
import { getSettingsLauncherChatLabel, getSettingsLauncherLabel } from '../settings/settings-selectors';
import { i18n } from 'service/i18n';

import * as screens from 'src/redux/modules/talk/talk-screen-types';

/*
 * Terms:
 * Enabled: When an embed is part of config, not suppressed but does not have all the conditions to be used
 * Available: When an embed is part of config, not suppressed and has all the conditions to be used.
 * Online: When all of the above and there are agents to service the request
 */

const getLabel = (_, label) => label;

export const getTalkDescriptionLabel = createSelector(
  [getLocale],
  (_locale) => {
    const descriptionLabel = getTranslation('embeddable_framework.common.textLabel.description');

    return getTranslation('embeddable_framework.validation.label.new_optional', { label: descriptionLabel });
  }
);

export const getTranslation = (translationKey, override) => {
  return i18n.t(translationKey, override);
};

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

export const getSelectTicketFormLabel = createSelector(
  [getSettingsSelectTicketFormLabel, getLocale],
  (settingsSelectTicketFormLabel, _locale) => (
    i18n.getSettingTranslation(settingsSelectTicketFormLabel) ||
    i18n.t('embeddable_framework.submitTicket.ticketForms.title')
  )
);

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

export const getChatConnectionSuppressed = createSelector(
  [getSettingsChatConnectOnDemand,
    getIsChatting,
    getChatConnected,
    getSettingsChatConnectionSuppress,
    getCookiesDisabled],
  (chatConnectOnDemand, isChatting, chatConnected, chatConnectionSuppress, cookiesDisabled) => {
    const chatDelay = (chatConnectOnDemand || cookiesDisabled) && !isChatting && !chatConnected;

    return chatDelay || chatConnectionSuppress;
  }
);

export const getChatEnabled = createSelector(
  [getChatEmbed, getSettingsChatSuppress, getChatConnectionSuppressed],
  (chatEmbed, chatSuppress, chatConnectedConnectionSuppressed) => {
    return chatEmbed && !chatSuppress && !chatConnectedConnectionSuppressed;
  }
);

export const getChatReady = createSelector(
  [getChatEmbed, getChatConnectionMade, getChatConnectionSuppressed],
  (chatEmbed, chatConnectionFinished, chatConnectionSuppressed) => {
    return !chatEmbed || chatConnectionFinished || chatConnectionSuppressed;
  }
);

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

  return getChatEnabled(state) && (getChatOnline(state) || offlineFormOn) && !getChatBanned(state);
};
export const getShowTalkBackButton = createSelector(
  [getHelpCenterEmbed, getChatAvailable, getSubmitTicketEmbed],
  (hcEmbed, chatAvailable, submitTicketEmbed) =>
    hcEmbed || chatAvailable || submitTicketEmbed
);
export const getTalkReady = (state) => !getTalkEmbed(state) || getTalkEmbeddableConfigConnected(state);

export const getTalkNickname = createSelector(
  [getSettingsTalkNickname, getTalkConfig],
  (settingsNickname, config) => (
    settingsNickname || _.get(config, 'props.nickname')
  )
);

export const getTalkEnabled = createSelector(
  [getSettingsTalkSuppress, getTalkEmbed, getTalkNickname],
  (talkSuppressed, talkEmbed, nickname) => (
    !_.isEmpty(nickname) && !talkSuppressed && talkEmbed
  )
);

export const getTalkAvailable = createSelector(
  [getTalkEnabled, getTalkEmbeddableConfigEnabled],
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

export const getContactOptionsChatLabelOffline = createSelector(
  [getSettingsContactOptionsChatLabelOffline, getLocale],
  (settingsLabel, _locale) => (
    i18n.getSettingTranslation(settingsLabel) ||
    i18n.t('embeddable_framework.channelChoice.button.label.chat_offline_v3')
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
  [getEmbeddableConfig, getSettingsColorTheme, getChatThemeColor, getConfigColorBase, getConfigColorText],
  (embeddableConfig, settingsColorTheme, chatThemeColor, configColorBase, configColorText) => {
    return (embeddableConfig.cp4 && chatThemeColor) ?
      { base: (settingsColorTheme || chatThemeColor.base) } :
      {
        base: settingsColorTheme || configColorBase,
        text: configColorText
      };
  }
);

const getWidgetColor = createSelector(
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
  [
    getSettingsColorLauncher,
    getShowChatBadgeLauncher,
    getAccountSettingsBadgeColor,
    getConfigColorBase,
    getSettingsColorTheme,
    getChatThemeColor,
    getEmbeddableConfig
  ],
  (
    settingsColor,
    showChatBadge,
    settingsBadgeColor,
    configColorBase,
    settingsThemeColor,
    themeColor,
    embeddableConfig
  ) => {
    const chatBadgeColor = showChatBadge ? settingsBadgeColor : undefined;
    const cp4Color = (embeddableConfig.cp4 && themeColor) ? themeColor.base : null;

    return settingsColor || settingsThemeColor || chatBadgeColor || cp4Color || configColorBase;
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
  getHelpCenterEmbed,
  (helpCenterEnabled) => {
    return !helpCenterEnabled;
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
  if (frame === 'webWidget' || frame === 'ipmWidget' || frame === 'chatPreview' || frame === 'webWidgetPreview') {
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

export const getAnswerBotEnabled = createSelector(
  [getEmbeddableConfig, getSettingsAnswerBotSuppress],
  (embeddableConfig, suppress) => (
    !suppress && embeddableConfig.embeds.helpCenterForm.props.answerBotEnabled
  )
);

export const getAnswerBotAvailable = getAnswerBotEnabled;

export const getChannelAvailable = (state) => {
  return getSubmitTicketAvailable(state) || getTalkOnline(state) || getChatAvailable(state);
};

export const getChatConnectionConnecting = createSelector(
  [getChatConnection, getNewChatEmbed, getCookiesDisabled],
  (connection, chatEnabled, cookiesDisabled) => (
    !cookiesDisabled && chatEnabled && (connection === CONNECTION_STATUSES.CONNECTING || connection === '')
  )
);
