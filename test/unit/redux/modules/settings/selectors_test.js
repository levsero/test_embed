describe('settings selectors', () => {
  let getSettingsChatSuppress;

  beforeEach(() => {
    mockery.enable();

    const settingsSelectorsPath = buildSrcPath('redux/modules/settings/selectors');

    mockery.registerAllowable(settingsSelectorsPath);

    const selectors = requireUncached(settingsSelectorsPath);

    getSettingsChatSuppress = selectors.getSettingsChatSuppress;
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
});
