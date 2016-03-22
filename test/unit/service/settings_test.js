describe('settings', function() {
  let settings;
  const settingsPath = buildSrcPath('service/settings');

  beforeEach(function() {
    settings = requireUncached(settingsPath).settings;
  });

  describe('#init', function() {
    it('should store an authenticationToken if it is passed in', function() {
      settings.init({ authenticate: 'token' });

      expect(settings.get('authenticate'))
        .toBe('token');
    });
  });

  describe('#get', function() {
    it('should return a value if it exists in the store', function() {
      settings.init({ authenticate: 'token' });

      expect(settings.get('authenticate'))
        .toBe('token');
    });

    it('should return null if a value does not exist in the store', function() {
      settings.init();

      expect(settings.get('authenticate'))
        .toBe(null);
    });
  });
});
