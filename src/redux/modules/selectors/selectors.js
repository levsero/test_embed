import _ from 'lodash'
import { createSelector } from 'reselect'
import { getZendeskHost } from 'utility/globals'

import {
  getShowOfflineChat,
  getIsChatting,
  getThemeColor as getChatThemeColor,
  getThemePosition as getChatThemePosition,
  getStandaloneMobileNotificationVisible,
  getChatConnected,
  getChatConnectionMade,
  getBadgeColor as getAccountSettingsBadgeColor,
  getHideBranding as getAccountSettingsHideBranding,
  getChatBadgeEnabled,
  getChatBanned,
  getChatsLength,
  getConnection as getChatConnection,
  getNotificationCount,
  getShowChatHistory
} from '../chat/chat-selectors'
import {
  getOfflineFormEnabled,
  getDelayChatConnectionEnabled
} from 'src/redux/modules/selectors/chat-linked-selectors'
import { getDeferredChatHasResponse } from 'src/embeds/chat/selectors'
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
  getSettingsChatEmailTranscriptEnabled,
  getCookiesDisabled,
  getSettingsAnswerBotSuppress,
  getSettingsSelectTicketFormLabel
} from '../settings/settings-selectors'
import {
  getEmbeddableConfigEnabled as getTalkEmbeddableConfigEnabled,
  getAgentAvailability,
  getEmbeddableConfigConnected as getTalkEmbeddableConfigConnected,
  isCallbackEnabled,
  getPhoneNumber,
  getDeferredStatusOnline
} from '../talk/talk-selectors'
import {
  getActiveEmbed,
  getHelpCenterEmbed,
  getSubmitTicketEmbed,
  getTalkEmbed,
  getChatEmbed,
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
  getIsChatBadgeMinimized,
  getConfigAttachmentsEnabled,
  getLocale,
  getTalkConfig,
  getFormTitleKey,
  getBrand,
  getBackButtonVisible,
  getHasWidgetShown
} from '../base/base-selectors'
import {
  getCanShowHelpCenterIntroState,
  getHelpCenterAvailable,
  getHelpCenterReady
} from 'src/redux/modules/selectors/helpCenter-linked-selectors'
import {
  getAnswerBotEnabled as getAnswerBotConfigEnabled,
  getButtonLabelKey,
  getFormTitleKey as getHelpCenterFormTitleKey
} from 'src/embeds/helpCenter/selectors'

import { settings } from 'service/settings'

import { isMobileBrowser } from 'utility/devices'
import {
  FONT_SIZE,
  EMBED_MAP,
  LAUNCHER,
  MAX_WIDGET_HEIGHT_NO_SEARCH,
  WIDGET_MARGIN,
  MAX_WIDGET_HEIGHT_NO_SEARCH_NO_ZENDESK_LOGO,
  MAX_WIDGET_HEIGHT
} from 'constants/shared'
import { CONNECTION_STATUSES } from 'constants/chat'
import { isPopout } from 'utility/globals'
import {
  getSettingsLauncherChatLabel,
  getSettingsLauncherLabel
} from '../settings/settings-selectors'
import { i18n } from 'service/i18n'

/*
 * Terms:
 * Enabled: When an embed is part of config, not suppressed but does not have all the conditions to be used
 * Available: When an embed is part of config, not suppressed and has all the conditions to be used.
 * Online: When all of the above and there are agents to service the request
 */

const getLabel = (_, label) => label

export const getTranslation = (translationKey, override) => {
  return i18n.t(translationKey, override)
}

export const getTalkDescriptionLabel = createSelector(
  [getLocale],
  _locale => {
    const descriptionLabel = getTranslation('embeddable_framework.common.textLabel.description')

    return getTranslation('embeddable_framework.validation.label.new_optional', {
      label: descriptionLabel
    })
  }
)

export const getTalkNameLabel = createSelector(
  [getLocale],
  _locale => {
    const nameLabel = getTranslation('embeddable_framework.common.textLabel.name')

    return getTranslation('embeddable_framework.validation.label.new_optional', {
      label: nameLabel
    })
  }
)
export const getSettingsHelpCenterTitle = createSelector(
  [getHelpCenterTitle, getLocale, getHelpCenterFormTitleKey],
  (helpCenterTitle, _locale, formTitleKey) => {
    const labelKey = `embeddable_framework.helpCenter.form.title.${formTitleKey}`
    return i18n.getSettingTranslation(helpCenterTitle) || i18n.t(labelKey)
  }
)

export const getSettingsHelpCenterSearchPlaceholder = createSelector(
  [getHelpCenterSearchPlaceholder, getLocale],
  (helpCenterSearchPlaceholder, _locale) =>
    i18n.getSettingTranslation(helpCenterSearchPlaceholder) ||
    i18n.t('embeddable_framework.helpCenter.search.label.how_can_we_help')
)

export const getHideZendeskLogo = state => {
  return getEmbeddableConfig(state).hideZendeskLogo || getAccountSettingsHideBranding(state)
}

export const getSettingsHelpCenterMessageButton = createSelector(
  [getHelpCenterMessageButton, getLocale, getButtonLabelKey],
  (helpCenterMessageButton, _locale, buttonLabelKey) => {
    const labelKey = `embeddable_framework.helpCenter.submitButton.label.submitTicket.${buttonLabelKey}`
    return i18n.getSettingTranslation(helpCenterMessageButton) || i18n.t(labelKey)
  }
)

export const getSettingsHelpCenterChatButton = createSelector(
  [getHelpCenterChatButton, getLocale],
  (helpCenterChatButton, _locale) =>
    i18n.getSettingTranslation(helpCenterChatButton) ||
    i18n.t('embeddable_framework.common.button.chat')
)

export const getContactFormTitle = createSelector(
  [getSettingsContactFormTitle, getFormTitleKey, getLocale],
  (contactFormTitle, formTitleKey, _locale) =>
    i18n.getSettingTranslation(contactFormTitle) ||
    i18n.t(`embeddable_framework.submitTicket.form.title.${formTitleKey}`)
)

export const getSelectTicketFormLabel = createSelector(
  [getSettingsSelectTicketFormLabel, getLocale],
  (settingsSelectTicketFormLabel, _locale) =>
    i18n.getSettingTranslation(settingsSelectTicketFormLabel) ||
    i18n.t('embeddable_framework.submitTicket.ticketForms.title')
)

export const getLauncherChatLabel = createSelector(
  [getSettingsLauncherChatLabel, getLocale],
  (settingsLauncherChatLabel, _locale) =>
    i18n.getSettingTranslation(settingsLauncherChatLabel) ||
    i18n.t('embeddable_framework.launcher.label.chat')
)

export const getLauncherLabel = createSelector(
  [getSettingsLauncherLabel, getLocale, getLabel],
  (settingsLauncherLabel, _locale, label) =>
    i18n.getSettingTranslation(settingsLauncherLabel) || i18n.t(label)
)

const getWidgetFixedFrameStyles = createSelector(
  [
    getHideZendeskLogo,
    getStandaloneMobileNotificationVisible,
    getIPMWidget,
    getCanShowHelpCenterIntroState
  ],
  (
    hideZendeskLogo,
    standaloneMobileNotificationVisible,
    isUsingIPMWidgetOnly,
    canShowHelpCenterIntroState
  ) => {
    if (isUsingIPMWidgetOnly) {
      return {}
    }

    if (canShowHelpCenterIntroState) {
      const height = hideZendeskLogo
        ? MAX_WIDGET_HEIGHT_NO_SEARCH_NO_ZENDESK_LOGO
        : MAX_WIDGET_HEIGHT_NO_SEARCH

      return {
        maxHeight: `${height + WIDGET_MARGIN}px`,
        minHeight: `${height + WIDGET_MARGIN}px`
      }
    }

    if (standaloneMobileNotificationVisible) {
      return {
        height: `${MAX_WIDGET_HEIGHT + WIDGET_MARGIN / FONT_SIZE}rem`,
        bottom: 0,
        top: 'initial',
        background: 'transparent'
      }
    }

    return {}
  }
)

export const getSubmitTicketAvailable = state => {
  return getSubmitTicketEmbed(state) && !getSettingsContactFormSuppress(state)
}

const getChannelChoiceEnabled = state => {
  return getSettingsContactOptionsEnabled(state) && getSubmitTicketAvailable(state)
}

export const getChatOnline = state => !getShowOfflineChat(state)

export const getChatConnectionSuppressed = createSelector(
  [getIsChatting, getChatConnected, getSettingsChatConnectionSuppress, getCookiesDisabled],
  (isChatting, chatConnected, chatConnectionSuppress, cookiesDisabled) => {
    const chatDelay = cookiesDisabled && !isChatting && !chatConnected

    return chatDelay || chatConnectionSuppress
  }
)

export const getChatEnabled = createSelector(
  [getChatEmbed, getSettingsChatSuppress, getChatConnectionSuppressed],
  (chatEmbed, chatSuppress, chatConnectedConnectionSuppressed) => {
    return chatEmbed && !chatSuppress && !chatConnectedConnectionSuppressed
  }
)

export const getChatEmailTranscriptEnabled = createSelector(
  [getChatsLength, getSettingsChatEmailTranscriptEnabled],
  (chatsLength, emailsTranscriptEnabled) => {
    return chatsLength > 0 && emailsTranscriptEnabled
  }
)

export const getDeferredChatReady = createSelector(
  [getDelayChatConnectionEnabled, getDeferredChatHasResponse],
  (delayChatConnection, deferredChatHasResponse) => {
    return delayChatConnection && deferredChatHasResponse
  }
)

export const getChatReady = createSelector(
  [getChatEmbed, getChatConnectionMade, getChatConnectionSuppressed, getDeferredChatReady],
  (chatEmbed, chatConnectionFinished, chatConnectionSuppressed, deferredChatReady) => {
    return !chatEmbed || chatConnectionFinished || chatConnectionSuppressed || deferredChatReady
  }
)

export const getChatOfflineAvailable = state =>
  getChatEnabled(state) &&
  !getChatOnline(state) &&
  getChatEmbed(state) &&
  getOfflineFormEnabled(state) &&
  !getSubmitTicketEmbed(state)

export const getChatAvailable = state => {
  const offlineFormOn = getChatOfflineAvailable(state) && !getSettingsChatHideWhenOffline(state)

  return getChatEnabled(state) && (getChatOnline(state) || offlineFormOn) && !getChatBanned(state)
}
export const getTalkReady = state => !getTalkEmbed(state) || getTalkEmbeddableConfigConnected(state)

export const getTalkNickname = createSelector(
  [getSettingsTalkNickname, getTalkConfig],
  (settingsNickname, config) => settingsNickname || _.get(config, 'props.nickname')
)

export const getTalkEnabled = createSelector(
  [getSettingsTalkSuppress, getTalkEmbed, getTalkNickname],
  (talkSuppressed, talkEmbed, nickname) => !_.isEmpty(nickname) && !talkSuppressed && talkEmbed
)

export const getTalkAvailable = createSelector(
  [getTalkEnabled, getTalkEmbeddableConfigEnabled, getPhoneNumber, getDeferredStatusOnline],
  (talkEnabled, configEnabled, phoneNumber, deferredTalkOnline) =>
    talkEnabled && configEnabled && (!_.isEmpty(phoneNumber) || deferredTalkOnline)
)

export const getTalkOnline = createSelector(
  [getTalkAvailable, getAgentAvailability, getDeferredStatusOnline],
  (talkAvailable, agentsAvailable, deferredTalkOnline) =>
    talkAvailable && (agentsAvailable || deferredTalkOnline)
)

export const getFixedStyles = (state, frame = 'webWidget') => {
  if (frame === 'webWidget') {
    return getWidgetFixedFrameStyles(state)
  }
  return {}
}

export const getIsOnInitialDesktopSearchScreen = state => {
  return !!getFixedStyles(state, 'webWidget').maxHeight
}

export const getMaxWidgetHeight = (state, frame = 'webWidget') => {
  const fixedStyles = getFixedStyles(state, frame)

  if (getIsOnInitialDesktopSearchScreen(state) && fixedStyles.maxHeight) {
    return parseInt(fixedStyles.maxHeight) - WIDGET_MARGIN
  }

  return undefined
}

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
    const channelChoicePrerequisite = channelChoiceEnabled || talkAvailable
    const availableChannelCount =
      submitTicketAvailable + talkAvailable + chatAvailable + chatOfflineAvailable
    const channelsAvailable = availableChannelCount > 1

    return channelChoicePrerequisite && channelsAvailable && !isChatting
  }
)

export const getShowTalkBackButton = createSelector(
  [getActiveEmbed, getHelpCenterEmbed, getChannelChoiceAvailable],
  (activeEmbed, hcEmbed, channelChoiceAvailable) =>
    activeEmbed === 'talk' && (hcEmbed || channelChoiceAvailable)
)

export const getContactOptionsButton = createSelector(
  [getSettingsContactOptionsButton, getLocale],
  (settingsButton, _locale) =>
    i18n.getSettingTranslation(settingsButton) ||
    i18n.t('embeddable_framework.helpCenter.submitButton.label.submitTicket.contact')
)

export const getContactOptionsChatLabelOnline = createSelector(
  [getSettingsContactOptionsChatLabelOnline, getLocale],
  (settingsLabel, _locale) =>
    i18n.getSettingTranslation(settingsLabel) || i18n.t('embeddable_framework.common.button.chat')
)

export const getContactOptionsChatLabelOffline = createSelector(
  [getSettingsContactOptionsChatLabelOffline, getLocale],
  (settingsLabel, _locale) =>
    i18n.getSettingTranslation(settingsLabel) ||
    i18n.t('embeddable_framework.channelChoice.button.label.chat_offline_v3')
)

export const getContactOptionsContactFormLabel = createSelector(
  [getSettingsContactOptionsContactFormLabel, getLocale],
  (settingsLabel, _locale) =>
    i18n.getSettingTranslation(settingsLabel) ||
    i18n.t('embeddable_framework.channelChoice.button.label.submitTicket')
)

const getCoreColor = createSelector(
  [
    getEmbeddableConfig,
    getSettingsColorTheme,
    getChatThemeColor,
    getConfigColorBase,
    getConfigColorText
  ],
  (embeddableConfig, settingsColorTheme, chatThemeColor, configColorBase, configColorText) => {
    return embeddableConfig.cp4 && chatThemeColor && chatThemeColor.base
      ? { base: settingsColorTheme || chatThemeColor.base }
      : {
          base: settingsColorTheme || configColorBase,
          text: configColorText
        }
  }
)

const getWidgetColor = createSelector(
  [getCoreColor, getSettingsColor],
  (coreColor, settingsColors) => {
    return {
      ...settingsColors,
      ...coreColor
    }
  }
)

export const getShowChatBadgeLauncher = createSelector(
  [
    getIsChatBadgeMinimized,
    getChatStandalone,
    getChatOnline,
    getChatBadgeEnabled,
    getHasWidgetShown
  ],
  (isMinimizedChatBadge, isChatStandalone, chatOnline, chatBadgeEnabled, hasWidgetShown) => {
    return (
      !isMinimizedChatBadge &&
      isChatStandalone &&
      !isMobileBrowser() &&
      chatOnline &&
      chatBadgeEnabled &&
      !hasWidgetShown
    )
  }
)

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
    const chatBadgeColor = showChatBadge ? settingsBadgeColor : undefined
    const cp4Color = embeddableConfig.cp4 && themeColor ? themeColor.base : null

    return settingsColor || settingsThemeColor || chatBadgeColor || cp4Color || configColorBase
  }
)

const getTextColor = createSelector(
  [getSettingsColorLauncherText, getConfigColorText],
  (settingsColorLauncherText, configColorText) => {
    return settingsColorLauncherText || configColorText
  }
)

const getLauncherColor = createSelector(
  [getBaseColor, getTextColor],
  (baseColor, textColor) => {
    return {
      base: baseColor,
      launcherText: textColor
    }
  }
)

export const getColor = (state, frame) => {
  if (frame === 'webWidget') {
    return getWidgetColor(state)
  }

  return getLauncherColor(state)
}

export const getPosition = createSelector(
  [getEmbeddableConfig, getChatThemePosition],
  (embeddableConfig, chatThemePosition) => {
    return embeddableConfig.cp4 && chatThemePosition ? chatThemePosition : embeddableConfig.position
  }
)

export const getHorizontalPosition = createSelector(
  [getStylingPositionHorizontal, getPosition],
  (settingsPosition, configPosition) => {
    return settingsPosition || configPosition
  }
)

export const getIpmHelpCenterAllowed = createSelector(
  getHelpCenterEmbed,
  helpCenterEnabled => {
    return !helpCenterEnabled
  }
)

export const getIsWidgetReady = createSelector(
  [getTalkReady, getChatReady, getHelpCenterReady, getBootupTimeout],
  (talkReady, chatReady, helpCenterReady, bootupTimeout) =>
    (talkReady && chatReady && helpCenterReady) || bootupTimeout
)

const getIsChannelAvailable = createSelector(
  [getChatAvailable, getTalkOnline, getHelpCenterAvailable, getSubmitTicketAvailable],
  (chatAvailable, talkOnline, helpCenterAvailable, submitTicketAvailable) => {
    return chatAvailable || talkOnline || helpCenterAvailable || submitTicketAvailable
  }
)

export const getWebWidgetVisible = state => {
  return getBaseWebWidgetVisible(state) && !getHiddenByHideAPI(state) && getIsWidgetReady(state)
}

export const getLauncherVisible = createSelector(
  [
    getBaseLauncherVisible,
    getIsChannelAvailable,
    getHiddenByHideAPI,
    getHiddenByActivateAPI,
    getIsWidgetReady
  ],
  (launcherVisible, isChannelAvailable, hiddenByHide, hiddenByActivate, isWidgetReady) => {
    return (
      launcherVisible && isChannelAvailable && !hiddenByHide && !hiddenByActivate && isWidgetReady
    )
  }
)

export const getFrameVisible = (state, frame = 'webWidget') => {
  if (frame === 'webWidget' || frame === 'ipmWidget') {
    return getWebWidgetVisible(state)
  }
  return getLauncherVisible(state)
}

export const getWidgetDisplayInfo = createSelector(
  [getLauncherVisible, getWebWidgetVisible, getActiveEmbed],
  (launcherVisible, webWidgetVisible, activeEmbed) => {
    if (webWidgetVisible) {
      return EMBED_MAP[activeEmbed]
    } else if (launcherVisible) {
      return LAUNCHER
    } else {
      return 'hidden'
    }
  }
)

export const getFrameStyle = (state, frame) => {
  if (
    frame === 'webWidget' ||
    frame === 'ipmWidget' ||
    frame === 'chatPreview' ||
    frame === 'webWidgetPreview'
  ) {
    const margin = !isPopout() ? settings.get('margin') : '0'

    return {
      marginLeft: margin,
      marginRight: margin
    }
  } else {
    const defaultFrameStyle = {
      height: '50px',
      minHeight: '50px',
      marginTop: '10px',
      marginBottom: '10px',
      marginLeft: '20px',
      marginRight: '20px',
      zIndex: getStylingZIndex(state) - 1
    }

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
      }
    }

    return defaultFrameStyle
  }
}

export const getAttachmentsEnabled = state => {
  return Boolean(getConfigAttachmentsEnabled(state) && getSettingsContactFormAttachments(state))
}

export const getTalkServiceUrl = createSelector(
  getTalkConfig,
  config => config.props.serviceUrl
)

export const getDeferredTalkApiUrl = createSelector(
  [getTalkServiceUrl, getTalkNickname],
  (talkServiceUrl, nickname) => {
    const subdomain = getZendeskHost(document).split('.')[0]

    return `${talkServiceUrl}/talk_embeddables_service/web/status?subdomain=${subdomain}&nickname=${nickname}`
  }
)

export const getSettingsAnswerBotTitle = createSelector(
  [getAnswerBotTitle, getBrand, getLocale],
  (answerBotTitle, brand, _locale) =>
    i18n.getSettingTranslation(answerBotTitle) ||
    brand ||
    i18n.t('embeddable_framework.answerBot.header.title')
)

export const getSettingsAnswerBotAvatarName = createSelector(
  [getAnswerBotAvatarName, getBrand, getLocale],
  (answerBotAvatarName, brand, _locale) =>
    i18n.getSettingTranslation(answerBotAvatarName) ||
    brand ||
    i18n.t('embeddable_framework.answerBot.bot.name')
)

export const getAnswerBotEnabled = createSelector(
  [getAnswerBotConfigEnabled, getSettingsAnswerBotSuppress],
  (answerBotEnabled, suppress) => !suppress && answerBotEnabled
)

export const getAnswerBotAvailable = getAnswerBotEnabled

export const getChannelAvailable = state => {
  return getSubmitTicketAvailable(state) || getTalkOnline(state) || getChatAvailable(state)
}

export const getChatConnectionConnecting = createSelector(
  [getChatConnection, getChatEmbed, getCookiesDisabled],
  (connection, chatEnabled, cookiesDisabled) =>
    !cookiesDisabled &&
    chatEnabled &&
    (connection === CONNECTION_STATUSES.CONNECTING || connection === '')
)

export const getShowNextButton = createSelector(
  [getSubmitTicketAvailable, getChatAvailable, getTalkOnline],
  (submitTicketAvailable, chatAvailable, talkOnline) =>
    submitTicketAvailable || chatAvailable || talkOnline
)

export const getHelpCenterButtonChatLabel = createSelector(
  [
    getSettingsHelpCenterChatButton,
    getNotificationCount,
    getChatOfflineAvailable,
    getSettingsHelpCenterMessageButton
  ],
  (chatButtonLabel, chatNotificationCount, chatOfflineAvailable, messageButtonLabel) => {
    if (chatNotificationCount > 0) {
      return chatNotificationCount > 1
        ? i18n.t('embeddable_framework.common.notification.manyMessages', {
            plural_number: chatNotificationCount
          })
        : i18n.t('embeddable_framework.common.notification.oneMessage')
    } else if (chatOfflineAvailable) {
      return messageButtonLabel
    }
    return chatButtonLabel
  }
)

export const getHelpCenterButtonLabel = createSelector(
  [
    getIsChatting,
    getChannelChoiceAvailable,
    getChatAvailable,
    getChatOfflineAvailable,
    getTalkOnline,
    isCallbackEnabled,
    getContactOptionsButton,
    getHelpCenterButtonChatLabel,
    getSettingsHelpCenterMessageButton
  ],
  (
    isChatting,
    channelChoiceAvailable,
    chatAvailable,
    chatOfflineAvailable,
    talkOnline,
    callbackEnabled,
    contactButtonLabel,
    chatLabel,
    messageLabel
  ) => {
    if (isChatting) {
      return chatLabel
    } else if (channelChoiceAvailable) {
      return contactButtonLabel
    } else if (chatAvailable || chatOfflineAvailable) {
      return chatLabel
    } else if (talkOnline) {
      return callbackEnabled
        ? i18n.t('embeddable_framework.helpCenter.submitButton.label.callback')
        : i18n.t('embeddable_framework.helpCenter.submitButton.label.phone')
    }
    return messageLabel
  }
)

export const getShowBackButton = createSelector(
  [getShowChatHistory, getBackButtonVisible, getShowTalkBackButton, getActiveEmbed],
  (showChatHistory, backButtonVisible, showTalkBackButton, activeEmbed) =>
    (showChatHistory || backButtonVisible || showTalkBackButton) && activeEmbed !== 'helpCenterForm'
)
