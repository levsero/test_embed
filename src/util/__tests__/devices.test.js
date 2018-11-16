/* eslint max-len:0 */
import * as devices from '../devices';
import * as globals from 'utility/globals';
import { clearDOM } from 'utility/test_helpers';

jest.mock('utility/globals');

const createViewportMetaTag = () => {
  const metaTag = document.createElement('meta');

  metaTag.name = 'viewport';

  return metaTag;
};

afterEach(() => {
  clearDOM();
});

globals.win = {
  innerWidth: 980,
  orientation: 0,
  XMLHttpRequest: function() {
    this.withCredentials = true;
  },
  screen: {
    availWidth: 320,
    availHeight: 548
  }
};
globals.screen = {
  availWidth: 320,
  availHeight: 548
};
globals.document = document;
globals.navigator = {
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.122 Safari/537.36'
};

describe('isBlacklisted', () => {
  it('returns false if doesn\'t support CORS or user agent has nothing within it blacklisted', () => {
    expect(devices.isBlacklisted())
      .toBe(false);
  });

  it('returns true if chrome browser on iOS 8 is within the user agent string', () => {
    globals.navigator.userAgent = 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 8_0 like Mac OS X; en) AppleWebKit/534.46.0 (KHTML, like Gecko) CriOS/19.0.1084.60 Mobile/9B206 Safari/7534.48.3';

    expect(devices.isBlacklisted())
      .toBe(true);
  });

  it('returns false if chrome browser on iOS 8.1 is within the user agent string', () => {
    globals.navigator.userAgent = 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 8_1 like Mac OS X; en) AppleWebKit/534.46.0 (KHTML, like Gecko) CriOS/19.0.1084.60 Mobile/9B206 Safari/7534.48.3';

    expect(devices.isBlacklisted())
      .toBe(false);
  });

  it('returns false if chrome browser not on iOS 8 is within the user agent string', () => {
    globals.navigator.userAgent = 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 7_1 like Mac OS X; en) AppleWebKit/534.46.0 (KHTML, like Gecko) CriOS/19.0.1084.60 Mobile/9B206 Safari/7534.48.3';

    expect(devices.isBlacklisted())
      .toBe(false);
  });

  it('returns true if MSIE 9 is within the user agent string', () => {
    globals.navigator.userAgent = 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)';

    expect(devices.isBlacklisted())
      .toBe(true);
  });

  it('returns true if IEMobile/10.0 is within the user agent string', () => {
    globals.navigator.userAgent = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch)';

    expect(devices.isBlacklisted())
      .toBe(true);
  });

  it('returns true if Googlebot is within the user agent string', () => {
    globals.navigator.userAgent = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

    expect(devices.isBlacklisted())
      .toBe(true);

    globals.navigator.userAgent = 'DoCoMo/2.0 N905i(c100;TB;W24H16) (compatible; Googlebot-Mobile/2.1; +http://www.google.com/bot.html)';

    expect(devices.isBlacklisted())
      .toBe(true);
  });

  it('returns true if the browser doesn\'t supports CORS', () => {
    globals.win.XMLHttpRequest = jest.fn();

    expect(devices.isBlacklisted())
      .toBe(true);
  });
});

describe('isLandscape', () => {
  const win = globals.win;

  it('returns true if win.orientation is 90 degrees', () => {
    win.orientation = 90;

    expect(devices.isLandscape())
      .toBe(true);
  });

  it('returns false if win.orientation is not 90 degrees', () => {
    win.orientation = 0;

    expect(devices.isLandscape())
      .toBe(false);
  });
});

describe('isDevice', () => {
  beforeEach(() => {
    globals.navigator.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.122 Safari/537.36';
  });

  it('returns true if user agent matches array of strings', () => {
    expect(devices.isDevice('Mozilla', '10_9_5', 'Safari'))
      .toBe(true);
  });

  it('returns false if user agent does not match anything in a array of strings', () => {
    expect(devices.isDevice('Mozilla', '10_9_4', 'Safari'))
      .toBe(false);
  });
});

describe('launcher-scaling', () => {
  const win = globals.win;

  describe('getDeviceZoom', () => {
    it('returns the correct zoom with no mobile device meta tags', () => {
      win.innerWidth = 980;

      expect(devices.getDeviceZoom())
        .toBeCloseTo(0.3265, 4);
    });

    it('returns the correct zoom with mobile device meta tags forcing width', () => {
      win.innerWidth = 640;

      expect(devices.getDeviceZoom())
        .toBeCloseTo(0.5, 4);
    });
  });

  describe('getZoomSizingRatio', () => {
    describe('when it is desktop', () => {
      const innerWithArray = [2000, 900, 640, 320, 1];

      it('innerWidth array should contain at least 1 element', () => {
        expect(innerWithArray.length)
          .toBeGreaterThan(0);
      });

      it('returns zoom ratio of 1 regardless of innerWidth value', () => {
        innerWithArray.forEach((innerWidth) => {
          win.innerWidth = innerWidth;

          expect(devices.getZoomSizingRatio())
            .toEqual(1);
        });
      });
    });

    describe('when it is mobile', () => {
      beforeEach(() => {
        globals.navigator.userAgent = 'phone';
      });

      it('returns the correct ratio with no mobile device meta tags', () => {
        win.innerWidth = 980;

        expect(devices.getZoomSizingRatio())
          .toBeCloseTo(3.0625);
      });

      it('returns the correct ratio with mobile device meta tags forcing width', () => {
        win.innerWidth = 640;

        expect(devices.getZoomSizingRatio())
          .toBeCloseTo(2);
      });
    });
  });
});

describe('setScaleLock(true)', () => {
  let metaTag;

  beforeEach(() => {
    metaTag = createViewportMetaTag();
  });

  it('adds a <meta name="viewport" /> tag if one does not exist', () => {
    expect(document.querySelectorAll('meta[name="viewport"]').length)
      .toEqual(0);

    devices.setScaleLock(true);

    expect(document.querySelectorAll('meta[name="viewport"]').length)
      .toEqual(1);
  });

  it('does not add a <meta name="viewport" /> tag if one exists', () => {
    document.head.appendChild(metaTag);

    expect(document.querySelectorAll('meta[name="viewport"]').length)
      .toEqual(1);

    devices.setScaleLock(true);

    expect(document.querySelectorAll('meta[name="viewport"]').length)
      .toEqual(1);
  });

  it('adds a "user-scalable" key/value to existing <meta name="viewport" /> if it does not exist', () => {
    metaTag.content = 'initial-scale=1.0';
    document.head.appendChild(metaTag);

    devices.setScaleLock(true);

    const viewportContent = devices.metaStringToObj(metaTag.content);

    expect(viewportContent['user-scalable'])
      .toEqual('no');

    expect(viewportContent['initial-scale'])
      .toEqual('1.0');
  });

  it('sets `user-scalable` to "No" if `user-scalable` does not exist', () => {
    metaTag.content = '';
    document.head.appendChild(metaTag);

    devices.setScaleLock(true);

    const viewportContent = devices.metaStringToObj(metaTag.content);

    expect(viewportContent['user-scalable'])
      .toEqual('no');
  });
});

describe('setScaleLock(false)', () => {
  let metaTag;

  beforeEach(() => {
    devices.getZoomSizingRatio = jest.fn(() => 1);
    metaTag = createViewportMetaTag();
  });

  it('does not add a <meta name="viewport" /> tag if one does not exist', () => {
    expect(document.querySelectorAll('meta[name="viewport"]').length)
      .toEqual(0);

    devices.setScaleLock(false);

    expect(document.querySelectorAll('meta[name="viewport"]').length)
      .toEqual(0);
  });

  it('resets user-scalable if `originalUserScalable` does exist', () => {
    metaTag.content = 'user-scalable=NO_CHANGE';
    document.head.appendChild(metaTag);

    devices.setScaleLock(true);

    const viewportContentBefore = devices.metaStringToObj(metaTag.content);

    expect(viewportContentBefore['user-scalable'])
      .toEqual('no');

    devices.setScaleLock(false);

    const viewportContentAfter = devices.metaStringToObj(metaTag.content);

    expect(viewportContentAfter['user-scalable'])
      .toEqual('NO_CHANGE');
  });

  it('unsets `user-scalable` if `originalUserScalable` is null', () => {
    document.head.appendChild(metaTag);

    devices.setScaleLock(false);

    const viewportContent = devices.metaStringToObj(metaTag.content);

    expect(viewportContent['original-user-scalable'])
      .toBeUndefined();
    expect(viewportContent['user-scalable'])
      .toBeUndefined();
  });
});

describe('getMetaTagsByName', () => {
  describe('when there are meta tags on the document', () => {
    beforeEach(() => {
      const metaTag = createViewportMetaTag();

      metaTag.name = 'referrer';
      metaTag.content = 'no-referrer';
      document.head.appendChild(metaTag);
    });

    it('returns an array with all the meta tag elements', () => {
      const expected = { name: 'referrer', content: 'no-referrer' };

      expect(devices.getMetaTagsByName(document, 'referrer')[0])
        .toEqual(expect.objectContaining(expected));
    });
  });

  describe('when there are no meta tags on the document', () => {
    it('returns an empty array', () => {
      expect(devices.getMetaTagsByName(document, 'empty').length)
        .toBe(0);
    });
  });
});

describe('appendMetaTag', () => {
  let result;
  const expected = { name: 'referrer', content: 'no-referrer' };

  beforeEach(() => {
    result = devices.appendMetaTag(document, 'referrer', 'no-referrer');
  });

  it('appends a meta tag with name and content to the document head', () => {
    expect(document.querySelectorAll('meta[name="referrer"]')[0])
      .toEqual(expect.objectContaining(expected));
  });

  it('returns a reference to the meta tag element', () => {
    expect(result)
      .toEqual(expect.objectContaining(expected));
  });
});
