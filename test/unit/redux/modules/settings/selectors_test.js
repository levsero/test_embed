describe('settings selectors', () => {
  let getSettingsChatSuppress,
    getSettingsChatDepartment;

  beforeEach(() => {
    mockery.enable();

    const settingsSelectorsPath = buildSrcPath('redux/modules/settings/settings-selectors');

    mockery.registerAllowable(settingsSelectorsPath);

    const selectors = requireUncached(settingsSelectorsPath);

    getSettingsChatSuppress = selectors.getSettingsChatSuppress;
    getSettingsChatDepartment = selectors.getSettingsChatDepartment;
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

    it('returns true', () => {
      expect(result)
        .toEqual('yolo');
    });
  });
});
