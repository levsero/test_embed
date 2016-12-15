describe('utils', () => {
  let splitPath,
    getPageKeywords,
    getPageTitle,
    nowInSeconds,
    objectDifference,
    cssTimeToMs,
    base64encode;

  const mockGlobals = {
    win: {},
    document: document,
    location: {
      href: 'http://foo.com/anthony/is/awesome',
      pathname: '/anthony/is/awesome',
      hash: ''
    }
  };
  const utilPath = buildSrcPath('util/utils');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    mockGlobals.document = document;
    mockGlobals.document.title = 'Utils tests';

    initMockRegistry({
      'utility/globals': mockGlobals,
      'utility/devices': {
        getZoomSizingRatio: () => {
          return 1;
        }
      },
      'lodash': _
    });

    splitPath = require(utilPath).splitPath;
    getPageKeywords = require(utilPath).getPageKeywords;
    getPageTitle = require(utilPath).getPageTitle;
    objectDifference = require(utilPath).objectDifference;
    cssTimeToMs = require(utilPath).cssTimeToMs;
    nowInSeconds = require(utilPath).nowInSeconds;
    base64encode = require(utilPath).base64encode;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('splitPath()', () => {
    it('should split a path with some typical separation', () => {
      expect(splitPath('/this/is/a-1-path.html'))
        .toEqual(' this is a 1 path');

      // %20 is ' ' urlencoded
      expect(splitPath('/this/is/a-1%20path.html'))
        .toEqual(' this is a 1 path');

      // %2E is '.' urlencoded
      expect(splitPath('/this/is/a-2%2Epath.html'))
        .toEqual(' this is a 2 path');

      // %2D is '-' urlencoded
      expect(splitPath('/this/is/a--2%2Dpath.php'))
        .toEqual(' this is a  2 path');

      expect(splitPath('/this/is/a-2-path.html'))
        .toEqual(' this is a 2 path');

      expect(splitPath('/this/is/a|2|path.html'))
        .toEqual(' this is a 2 path');

      expect(splitPath('!/thi$/is/1@-_path.html'))
        .toEqual('! thi$ is 1@  path');

      expect(splitPath('!/thi𝌆$/is/tchüss1@-_path.html'))
        .toEqual('! thi𝌆$ is tchüss1@  path');
    });

    describe('when there are \':\' or \'#\' characters in the path', () => {
      it('should strip them out and replace them with spaces', () => {
        expect(splitPath('/this:5/is/#a-2-path.html'))
          .toEqual(' this 5 is  a 2 path');

        expect(splitPath('/this/#/is/a|2|path:.html'))
          .toEqual(' this   is a 2 path ');
      });
    });
  });

  describe('getPageKeywords()', () => {
    let location;

    beforeEach(() => {
      location = mockGlobals.location;
      location.hash = '';
    });

    it('should return the pathname in the form of space seperated keywords', () => {
      expect(getPageKeywords())
        .toEqual('anthony is awesome');
    });

    it('should still return valid keywords with weird `#` urls', () => {
      location.pathname = '/';
      location.hash = '#/anthony/#/is/#/awesome';

      expect(getPageKeywords())
        .toEqual('anthony is awesome');

      location.pathname = '/fat/';
      location.hash = '#/cats';

      expect(getPageKeywords())
        .toEqual('fat cats');

      location.pathname = '/fred/';
      location.hash = '#bar';

      expect(getPageKeywords())
        .toEqual('fred bar');
    });

    it('should return valid keywords with \':\' characters in the url', () => {
      location.pathname = '/buy/page:5/hardcover:false';

      expect(getPageKeywords())
        .toEqual('buy page 5 hardcover false');

      location.pathname = '/:buy:/:page::5/hardcover:false:';

      expect(getPageKeywords())
        .toEqual('buy page 5 hardcover false');
    });
  });

  describe('getPageTitle()', () => {
    it('returns the document.title', () => {
      expect(getPageTitle())
        .toEqual(document.title);
    });
  });

  describe('patchReactIdAttribute()', () => {
    it('updates react data attribute to data-ze-reactid instead of data-reactid', () => {
      mockery.disable();
      mockery.enable({ useCleanCache: true });
      require(utilPath).patchReactIdAttribute();

      // we have to require react again after the ID_ATTRIBUTE is updated for change to take effect
      const { addons: { TestUtils } } = require('react/addons');

      const containerDiv = TestUtils.renderIntoDocument(<h1>Hello React!</h1>).getDOMNode();

      expect(containerDiv.outerHTML)
        .toEqual('<h1 data-ze-reactid=".0">Hello React!</h1>');
    });
  });

  describe('objectDifference', () => {
    let a, b;

    beforeEach(() => {
      a = {
        list: [],
        hello: 'world',
        bob: 'the builder'
      };
      b = {
        list: [],
        bob: 'the builder'
      };
    });

    describe('when there are no nested objects', () => {
      it('should return the complement of the two objects', () => {
        expect(objectDifference(a, b))
          .toEqual({ hello: 'world' });
      });
    });

    describe('when there are nested objects', () => {
      it('should return the complement of the two objects', () => {
        a.foo = { bar: 0, baz: 2 };
        a.extra = { a: 0, b: 1 };
        b.foo = { bar: 0, baz: 1 };

        expect(objectDifference(a, b))
          .toEqual({
            hello: 'world',
            foo: { baz: 2 },
            extra: { a: 0, b: 1 }
          });
      });
    });
  });

  describe('cssTimeToMs()', () => {
    let cssTime;

    describe('when using seconds', () => {
      it('converts to milliseconds and returns an integer', () => {
        cssTime = '300s';
        expect(cssTimeToMs(cssTime)).toEqual(300 * 1000);
      });
    });

    describe('when using milliseconds', () => {
      it('returns an integer', () => {
        cssTime = '520ms';
        expect(cssTimeToMs(cssTime)).toEqual(520);
      });
    });

    describe('when given a malformed string', () => {
      describe('if it cannot parse the number', () => {
        it('falls back to 0', () => {
          cssTime = 'three hundred';
          expect(cssTimeToMs(cssTime)).toEqual(0);
        });
      });

      describe('if it can parse the number, but not the unit', () => {
        it('assumes milliseconds', () => {
          cssTime = '666somg';
          expect(cssTimeToMs(cssTime)).toEqual(666);
        });
      });
    });
  });

  describe('nowInSeconds()', () => {
    it('should return the current time in seconds', () => {
      expect(nowInSeconds())
        .toEqual(Math.floor(Date.now() / 1000));
    });
  });

  describe('base64encode()', () => {
    describe('with ascii characters', () => {
      const ascii = ''.concat(
        'abcdefghijklmnopqrstuvwxyz',
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        '0123456789',
        "!#$%&()*+,-./:;<=>?@[]{}^_`|~'\\\""
      );

      const base64 = ''.concat(
        'YWJjZGVmZ2hpamtsbW5vcHFyc3',
        'R1dnd4eXpBQkNERUZHSElKS0xN',
        'Tk9QUVJTVFVWV1hZWjAxMjM0NT',
        'Y3ODkhIyQlJigpKissLS4vOjs8',
        'PT4/QFtde31eX2B8fidcIg=='
      );

      it('encodes the string properly', () => {
        expect(base64encode(ascii))
          .toEqual(base64);
      });
    });

    describe('with extended utf-8 characters', () => {
      it('encodes the string properly', () => {
        expect(base64encode('✓ à la mode'))
          .toEqual('4pyTIMOgIGxhIG1vZGU=');

        expect(base64encode('我是一支鉛筆'))
          .toEqual('5oiR5piv5LiA5pSv6Ymb562G');

        expect(base64encode('Я карандаш'))
          .toEqual('0K8g0LrQsNGA0LDQvdC00LDRiA==');

        expect(base64encode('😂😓😥😭💩'))
          .toEqual('8J+YgvCfmJPwn5il8J+YrfCfkqk=');
      });
    });
  });
});
