/* eslint max-len:0 */
describe('devices', function() {
  let isBlacklisted,
    isLandscape,
    getDeviceZoom,
    getZoomSizingRatio,
    isDevice,
    setScaleLock,
    metaStringToObj,
    getMetaTagsByName,
    appendMetaTag,
    metaTag;
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
    },
    document: document
  };
  const devicesPath = buildSrcPath('util/devices');

  beforeEach(function() {
    resetDOM();

    mockery.enable({
      useCleanCache: true
    });

    mockGlobals.document = document;
    mockGlobals.document.title = 'Utils tests';

    initMockRegistry({
      'utility/globals': mockGlobals,
      'lodash': _
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
    setScaleLock = requireUncached(devicesPath).setScaleLock;
    metaStringToObj = requireUncached(devicesPath).metaStringToObj;
    getMetaTagsByName = requireUncached(devicesPath).getMetaTagsByName;
    appendMetaTag = requireUncached(devicesPath).appendMetaTag;

    metaTag = document.createElement('meta');
    metaTag.name = 'viewport';
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

  describe('setScaleLock(true)', function() {
    it('adds a <meta name="viewport" /> tag if one does not exist', function() {
      expect(document.querySelectorAll('meta[name="viewport"]').length)
        .toEqual(0);

      setScaleLock(true);

      expect(document.querySelectorAll('meta[name="viewport"]').length)
        .toEqual(1);
    });

    it('does not add a <meta name="viewport" /> tag if one exists', function() {
      document.head.appendChild(metaTag);

      expect(document.querySelectorAll('meta[name="viewport"]').length)
        .toEqual(1);

      setScaleLock(true);

      expect(document.querySelectorAll('meta[name="viewport"]').length)
        .toEqual(1);
    });

    it('adds a "user-scalable" key/value to existing <meta name="viewport" /> if it does not exist', function() {
      metaTag.content = 'initial-scale=1.0';
      document.head.appendChild(metaTag);

      setScaleLock(true);

      const viewportContent = metaStringToObj(metaTag.content);

      expect(viewportContent['user-scalable'])
        .toEqual('no');

      expect(viewportContent['initial-scale'])
        .toEqual('1.0');
    });

    it('sets `user-scalable` to "No" if `user-scalable` does not exist', function() {
      metaTag.content = '';
      document.head.appendChild(metaTag);

      setScaleLock(true);

      const viewportContent = metaStringToObj(metaTag.content);

      expect(viewportContent['user-scalable'])
        .toEqual('no');
    });
  });

  describe('setScaleLock(false)', function() {
    beforeEach(() => {
      getZoomSizingRatio = jasmine.createSpy('getZoomSizingRatio').and.returnValue(1);
    });

    it('does not add a <meta name="viewport" /> tag if one does not exist', function() {
      expect(document.querySelectorAll('meta[name="viewport"]').length)
        .toEqual(0);

      setScaleLock(false);

      expect(document.querySelectorAll('meta[name="viewport"]').length)
        .toEqual(0);
    });

    it('resets user-scalable if `originalUserScalable` does exist', function() {
      metaTag.content = 'user-scalable=NO_CHANGE';
      document.head.appendChild(metaTag);

      setScaleLock(true);

      const viewportContentBefore = metaStringToObj(metaTag.content);

      expect(viewportContentBefore['user-scalable'])
        .toEqual('no');

      setScaleLock(false);

      const viewportContentAfter = metaStringToObj(metaTag.content);

      expect(viewportContentAfter['user-scalable'])
        .toEqual('NO_CHANGE');
    });

    it('unsets `user-scalable` if `originalUserScalable` is null', function() {
      document.head.appendChild(metaTag);

      setScaleLock(false);

      const viewportContent = metaStringToObj(metaTag.content);

      expect(viewportContent['original-user-scalable'])
        .toBeUndefined();
      expect(viewportContent['user-scalable'])
        .toBeUndefined();
    });
  });

  describe('getMetaTagsByName', () => {
    describe('when there are meta tags on the document', () => {
      beforeEach(() => {
        metaTag.name = 'referrer';
        metaTag.content = 'no-referrer';
        document.head.appendChild(metaTag);
      });

      it('returns an array with all the meta tag elements', () => {
        const expected = { name: 'referrer', content: 'no-referrer' };

        expect(getMetaTagsByName(document, 'referrer')[0])
          .toEqual(jasmine.objectContaining(expected));
      });
    });

    describe('when there are no meta tags on the document', () => {
      it('returns an empty array', () => {
        expect(getMetaTagsByName(document, 'empty').length)
          .toBe(0);
      });
    });
  });

  describe('appendMetaTag', () => {
    let result;
    const expected = { name: 'referrer', content: 'no-referrer' };

    beforeEach(() => {
      result = appendMetaTag(document, 'referrer', 'no-referrer');
    });

    it('appends a meta tag with name and content to the document head', () => {
      expect(document.querySelectorAll('meta[name="referrer"]')[0])
        .toEqual(jasmine.objectContaining(expected));
    });

    it('returns a reference to the meta tag element', () => {
      expect(result)
        .toEqual(jasmine.objectContaining(expected));
    });
  });
});
