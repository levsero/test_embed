import { createSelector } from 'reselect';

export const getSettingsChatSuppress = (state) => state.settings.chat.suppress;
export const getSettingsChatDepartment = (state) => state.settings.chat.departments.select;
export const getSettingsChatDepartmentsEnabled = (state) => state.settings.chat.departments.enabled;
export const getSettingsMobileNotificationsDisabled = (state) => (
  state.settings.chat.mobileNotificationsDisabled
);
export const getSettingsChatTags = (state) => state.settings.chat.tags;
export const getAnalyticsDisabled = (state) => !state.settings.analytics;
export const getSettingsChatConcierge = (state) => state.settings.chat.concierge;
export const getSettingsChatOfflineForm = (state) => state.settings.chat.offlineForm;
export const getSettingsChatPrechatForm = (state) => state.settings.chat.prechatForm;
export const getSettingsChatTitle = (state) => state.settings.chat.title;
export const getSettingsChatProfileCard = (state) => state.settings.chat.profileCard;
export const getSettingsLauncherSetHideWhenChatOffline = (state) => state.settings.launcher.setHideWhenChatOffline;
export const getSettingsLauncherBadge = (state) => state.settings.launcher.badge;
export const getSettingsColor = (state) => state.settings.color;
export const getSettingsColorLauncher = (state) => getSettingsColor(state).launcher;
export const getSettingsColorLauncherText = (state) => getSettingsColor(state).launcherText;

export const getSettingsChatPopout = createSelector(
  [
    getSettingsChatTitle,
    getSettingsChatDepartmentsEnabled,
    getSettingsChatPrechatForm,
    getSettingsChatOfflineForm,
    getSettingsChatConcierge,
    getSettingsColor,
  ],
  (
    title,
    departmentsEnabled,
    prechatForm,
    offlineForm,
    concierge,
    color
  ) => ({
    webWidget: {
      chat: {
        title,
        departments: {
          enabled: departmentsEnabled
        },
        prechatForm,
        offlineForm,
        concierge
      },
      color
    }
  })
);
