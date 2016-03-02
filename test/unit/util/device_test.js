/* eslint max-len:0 */
describe('devices', function() {
  let isBlacklisted;
  let isLandscape;
  let getDeviceZoom;
  let getZoomSizingRatio;
  let isDevice;
  const mockGlobals = {
    win: {
      innerWidth: 1,
      orientation: 0,
      XMLHttpRequest: function() {
        this.withCredentials = true;
      },
      screen: {
        availWidth: 1,
        availHeight: 1
      }
    },
    navigator: {
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.122 Safari/537.36'
    }
  };
  const devicesPath = buildSrcPath('util/devices');

  beforeEach(function() {
    mockery.enable();

    initMockRegistry({
      'utility/globals': mockGlobals
    });

    const win = mockGlobals.win;

    // iphone 5 potrait dimensions
    win.orientation = 0;
    win.screen.availWidth = 320;
    win.screen.availHeight = 548;
    win.innerWidth = 980;

    mockery.registerAllowable(devicesPath);
    isBlacklisted = requireUncached(devicesPath).isBlacklisted;
    isLandscape = requireUncached(devicesPath).isLandscape;
    getDeviceZoom = requireUncached(devicesPath).getDeviceZoom;
    getZoomSizingRatio = requireUncached(devicesPath).getZoomSizingRatio;
    isDevice = requireUncached(devicesPath).isDevice;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('isBlacklisted', function() {
    it('returns false if doesn\'t support CORS or user agent has nothing within it blacklisted', function() {
      expect(isBlacklisted())
        .toBe(false);
    });

    it('returns true if chrome browser on iOS 8 is within the user agent string', function() {
      mockGlobals.navigator.userAgent = 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 8_0 like Mac OS X; en) AppleWebKit/534.46.0 (KHTML, like Gecko) CriOS/19.0.1084.60 Mobile/9B206 Safari/7534.48.3';

      expect(isBlacklisted())
        .toBe(true);
    });

    it('returns false if chrome browser on iOS 8.1 is within the user agent string', function() {
      mockGlobals.navigator.userAgent = 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 8_1 like Mac OS X; en) AppleWebKit/534.46.0 (KHTML, like Gecko) CriOS/19.0.1084.60 Mobile/9B206 Safari/7534.48.3';

      expect(isBlacklisted())
        .toBe(false);
    });

    it('returns false if chrome browser not on iOS 8 is within the user agent string', function() {
      mockGlobals.navigator.userAgent = 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 7_1 like Mac OS X; en) AppleWebKit/534.46.0 (KHTML, like Gecko) CriOS/19.0.1084.60 Mobile/9B206 Safari/7534.48.3';

      expect(isBlacklisted())
        .toBe(false);
    });

    it('returns true if MSIE 9 is within the user agent string', function() {
      mockGlobals.navigator.userAgent = 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)';

      expect(isBlacklisted())
        .toBe(true);
    });

    it('returns true if Googlebot is within the user agent string', function() {
      mockGlobals.navigator.userAgent = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

      expect(isBlacklisted())
        .toBe(true);

      mockGlobals.navigator.userAgent = 'DoCoMo/2.0 N905i(c100;TB;W24H16) (compatible; Googlebot-Mobile/2.1; +http://www.google.com/bot.html)';

      expect(isBlacklisted())
        .toBe(true);
    });

    it('returns true if the browser doesn\'t supports CORS', function() {
      mockGlobals.win.XMLHttpRequest = noop;

      expect(isBlacklisted())
        .toBe(true);
    });
  });

  describe('isLandscape', function() {
    const win = mockGlobals.win;

    it('should return true if win.orientation is 90 degrees', function() {
      win.orientation = 90;

      expect(isLandscape())
        .toBe(true);
    });

    it('should return false if win.orientation is not 90 degrees', function() {
      win.orientation = 0;

      expect(isLandscape())
        .toBe(false);
    });
  });

  describe('isDevice', function() {
    beforeEach(function() {
      mockGlobals.navigator.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.122 Safari/537.36';
    });

    it('should return true if user agent matches array of strings', function() {
      expect(isDevice('Mozilla', '10_9_5', 'Safari'))
        .toBe(true);
    });

    it('should return false if user agent does not match anything in a array of strings', function() {
      expect(isDevice('Mozilla', '10_9_4', 'Safari'))
        .toBe(false);
    });
  });

  describe('launcher-scaling', function() {
    const win = mockGlobals.win;

    describe('getDeviceZoom', function() {
      it('should return the correct zoom with no mobile device meta tags', function() {
        win.innerWidth = 980;

        expect(getDeviceZoom())
          .toBeCloseTo(0.3265, 4);
      });

      it('should return the correct zoom with mobile device meta tags forcing width', function() {
        win.innerWidth = 640;

        expect(getDeviceZoom())
          .toBeCloseTo(0.5, 4);
      });
    });

    describe('getZoomSizingRatio', function() {
      it('should return the correct ratio with no mobile device meta tags', function() {
        win.innerWidth = 980;

        expect(getZoomSizingRatio())
          .toBeCloseTo(3.0625, 4);
      });

      it('should return the correct ratio with mobile device meta tags forcing width', function() {
        win.innerWidth = 640;

        expect(getZoomSizingRatio())
          .toBeCloseTo(2, 4);
      });
    });
  });
});
