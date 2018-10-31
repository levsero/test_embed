describe('settings selectors', () => {
  let getSettingsChatSuppress,
    getSettingsChatDepartment,
    getSettingsChatDepartmentsEnabled,
    getSettingsMobileNotificationsDisabled,
    getSettingsChatTags,
    getAnalyticsDisabled,
    getSettingsChatConcierge,
    getSettingsChatOfflineForm,
    getSettingsChatPrechatForm,
    getSettingsChatTitle,
    result,
    mockState;

  beforeAll(() => {
    mockState = {
      settings: {
        analytics: false,
        chat: {
          title: 'something pithy',
          tags: ['yolo', 'yolo2'],
          mobileNotificationsDisabled: true,
          suppress: true,
          departments: {
            enabled: ['bin tapi'],
            select: 'yolo'
          },
          concierge: {
            avatarPath: 'https://www.example.com/myPic.jpg',
            title: 'Some title',
            name: 'Mr McGee'
          },
          prechatForm: {
            departmentLabel: 'the guild of calamitous intent',
            greeting: 'wazzup?!'
          },
          offlineForm: {
            greeting: 'no admittance except on party business'
          }
        }
      }
    };
  });

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
    getAnalyticsDisabled = selectors.getAnalyticsDisabled;
    getSettingsChatConcierge = selectors.getSettingsChatConcierge;
    getSettingsChatOfflineForm = selectors.getSettingsChatOfflineForm;
    getSettingsChatPrechatForm = selectors.getSettingsChatPrechatForm;
    getSettingsChatTitle = selectors.getSettingsChatTitle;
  });

  describe('getSettingsChatTags', () => {
    beforeEach(() => {
      result = getSettingsChatTags(mockState);
    });

    it('sets the correct tags', () => {
      expect(result)
        .toEqual(['yolo', 'yolo2']);
    });
  });

  describe('getSettingsMobileNotificationsDisabled', () => {
    beforeEach(() => {
      result = getSettingsMobileNotificationsDisabled(mockState);
    });

    it('returns true', () => {
      expect(result)
        .toEqual(true);
    });
  });

  describe('getSettingsChatSuppress', () => {
    beforeEach(() => {
      result = getSettingsChatSuppress(mockState);
    });

    it('returns true', () => {
      expect(result)
        .toEqual(true);
    });
  });

  describe('getSettingsChatDepartment', () => {
    beforeEach(() => {
      result = getSettingsChatDepartment(mockState);
    });

    it('returns yolo', () => {
      expect(result)
        .toEqual('yolo');
    });
  });

  describe('getSettingsChatDepartmentsEnabled', () => {
    beforeEach(() => {
      result = getSettingsChatDepartmentsEnabled(mockState);
    });

    it('returns ["bin tapi"]', () => {
      expect(result)
        .toEqual(['bin tapi']);
    });
  });

  describe('getAnalyticsDisabled', () => {
    beforeEach(() => {
      result = getAnalyticsDisabled(mockState);
    });

    it('returns the inverse of the analytics value', () => {
      expect(result)
        .toEqual(true);
    });
  });

  describe('getSettingsChatConcierge', () => {
    beforeEach(() => {
      result = getSettingsChatConcierge(mockState);
    });

    it('returns the chat settings concierge state', () => {
      expect(result).toEqual({
        avatarPath: 'https://www.example.com/myPic.jpg',
        title: 'Some title',
        name: 'Mr McGee'
      });
    });
  });

  describe('getSettingsChatOfflineForm', () => {
    beforeEach(() => {
      result = getSettingsChatOfflineForm(mockState);
    });

    it('returns the the chat offline form settings', () => {
      expect(result).toEqual({
        greeting: 'no admittance except on party business'
      });
    });
  });

  describe('getSettingsChatPrechatForm', () => {
    beforeEach(() => {
      result = getSettingsChatPrechatForm(mockState);
    });

    it('returns the prechat form settings', () => {
      expect(result).toEqual({
        departmentLabel: 'the guild of calamitous intent',
        greeting: 'wazzup?!'
      });
    });
  });

  describe('getSettingsChatTitle', () => {
    beforeEach(() => {
      result = getSettingsChatTitle(mockState);
    });

    it('returns the chat title setting', () => {
      expect(result).toEqual('something pithy');
    });
  });
});
