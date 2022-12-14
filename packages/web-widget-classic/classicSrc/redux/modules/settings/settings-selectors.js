import _ from 'lodash'
import { createSelector } from 'reselect'

export const getSettingsMobileNotificationsDisabled = (state) =>
  state.settings.chat.mobileNotificationsDisabled

// ROOT
export const getAnalyticsDisabled = (state) => !state.settings.analytics
export const getCookiesDisabled = (state) => !state.settings.cookies

// CHAT
export const getRawSettingsChatDepartment = (state) => state.settings.chat.departments.select
export const getRawSettingsChatDepartmentsEnabled = (state) =>
  state.settings.chat.departments.enabled
export const getSettingsChatSuppress = (state) => state.settings.chat.suppress
export const getSettingsChatConnectionSuppress = (state) => state.settings.chat.connectionSuppress
export const getSettingsChatConnectOnDemand = (state) => state.settings.chat.connectOnDemand
export const getSettingsChatConnectOnPageLoad = (state) => state.settings.chat.connectOnPageLoad
export const getSettingsChatTags = (state) => state.settings.chat.tags
export const getSettingsChatConcierge = (state) => state.settings.chat.concierge
export const getSettingsChatOfflineForm = (state) => state.settings.chat.offlineForm
export const getSettingsChatPrechatForm = (state) => state.settings.chat.prechatForm
export const getSettingsChatTitle = (state) => state.settings.chat.title
export const getSettingsChatProfileCard = (state) => state.settings.chat.profileCard
export const getSettingsChatHideWhenOffline = (state) => state.settings.chat.hideWhenOffline

export const getSettingsChatEmailTranscriptEnabled = (state) =>
  state.settings.chat.emailTranscriptEnabled

// LAUNCHER
export const getSettingsLauncherBadge = (state) => state.settings.launcher.badge
export const getSettingsLauncherMobile = (state) => state.settings.launcher.mobile

// COLOR
export const getSettingsColor = (state) => state.settings.color
export const getSettingsColorLauncher = (state) => getSettingsColor(state).launcher
export const getSettingsColorLauncherText = (state) => getSettingsColor(state).launcherText
export const getSettingsColorTheme = (state) => getSettingsColor(state).theme
export const getSettingsColorResultLists = (state) => getSettingsColor(state).resultLists
export const getSettingsColorArticleLinks = (state) => getSettingsColor(state).articleLinks

// TALK
export const getSettingsTalkTitle = (state) => state.settings.talk.title
export const getSettingsTalkNickname = (state) => state.settings.talk.nickname
export const getSettingsTalkSuppress = (state) => state.settings.talk.suppress

// STYLING
export const getStylingZIndex = (state) => state.settings.styling.zIndex
export const getStylingPositionVertical = (state) => state.settings.styling.positionVertical
export const getStylingPositionHorizontal = (state) => state.settings.styling.positionHorizontal
export const getStylingOffsetVertical = (state) => state.settings.styling.offsetVertical
export const getStylingOffsetHorizontal = (state) => state.settings.styling.offsetHorizontal
const getStylingOffsetMobileVertical = (state) => state.settings.styling.offsetMobileVertical
const getStylingOffsetMobileHorizontal = (state) => state.settings.styling.offsetMobileHorizontal

export const getStylingOffset = (state) => {
  return {
    vertical: getStylingOffsetVertical(state),
    horizontal: getStylingOffsetHorizontal(state),
    mobile: {
      vertical: getStylingOffsetMobileVertical(state),
      horizontal: getStylingOffsetMobileHorizontal(state),
    },
  }
}

export const getSettingsNavigationPopoutButtonEnabled = (state) =>
  state.settings.navigation.popoutButton.enabled

// CONTACT FORM
export const getSettingsContactFormAttachments = (state) =>
  state.settings.contactForm.settings.attachments
export const getSettingsContactFormSubject = (state) => state.settings.contactForm.settings.subject
export const getSettingsContactFormTitle = (state) => state.settings.contactForm.settings.title
export const getSettingsSelectTicketFormLabel = (state) =>
  state.settings.contactForm.settings.selectTicketForm
export const getSettingsContactFormSuppress = (state) =>
  state.settings.contactForm.settings.suppress
export const getSettingsContactFormTags = (state) => state.settings.contactForm.settings.tags

// CONTACT OPTIONS
export const getSettingsContactOptionsEnabled = (state) => state.settings.contactOptions.enabled
export const getSettingsContactOptionsButton = (state) =>
  state.settings.contactOptions.contactButton
export const getSettingsContactOptionsChatLabelOnline = (state) =>
  state.settings.contactOptions.chat.chatLabelOnline
export const getSettingsContactOptionsChatLabelOffline = (state) =>
  state.settings.contactOptions.chat.chatLabelOffline
export const getSettingsContactOptionsContactFormLabel = (state) =>
  state.settings.contactOptions.contactFormLabel

// HELP CENTER
export const getSettingsHelpCenterOriginalArticleButton = (state) =>
  state.settings.helpCenter.originalArticleButton
export const getSettingsHelpCenterSuppress = (state) => state.settings.helpCenter.suppress
export const getSettingsHelpCenterLocaleFallbacks = (state) =>
  state.settings.helpCenter.localeFallbacks
export const getHelpCenterChatButton = (state) => state.settings.helpCenter.chatButton
export const getHelpCenterMessageButton = (state) => state.settings.helpCenter.messageButton
export const getHelpCenterSearchPlaceholder = (state) => state.settings.helpCenter.searchPlaceholder
export const getHelpCenterTitle = (state) => state.settings.helpCenter.title

const getSectionFilter = (state) => state.settings.helpCenter.sectionFilter
const getCategoryFilter = (state) => state.settings.helpCenter.categoryFilter
const getLabelFilter = (state) => state.settings.helpCenter.labelFilter

export const getSettingsHelpCenterFilter = createSelector(
  [getLabelFilter, getCategoryFilter, getSectionFilter],
  (label, category, section) => {
    const filters = {}

    if (label) {
      filters.label_names = label
    } // eslint-disable-line camelcase
    if (section) {
      filters.section = section
    }
    if (category) {
      filters.category = category
    }

    return filters
  }
)

export const getSettingsChatDepartmentsEnabled = createSelector(
  getRawSettingsChatDepartmentsEnabled,
  (departments) => {
    if (_.isArray(departments)) {
      return _.compact(departments.map((department) => validateDepartment(department)))
    }
  }
)

export const getSettingsChatDepartmentsEmpty = createSelector(
  getRawSettingsChatDepartmentsEnabled,
  (departments) => {
    return _.isArray(departments) ? departments.length === 0 : false
  }
)

export const getSettingsChatDepartment = createSelector(
  getRawSettingsChatDepartment,
  (department) => validateDepartment(department)
)

const validateDepartment = (department) =>
  _.isInteger(department) ? department : _.toLower(department)

export const getSettingsChatPopout = createSelector(
  [
    getSettingsChatTitle,
    getSettingsChatEmailTranscriptEnabled,
    getSettingsChatDepartmentsEnabled,
    getSettingsChatPrechatForm,
    getSettingsChatOfflineForm,
    getSettingsChatConcierge,
    getSettingsColor,
  ],
  (
    title,
    emailTransciptEnabled,
    departmentsEnabled,
    prechatForm,
    offlineForm,
    concierge,
    color
  ) => ({
    webWidget: {
      chat: {
        title,
        menuOptions: {
          emailTranscript: emailTransciptEnabled,
        },
        departments: {
          enabled: departmentsEnabled,
        },
        prechatForm,
        offlineForm,
        concierge,
      },
      color,
    },
  })
)

export const getAnswerBotTitle = (state) => state.settings.answerBot.title
export const getAnswerBotDelayChannelChoice = (state) => state.settings.answerBot.delayChannelChoice
export const getAnswerBotSearchLabels = (state) => state.settings.answerBot.search.labels
const getSettingsAnswerBotAvatar = (state) => state.settings.answerBot.avatar

export const getSettingsAnswerBotAvatarUrl = (state) => getSettingsAnswerBotAvatar(state).url
export const getAnswerBotAvatarName = (state) => getSettingsAnswerBotAvatar(state).name
export const getSettingsAnswerBotSuppress = (state) => state.settings.answerBot.suppress
