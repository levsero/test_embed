import * as selectors from '../settings-selectors';

const settings = (newSettings) => {
  return { settings: newSettings };
};

const chatSettings = (newSettings) => {
  return settings({ chat: newSettings });
};

const launcherSettings = (newSettings) => {
  return settings({ launcher: newSettings });
};

test('getSettingsChatSuppress', () => {
  const result = selectors.getSettingsChatSuppress(chatSettings({ suppress: true }));

  expect(result)
    .toBe(true);
});

test('getSettingsChatDepartment', () => {
  const result = selectors.getSettingsChatDepartment(
    chatSettings({
      departments: { select: [1, 2, 3] }
    })
  );

  expect(result)
    .toEqual([1, 2, 3]);
});

test('getSettingsChatDepartmentsEnabled', () => {
  const result = selectors.getSettingsChatDepartmentsEnabled(
    chatSettings({
      departments: { enabled: true }
    })
  );

  expect(result)
    .toBe(true);
});

test('getSettingsMobileNotificationsDisabled', () => {
  const result = selectors.getSettingsMobileNotificationsDisabled(chatSettings({ mobileNotificationsDisabled: true }));

  expect(result)
    .toBe(true);
});

test('getSettingsChatTags', () => {
  const result = selectors.getSettingsChatTags(
    chatSettings({
      tags: [1, 2]
    })
  );

  expect(result)
    .toEqual([1, 2]);
});

test('getAnalyticsDisabled', () => {
  const result = selectors.getAnalyticsDisabled(
    settings({
      analytics: false
    })
  );

  expect(result)
    .toEqual(true);
});

test('getSettingsChatConcierge', () => {
  const result = selectors.getSettingsChatConcierge(
    chatSettings({
      concierge: { x: 1 }
    })
  );

  expect(result)
    .toEqual({ x: 1 });
});

test('getSettingsChatTitle', () => {
  const result = selectors.getSettingsChatTitle(
    chatSettings({
      title: { x: 1 }
    })
  );

  expect(result)
    .toEqual({ x: 1 });
});

test('getSettingsChatPrechatForm', () => {
  const result = selectors.getSettingsChatPrechatForm(
    chatSettings({
      prechatForm: { x: 1 }
    })
  );

  expect(result)
    .toEqual({ x: 1 });
});

test('getSettingsChatOfflineForm', () => {
  const result = selectors.getSettingsChatOfflineForm(
    chatSettings({
      offlineForm: { x: 1 }
    })
  );

  expect(result)
    .toEqual({ x: 1 });
});

test('getSettingsChatProfileCard', () => {
  const result = selectors.getSettingsChatProfileCard(
    chatSettings({
      profileCard: { x: 1 }
    })
  );

  expect(result)
    .toEqual({ x: 1 });
});

test('getSettingsLauncherSetHideWhenChatOffline', () => {
  const result = selectors.getSettingsLauncherSetHideWhenChatOffline(
    launcherSettings({
      setHideWhenChatOffline: true
    })
  );

  expect(result)
    .toEqual(true);
});
