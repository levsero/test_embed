describe('settings selectors', () => {
  let getSettingsChatSuppress,
    getSettingsChatDepartment,
    getSettingsChatDepartmentsEnabled;

  beforeEach(() => {
    mockery.enable();

    const settingsSelectorsPath = buildSrcPath('redux/modules/settings/settings-selectors');

    mockery.registerAllowable(settingsSelectorsPath);

    const selectors = requireUncached(settingsSelectorsPath);

    getSettingsChatSuppress = selectors.getSettingsChatSuppress;
    getSettingsChatDepartment = selectors.getSettingsChatDepartment;
    getSettingsChatDepartmentsEnabled = selectors.getSettingsChatDepartmentsEnabled;
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

    it('returns [\'bin tapi\']', () => {
      expect(result)
        .toEqual(['bin tapi']);
    });
  });
});
