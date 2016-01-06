/* eslint max-len:0 */
describe('devices', function() {
  let isBlacklisted,
      isPortait,
      isLandscape,
      getDeviceZoom,
      getZoomSizingRatio;
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

    mockery.registerAllowable(devicesPath);
    isBlacklisted = requireUncached(devicesPath).isBlacklisted;
    isPortait = requireUncached(devicesPath).isPortait;
    isLandscape = requireUncached(devicesPath).isLandscape;
    getDeviceZoom = requireUncached(devicesPath).getDeviceZoom;
    getZoomSizingRatio = requireUncached(devicesPath).getZoomSizingRatio;
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

  describe('orientation', function() {
    const win = mockGlobals.win;

    describe('isPortrait', function() {
      it('should return true if win.orientation is not 90 degrees', function() {
        win.orientation = 0;
        expect(isPortait())
          .toBe(true);
      });
    });

    describe('isLandscape', function() {
      it('should return true if win.orientation is 90 degrees', function() {
        win.orientation = 90;
        expect(isLandscape())
          .toBe(true);
      });
    });
  });

  describe('launcher-scaling', function() {
    const win = mockGlobals.win;
    const screen = win.screen;

    describe('getDeviceZoom', function() {
      it('should return the correct zoom with no mobile device meta tags', function() {
        // iphone 5 potrait dimensions
        win.orientation = 0;
        screen.availWidth = 320;
        screen.availHeight = 548;
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
      it('should return the correct ratio with no mobile device meta tags to ensure the font-size gets updated correctly', function() {
        win.innerWidth = 980;

        const fontSize = (12 * getZoomSizingRatio().toFixed(2)) + 'px';
        expect(fontSize)
          .toBe('36.72px');
      });

      it('should return the correct ratio with mobile device meta tags forcing width to ensure the font-size gets updated correctly', function() {
        win.innerWidth = 640;

        const fontSize = (12 * getZoomSizingRatio().toFixed(2)) + 'px';
        expect(fontSize)
          .toBe('24px');
      });
    });
  });
});
