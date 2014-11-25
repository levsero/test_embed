describe('devices', function() {
  var isBlacklisted,
      mockGlobals = {
        win: noop,
        navigator: {
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.122 Safari/537.36' /* jshint ignore: line */
        }
      },
      mockRegistry,
      devicesPath = buildSrcPath('util/devices');

  beforeEach(function() {
    mockery.enable({ useCleanCache: true });

    mockRegistry = initMockRegistry({
      'utility/globals': mockGlobals
    });

    mockery.registerAllowable(devicesPath);
    isBlacklisted = require(devicesPath).isBlacklisted;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('isBlacklisted', function() {

    it('returns false if user agent has nothing within it blacklisted', function() {
      expect(isBlacklisted())
        .toBe(false);
    });

    it('returns true if chrome browser on iOS 8 is within the user agent string', function() {
      /* jshint maxlen: false */
      mockGlobals.navigator.userAgent = 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 8_0 like Mac OS X; en) AppleWebKit/534.46.0 (KHTML, like Gecko) CriOS/19.0.1084.60 Mobile/9B206 Safari/7534.48.3';

      expect(isBlacklisted())
        .toBe(true);
    });

    it('returns false if chrome browser on iOS 8.1 is within the user agent string', function() {
      /* jshint maxlen: false */
      mockGlobals.navigator.userAgent = 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 8_1 like Mac OS X; en) AppleWebKit/534.46.0 (KHTML, like Gecko) CriOS/19.0.1084.60 Mobile/9B206 Safari/7534.48.3';

      expect(isBlacklisted())
        .toBe(false);
    });

    it('returns false if chrome browser not on iOS 8 is within the user agent string', function() {
      /* jshint maxlen: false */
      mockGlobals.navigator.userAgent = 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 7_1 like Mac OS X; en) AppleWebKit/534.46.0 (KHTML, like Gecko) CriOS/19.0.1084.60 Mobile/9B206 Safari/7534.48.3';

      expect(isBlacklisted())
        .toBe(false);
    });

  });

});
