import { createSelector } from 'reselect';
import _ from 'lodash';

export const getSettingsChatSuppress = (state) => state.settings.chat.suppress;
export const getRawSettingsChatDepartment = (state) => state.settings.chat.departments.select;
export const getRawSettingsChatDepartmentsEnabled = (state) => state.settings.chat.departments.enabled;
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
export const getSettingsChatHideWhenOffline = (state) => state.settings.chat.hideWhenOffline;

export const getSettingsLauncherChatLabel = (state) => state.settings.launcher.settings.chatLabel;
export const getSettingsLauncherLabel = (state) => state.settings.launcher.settings.label;
export const getSettingsLauncherBadge = (state) => state.settings.launcher.badge;
export const getSettingsColor = (state) => state.settings.color;
export const getSettingsColorLauncher = (state) => getSettingsColor(state).launcher;
export const getSettingsColorLauncherText = (state) => getSettingsColor(state).launcherText;

export const getSettingsHelpCenterOriginalArticleButton = (state) => state.settings.helpCenter.originalArticleButton;
export const getSettingsHelpCenterSuppress = (state) => state.settings.helpCenter.suppress;
export const getSettingsHelpCenterLocaleFallbacks = (state) => state.settings.helpCenter.localeFallbacks;
export const getSettingsHelpCenterChatButton = (state) => state.settings.helpCenter.chatButton;
export const getSettingsHelpCenterMessageButton = (state) => state.settings.helpCenter.messageButton;
export const getSettingsHelpCenterSearchPlaceholder = (state) => state.settings.helpCenter.searchPlaceholder;
export const getSettingsHelpCenterTitle = (state) => state.settings.helpCenter.title;

const getSectionFilter = (state) => state.settings.helpCenter.sectionFilter;
const getCategoryFilter = (state) => state.settings.helpCenter.categoryFilter;
const getLabelFilter = (state) => state.settings.helpCenter.labelFilter;

export const getSettingsHelpCenterFilter = createSelector(
  [getLabelFilter, getCategoryFilter, getSectionFilter],
  (label, category, section) =>(
    {
      label,
      section,
      category
    })
);

export const getSettingsChatDepartmentsEnabled = createSelector(
  getRawSettingsChatDepartmentsEnabled,
  (departments) => {
    if (_.isArray(departments)) {
      return _.compact(
        departments.map((department) => validateDepartment(department))
      );
    }
  }
);

export const getSettingsChatDepartmentsEmpty = createSelector(
  getRawSettingsChatDepartmentsEnabled,
  (departments) => {
    return _.isArray(departments)
      ? departments.length === 0
      : false;
  }
);

export const getSettingsChatDepartment = createSelector(
  getRawSettingsChatDepartment,
  (department) => validateDepartment(department)
);

const validateDepartment = (department) => (
  _.isInteger(department) ? department : _.toLower(department)
);

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
