import { createSelector } from 'reselect'
import { i18n } from 'src/apps/webWidget/services/i18n'
import { getTalkTitleKey } from 'src/embeds/talk/selectors'
import { getLocale } from 'src/redux/modules/base/base-selectors'

const getLabel = (_, label) => label

export const getSettingsLauncherLabel = (state) => state.settings.launcher.settings.label
export const getSettingsLauncherChatLabel = (state) => state.settings.launcher.settings.chatLabel
export const getSettingsLauncherTalkLabel = (state) => state.settings.launcher.settings.talkLabel

export const getLauncherTalkLabel = createSelector(
  [getSettingsLauncherTalkLabel, getTalkTitleKey, getLocale],
  (settingsLauncherTalkLabel, talkTitleKey, _locale) =>
    i18n.getSettingTranslation(settingsLauncherTalkLabel) || i18n.t(talkTitleKey)
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
