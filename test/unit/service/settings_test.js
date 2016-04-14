describe('settings', function() {
  let settings,
    mockRegistry;
  const settingsPath = buildSrcPath('service/settings');

  beforeEach(function() {
    mockery.enable();
    mockRegistry = initMockRegistry({
      'utility/globals': {
        win: {
          zESettings: {}
        }
      }
    });
    mockery.registerAllowable(settingsPath);
    settings = requireUncached(settingsPath).settings;
  });

  describe('store', function() {
    it('has the correct default values', function() {
      const defaults = {
        offset: { horizontal: 0, vertical: 0 },
        widgetMargin: 15
      };

      expect(settings.get('offset'))
        .toEqual(defaults.offset);

      expect(settings.get('widgetMargin'))
        .toEqual(defaults.widgetMargin);
    });
  });

  describe('#init', function() {
    it('should store a whitelisted value if it is in win.zESetting', function() {
      mockRegistry['utility/globals'].win.zESettings = { authenticate: 'foo' };
      settings.init();

      expect(settings.get('authenticate'))
        .toEqual('foo');
    });
  });

  describe('#get', function() {
    it('should return a value if it exists in the store', function() {
      mockRegistry['utility/globals'].win.zESettings = { authenticate: 'foo' };
      settings.init();

      expect(settings.get('authenticate'))
        .toEqual('foo');
    });

    it('should return null if a value does not exist in the store', function() {
      settings.init();

      expect(settings.get('authenticate'))
        .toEqual(null);
    });
  });
});
