describe('settings selectors', () => {
  let getSettingsChatSuppress,
    getSettingsChatDepartment,
    getSettingsChatDepartmentsEnabled,
    getSettingsMobileNotificationsDisabled,
    getSettingsChatTags;

  beforeEach(() => {
    mockery.enable();

    const settingsSelectorsPath = buildSrcPath('redux/modules/settings/settings-selectors');

    mockery.registerAllowable(settingsSelectorsPath);

    const selectors = requireUncached(settingsSelectorsPath);

    getSettingsChatSuppress = selectors.getSettingsChatSuppress;
    getSettingsChatDepartment = selectors.getSettingsChatDepartment;
    getSettingsChatDepartmentsEnabled = selectors.getSettingsChatDepartmentsEnabled;
    getSettingsMobileNotificationsDisabled = selectors.getSettingsMobileNotificationsDisabled;
    getSettingsChatTags = selectors.getSettingsChatTags;
  });

  describe('getSettingsChatTags', () => {
    let result;

    beforeEach(() => {
      const mockState = {
        settings: {
          chat: { tags: ['yolo', 'yolo2'] }
        }
      };

      result = getSettingsChatTags(mockState);
    });

    it('sets the correct tags', () => {
      expect(result)
        .toEqual(['yolo', 'yolo2']);
    });
  });

  describe('getSettingsMobileNotificationsDisabled', () => {
    let result;

    beforeEach(() => {
      const mockState = {
        settings: {
          chat: { mobileNotificationsDisabled: true }
        }
      };

      result = getSettingsMobileNotificationsDisabled(mockState);
    });

    it('returns true', () => {
      expect(result)
        .toEqual(true);
    });
  });

  describe('getSettingsChatSuppress', () => {
    let result,
      mockSuppress;

    beforeEach(() => {
      mockSuppress = true;

      const mockState = {
        settings: {
          chat: { suppress: mockSuppress }
        }
      };

      result = getSettingsChatSuppress(mockState);
    });

    it('returns true', () => {
      expect(result)
        .toEqual(mockSuppress);
    });
  });

  describe('getSettingsChatDepartment', () => {
    let result;

    beforeEach(() => {
      const mockState = {
        settings: {
          chat: { department: 'yolo' }
        }
      };

      result = getSettingsChatDepartment(mockState);
    });

    it('returns yolo', () => {
      expect(result)
        .toEqual('yolo');
    });
  });

  describe('getSettingsChatDepartmentsEnabled', () => {
    let result;

    beforeEach(() => {
      const mockState = {
        settings: {
          chat: {
            departments: {
              enabled: ['bin tapi']
            }
          }
        }
      };

      result = getSettingsChatDepartmentsEnabled(mockState);
    });

    it('returns ["bin tapi"]', () => {
      expect(result)
        .toEqual(['bin tapi']);
    });
  });
});
