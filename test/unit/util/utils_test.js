describe('utils', function() {
  let splitPath,
    getPageKeywords,
    getPageTitle,
    objectDifference;
    cssTimeToMs;

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

  beforeEach(function() {
    resetDOM();

    mockery.enable({
      useCleanCache: true
    });

    mockGlobals.document = document;
    mockGlobals.document.title = 'Utils tests';

    initMockRegistry({
      'utility/globals': mockGlobals,
      'utility/devices': {
        getZoomSizingRatio: function() {
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
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('splitPath()', function() {
    it('should split a path with some typical separation', function() {
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

  describe('getPageKeywords()', function() {
    let location;

    beforeEach(function() {
      location = mockGlobals.location;
      location.hash = '';
    });

    it('should return the pathname in the form of space seperated keywords', function() {
      expect(getPageKeywords())
        .toEqual('anthony is awesome');
    });

    it('should still return valid keywords with weird `#` urls', function() {
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

  describe('getPageTitle()', function() {
    it('returns the document.title', function() {
      expect(getPageTitle())
        .toEqual(document.title);
    });
  });

  describe('patchReactIdAttribute()', function() {
    it('updates react data attribute to data-ze-reactid instead of data-reactid', function() {
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

  describe('cssTimeToMs()', function() {
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
  });
});
