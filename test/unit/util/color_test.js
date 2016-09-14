describe('color', () => {
  let generateUserCSS,
    generateWebWidgetPreviewCSS,
    validSettingsColor,
    mockSettingsValue;

  const colorPath = buildSrcPath('util/color');

  beforeEach(() => {
    resetDOM();

    mockSettingsValue = null;

    mockery.enable({
      useCleanCache: true
    });

    initMockRegistry({
      'service/settings': {
        settings: {
          get: () => mockSettingsValue
        }
      },
      'lodash': _
    });

    generateUserCSS = require(colorPath).generateUserCSS;
    generateWebWidgetPreviewCSS = require(colorPath).generateWebWidgetPreviewCSS;
    validSettingsColor = require(colorPath).validSettingsColor;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('generateUserCSS', () => {
    it('uses the default value if nothing is passed in', () => {
      expect(generateUserCSS())
        .toMatch('#78A300');
    });

    it('uses the value passed into the function if it exists', () => {
      expect(generateUserCSS('#ffffff'))
        .toMatch('#ffffff');
    });

    it('uses the value in zESettings if it exists', () => {
      mockSettingsValue = '#aaaaaa';
      const cssString = generateUserCSS('#ffffff');

      expect(cssString)
        .not.toMatch('#ffffff');

      expect(cssString)
        .toMatch('#aaaaaa');
    });
  });

  describe('generateWebWidgetPreviewCSS', () => {
    it('uses the value passed into the function', () => {
      expect(generateWebWidgetPreviewCSS('#ffffff'))
        .toMatch('#ffffff');
    });
  });

  describe('validSettingsColor', () => {
    it('allows valid hex values', () => {
      mockSettingsValue = '#aaaaaa';

      expect(validSettingsColor())
        .not.toBeNull();

      mockSettingsValue = '#eee';

      expect(validSettingsColor())
        .not.toBeNull();

      mockSettingsValue = '#AEAEAE';

      expect(validSettingsColor())
        .not.toBeNull();
    });

    it('wont allow non valid hex values', () => {
      mockSettingsValue = '#aaaa';

      expect(validSettingsColor())
        .toBeNull();

      mockSettingsValue = '#hhh';

      expect(validSettingsColor())
        .toBeNull();

      mockSettingsValue = '#638927384';

      expect(validSettingsColor())
        .toBeNull();

      mockSettingsValue = 'eee';

      expect(validSettingsColor())
        .toBeNull();

      mockSettingsValue = '0xFFFFFF';

      expect(validSettingsColor())
        .toBeNull();

      mockSettingsValue = 'rgb(255,123,123)';

      expect(validSettingsColor())
        .toBeNull();
    });
  });
});
