describe('color', function() {
  let generateUserCSS,
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
});
