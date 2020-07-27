import _ from 'lodash'
import { createSelector } from 'reselect'
import { CHATTING_SCREEN } from 'src/redux/modules/chat/chat-screen-types'
import { i18n } from 'service/i18n'
import {
  getChatScreen,
  getWindowSettings,
  getAccountSettingsLauncherBadge,
  getChatAccountSettingsConcierge,
  getChatAccountSettingsOfflineForm,
  getAccountDefaultDepartmentId,
  getNotification,
  getRatingSettings,
  getChatAccountSettingsPrechatForm,
  getDepartmentsList,
  getActiveAgents,
  getIsPopoutAvailable,
  getShowOfflineChat,
  getDefaultToChatWidgetLite,
  getIsChatting,
  getActiveAgentCount,
  getEmbeddableConfigBadgeSettings,
  getEmbeddableConfigOfflineEnabled,
  getConnection
} from 'src/redux/modules/chat/chat-selectors'
import {
  getSettingsChatProfileCard,
  getSettingsChatTitle,
  getSettingsLauncherBadge,
  getSettingsChatConcierge,
  getSettingsChatOfflineForm,
  getSettingsChatPrechatForm,
  getSettingsChatDepartmentsEnabled,
  getSettingsChatDepartment,
  getSettingsNavigationPopoutButtonEnabled,
  getSettingsChatConnectOnDemand,
  getSettingsChatConnectOnPageLoad
} from 'src/redux/modules/settings/settings-selectors'
import { DEPARTMENT_STATUSES } from 'constants/chat'
import { getActiveEmbed, getLocale, getWidgetShown } from 'src/redux/modules/base/base-selectors'
import { isPopout } from 'utility/globals'

/* eslint-disable camelcase */

export const getShowMenu = state =>
  getActiveEmbed(state) === 'chat' &&
  getChatScreen(state) === CHATTING_SCREEN &&
  !isPopout() &&
  !getShowOfflineChat(state)

export const getProfileConfig = createSelector(
  [getSettingsChatProfileCard, getRatingSettings],
  (settingsChatProfileCard, ratingSettings) => ({
    avatar: settingsChatProfileCard.avatar,
    title: settingsChatProfileCard.title,
    rating: ratingSettings.enabled && settingsChatProfileCard.rating
  })
)

export const getChatAccountSettingsTitle = createSelector(
  [getWindowSettings, getLocale],
  (windowSettings, __) => windowSettings.title || i18n.t('embeddable_framework.chat.title')
)

export const getChatTitle = createSelector(
  [getSettingsChatTitle, getChatAccountSettingsTitle, getLocale],
  (settingsChatTitle, chatAccountSettingsTitle, __) =>
    i18n.getSettingTranslation(settingsChatTitle) || chatAccountSettingsTitle
)

export const getChatHistoryLabel = createSelector(
  [getLocale],
  __ => i18n.t('embeddable_framework.chat.historyLink.label')
)

export const getLauncherBadgeSettings = createSelector(
  [
    getSettingsLauncherBadge,
    getAccountSettingsLauncherBadge,
    getEmbeddableConfigBadgeSettings,
    getLocale
  ],
  (settingsBadge, accountSettingsBadge, embeddableConfigBadge, _locale) => {
    let badgeSettings = {}
    if (accountSettingsBadge.enabled) {
      badgeSettings = accountSettingsBadge
    } else if (embeddableConfigBadge && embeddableConfigBadge.enabled) {
      badgeSettings = embeddableConfigBadge
      badgeSettings.image = embeddableConfigBadge.imagePath
    }
    const maxLabelLength = 60
    const settingsLabel = _.get(settingsBadge, 'label', {})
    const fullLabel =
      i18n.getSettingTranslation(settingsLabel) ||
      badgeSettings.text ||
      i18n.t('embeddable_framework.chat.badge.label')
    const label = _.truncate(fullLabel, {
      length: maxLabelLength,
      omission: '…'
    })

    return _.mergeWith({}, badgeSettings, settingsBadge, { label: label }, (a, b) => {
      if (b === null) return a
      return b
    })
  }
)

export const getConciergeSettings = createSelector(
  [getSettingsChatConcierge, getChatAccountSettingsConcierge, getLocale],
  (settingsChatConcierge, chatAccountSettingsConcierge, __) => {
    let concierge = { ...chatAccountSettingsConcierge }

    if (settingsChatConcierge) {
      if (settingsChatConcierge.avatarPath) {
        // eslint-disable-next-line camelcase
        concierge.avatar_path = settingsChatConcierge.avatarPath
      }
      if (settingsChatConcierge.name) {
        concierge.display_name = settingsChatConcierge.name
      }
      if (settingsChatConcierge.title) {
        concierge.title = i18n.getSettingTranslation(settingsChatConcierge.title)
      }
    }

    return concierge
  }
)

export const getOfflineFormSettings = createSelector(
  [getSettingsChatOfflineForm, getChatAccountSettingsOfflineForm, getLocale],
  (settingsChatOfflineForm, accountSettingsOfflineForm, __) => {
    const greeting = _.get(settingsChatOfflineForm, 'greeting', null)

    return {
      ...accountSettingsOfflineForm,
      message:
        i18n.getSettingTranslation(greeting) ||
        _.get(accountSettingsOfflineForm, 'message', null) ||
        i18n.t('embeddable_framework.chat.preChat.offline.greeting')
    }
  }
)

export const getIsPopoutButtonVisible = state => {
  return (
    getSettingsNavigationPopoutButtonEnabled(state) &&
    getIsPopoutAvailable(state) &&
    getActiveEmbed(state) === 'chat'
  )
}

export const getPrechatFormSettings = createSelector(
  [getSettingsChatPrechatForm, getChatAccountSettingsPrechatForm, getLocale],
  (settingsChatPrechatForm, accountSettingsPrechatForm, __) => {
    const greeting = _.get(settingsChatPrechatForm, 'greeting', null)
    const departmentLabel = _.get(settingsChatPrechatForm, 'departmentLabel', null)

    return {
      ...accountSettingsPrechatForm,
      message:
        i18n.getSettingTranslation(greeting) || _.get(accountSettingsPrechatForm, 'message', ''),
      departmentLabel:
        i18n.getSettingTranslation(departmentLabel) ||
        _.get(accountSettingsPrechatForm, 'departmentLabel', '')
    }
  }
)

const extractFormFields = settings => _.keyBy(_.values(settings.form), 'name')

export const getDefaultFormFields = createSelector(
  getPrechatFormSettings,
  extractFormFields
)

const getFormFields = createSelector(
  [getDefaultFormFields, getSettingsChatPrechatForm, getLocale],
  (defaultFields, prechatFormSettings, __) => {
    const departmentLabel = _.get(prechatFormSettings, 'departmentLabel', null)

    return {
      ...defaultFields,
      department: {
        ...defaultFields.department,
        label:
          i18n.getSettingTranslation(departmentLabel) ||
          _.get(defaultFields, 'department.label', null) ||
          i18n.t('embeddable_framework.chat.form.common.dropdown.chooseDepartment')
      }
    }
  }
)

export const getDefaultSelectedDepartment = createSelector(
  [getSettingsChatDepartment, getAccountDefaultDepartmentId, getDepartmentsList],
  (settingsDefault, accountDefault, departments) => {
    const selector = settingsDefault || accountDefault

    return _.find(departments, dept => dept.name.toLowerCase() === selector || dept.id === selector)
  }
)

export const getEnabledDepartments = createSelector(
  [getSettingsChatDepartmentsEnabled, getDepartmentsList],
  (settingsDepartmentsEnabled, departmentsList) => {
    if (Array.isArray(settingsDepartmentsEnabled)) {
      return departmentsList.filter(
        department =>
          _.includes(settingsDepartmentsEnabled, department.id) ||
          _.includes(settingsDepartmentsEnabled, department.name.toLowerCase())
      )
    }

    return departmentsList
  }
)

export const getPrechatFormFields = createSelector(
  [
    getFormFields,
    getOfflineFormSettings,
    getDefaultSelectedDepartment,
    getEnabledDepartments,
    getLocale
  ],
  (formFields, offlineFormSettings, selectedDepartment, enabledDepartments, _locale) => {
    let firstOnlineDepartment = true
    const sortedDepartments = _.orderBy(
      enabledDepartments,
      [dep => dep.name.toLowerCase()],
      ['asc']
    )
    const departmentOptions = sortedDepartments.map(department => {
      let departmentOption = {
        ...department,
        value: department.id,
        isDefault: selectedDepartment && selectedDepartment.id === department.id
      }

      if (department.status === DEPARTMENT_STATUSES.OFFLINE) {
        if (!offlineFormSettings.enabled) {
          departmentOption.disabled = true
        }
        departmentOption.name = i18n.t('embeddable_framework.chat.department.offline.label', {
          department: department.name
        })
      } else {
        if (
          firstOnlineDepartment &&
          _.get(formFields, 'department.required', false) &&
          !selectedDepartment
        ) {
          departmentOption.default = true
          firstOnlineDepartment = false
        }
      }
      return departmentOption
    })

    return _.extend({}, formFields, {
      departments: departmentOptions
    })
  }
)

export const getCurrentConcierges = createSelector(
  [getActiveAgents, getConciergeSettings],
  (agents, conciergeSettings) => {
    if (_.size(agents) === 0) {
      return [conciergeSettings]
    }

    return _.map(agents, agent => {
      if (!agent.avatar_path) {
        return {
          ...agent,
          avatar_path: conciergeSettings.avatar_path
        }
      }
      return agent
    })
  }
)

export const getOfflineFormFields = createSelector(
  getOfflineFormSettings,
  extractFormFields
)

export const getChatNotification = createSelector(
  [getNotification, getActiveAgents, getConciergeSettings],
  (notification, agents, conciergeSettings) => {
    const currentAgent = agents[notification.nick]
    const avatar_path = _.get(currentAgent, 'avatar_path') || conciergeSettings.avatar_path

    return {
      ...notification,
      ...currentAgent,
      avatar_path
    }
  }
)

export const isInChattingScreen = createSelector(
  [getChatScreen, getActiveEmbed, getWidgetShown],
  (screen, embed, widgetShown) => widgetShown && screen === CHATTING_SCREEN && embed === 'chat'
)

export const getOfflineFormEnabled = createSelector(
  [getOfflineFormSettings, getEmbeddableConfigOfflineEnabled],
  (offlineFormSettings, configOfflineEnabled) => offlineFormSettings.enabled || configOfflineEnabled
)

export const getDelayChatConnectionEnabled = createSelector(
  [getDefaultToChatWidgetLite, getSettingsChatConnectOnDemand, getSettingsChatConnectOnPageLoad],
  (defaultToChatWidgetLite, connectOnDemand, connectOnPageLoad) => {
    return connectOnDemand || !connectOnPageLoad || defaultToChatWidgetLite
  }
)

export const getDelayChatConnection = createSelector(
  [getDelayChatConnectionEnabled, getIsChatting, getConnection],
  (delayChatConnectionEnabled, isChatting, chatConnection) => {
    if (isChatting || chatConnection) return false
    return delayChatConnectionEnabled
  }
)

export const getShowRatingButtons = createSelector(
  [getProfileConfig, getActiveAgentCount, getIsChatting, getChatScreen],
  (profileConfig, agentCount, isChatting, chatScreen) =>
    profileConfig.rating && agentCount > 0 && isChatting && chatScreen === CHATTING_SCREEN
)
