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

const colorSettings = (newSettings) => {
  return settings({ color: newSettings });
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

test('getSettingsColorLauncher', () => {
  const result = selectors.getSettingsColorLauncher(
    colorSettings({
      launcher: 'blue'
    })
  );

  expect(result)
    .toEqual('blue');
});

test('getSettingsColorLauncherText', () => {
  const result = selectors.getSettingsColorLauncherText(
    colorSettings({
      launcherText: 'green'
    })
  );

  expect(result)
    .toEqual('green');
});

test('getSettingsLauncherBadge', () => {
  const badge = {
    layout: 'image_left',
    image: 'https://img.example.com/qwerty.png',
    label: {
      '*': 'cool label'
    }
  };
  const result = selectors.getSettingsLauncherBadge(
    launcherSettings({ badge })
  );

  expect(result).toEqual(badge);
});

test('getSettingsColor', () => {
  const mockColor = {
    color: {
      theme: '#123456',
      launcher: '#ffffff'
    }
  };
  const result = selectors.getSettingsColor(settings(mockColor));

  expect(result).toEqual(mockColor.color);
});

test('getSettingsChatPopout', () => {
  const mockSettings = {
    chat: {
      title: {
        '*': 'cool chat title'
      },
      departments: {
        enabled: ['fire', 'police']
      },
      prechatForm: {
        label: {
          '*': 'prechatForm label'
        }
      },
      offlineForm: {
        label: {
          '*': 'offlineForm label'
        }
      },
      concierge: {
        avatarPath: 'http://example.com'
      }
    },
    color: {
      theme: '#555555'
    }
  };
  const result = selectors.getSettingsChatPopout(settings(mockSettings));

  expect(result).toEqual({ webWidget: mockSettings });
});
