describe('color', function() {
  let generateUserCSS,
    validSettingsColor,
    mockSettingsValue;

  const colorPath = buildSrcPath('util/color');

  beforeEach(function() {
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
    validSettingsColor = require(colorPath).validSettingsColor;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('generateUserCSS', function() {
    it('uses the default value if nothing is passed in', function() {
      expect(generateUserCSS())
        .toMatch('#659700');
    });

    it('uses the value passed into the function if it exists', function() {
      expect(generateUserCSS('#ffffff'))
        .toMatch('#ffffff');
    });

    it('uses the value in zESettings if it exists', function() {
      mockSettingsValue = '#aaaaaa';
      const cssString = generateUserCSS('#ffffff');

      expect(cssString)
        .not.toMatch('#ffffff');

      expect(cssString)
        .toMatch('#aaaaaa');
    });
  });

  describe('validSettingsColor', function() {
    it('allows valid hex values', function() {
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

    it('wont allow non valid hex values', function() {
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
    });
  });
});
