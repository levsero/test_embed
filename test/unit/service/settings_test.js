describe('settings', function() {
  let settings;
  const settingsPath = buildSrcPath('service/settings');

  beforeEach(function() {
    settings = requireUncached(settingsPath).settings;
  });

  describe('#store', function() {
    it('has the correct default values', function() {
      expect(settings.get('offset'))
        .toEqual({ horizontal: 0, vertical: 0 });

      expect(settings.get('widgetMargin'))
        .toEqual(15);
    });
  });

  describe('#init', function() {
    it('should store an authenticate object if it is passed in', function() {
      settings.init({ authenticate: { jwt: 'token' } });

      expect(settings.get('authenticate'))
        .toEqual({ jwt: 'token' });
    });
  });

  describe('#get', function() {
    it('should return a value if it exists in the store', function() {
      settings.init({ authenticate: { jwt: 'token' }});

      expect(settings.get('authenticate'))
        .toEqual({ jwt: 'token' });
    });

    it('should return null if a value does not exist in the store', function() {
      settings.init();

      expect(settings.get('authenticate'))
        .toEqual(null);
    });
  });
});
