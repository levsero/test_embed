describe('pages', function() {
  let isOnHelpCenterPage,
    getHelpCenterArticleId,
    isOnHostMappedDomain,
    getURLParameterByName;
  const mockGlobals = {
    win: {
      HelpCenter: {}
    },
    location: {
      href: 'http://foo.com/anthony/is/awesome',
      pathname: '/anthony/is/awesome',
      hash: ''
    }
  };
  const pagePath = buildSrcPath('util/pages');

  beforeEach(function() {
    resetDOM();

    mockery.enable({
      useCleanCache: true
    });

    initMockRegistry({
      'utility/globals': mockGlobals,
      'lodash': _
    });

    isOnHelpCenterPage = require(pagePath).isOnHelpCenterPage;
    getHelpCenterArticleId = require(pagePath).getHelpCenterArticleId;
    isOnHostMappedDomain = require(pagePath).isOnHostMappedDomain;
    getURLParameterByName = require(pagePath).getURLParameterByName;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('isOnHelpCenterPage()', function() {
    let location,
      win;

    beforeEach(function() {
      location = mockGlobals.location;
      win = mockGlobals.win;

      win.HelpCenter = { account: '', user: '' };
    });

    it('returns true if the host page is a helpcenter', function() {
      location.pathname = '/hc/en-us';

      expect(isOnHelpCenterPage())
        .toBe(true);

      location.pathname = '/hc/1234-article-foo-bar';

      expect(isOnHelpCenterPage())
        .toBe(true);
    });

    it('returns false if the URL is not a help center URL', function() {
      location.pathname = '/foo/bar';

      expect(isOnHelpCenterPage())
        .toBe(false);
    });

    it('returns false if window.HelpCenter is not set', function() {
      win.HelpCenter = null;

      expect(isOnHelpCenterPage())
        .toBe(false);
    });
  });

  describe('getHelpCenterArticleId', () => {
    const articleId = 203662246;
    let location;

    beforeEach(() => {
      location = mockGlobals.location;
    });

    describe('returns the help center articleId given legitimate pathnames', () => {
      it('when the pathname only has an articleId', () =>  {
        location = location.pathname = `/hc/articles/${articleId}`;

        expect(getHelpCenterArticleId())
          .toEqual(articleId);
      });

      it('when the pathname has an articleId with a title', () => {
        location = location.pathname = `/hc/articles/${articleId}-Thing`;

        expect(getHelpCenterArticleId())
          .toEqual(articleId);
      });

      it('when the pathname includes a locale variation', () => {
        location = location.pathname = `/hc/ru/articles/${articleId}-Some-Russian-Article`;

        expect(getHelpCenterArticleId())
          .toEqual(articleId);
      });
    });

    describe('returns NaN given garbage or malformed pathnames', () => {
      it('when no articleId provided', () =>  {
        location = location.pathname = `/hc/articles/blah`;

        expect(getHelpCenterArticleId())
          .toEqual(NaN);
      });

      it('when the id in the wrong place', () =>  {
        location = location.pathname = `/hc/articles/blah-23434`;

        expect(getHelpCenterArticleId())
          .toEqual(NaN);
      });
    });
  });

  describe('isOnHostMappedDomain()', () => {
    let location,
      win;

    beforeEach(() => {
      location = mockGlobals.location;
      win = mockGlobals.win;

      location.hostname = 'helpme.mofo.io';
      location.pathname = '/hc/en-us';
      win.HelpCenter = { account: '', user: '' };
    });

    describe('when host page is a HC page and domain is host-mapped"', () => {
      it('should return true', () => {
        expect(isOnHostMappedDomain())
          .toBe(true);
      });
    });

    describe('when host page is not a HC page', () => {
      beforeEach(() => {
        location.pathname = '/foo/bar';
        win.HelpCenter = null;
      });

      it('should return false', () => {
        expect(isOnHostMappedDomain())
          .toBe(false);
      });
    });

    describe('when domain is not host-mapped', () => {
      beforeEach(() => {
        location.hostname = 'z3nmofo.zendesk.com';
      });

      it('should return false', () => {
        expect(isOnHostMappedDomain())
          .toBe(false);
      });
    });
  });

  describe('getURLParameterByName', () => {
    let location;

    beforeEach(() => {
      location = mockGlobals.location;
      location.search = '?ticket_id=123&token=a1b2c3';
    });

    describe('when given a key name that exists in the url', () => {
      it('returns the parameter value for a given key', () =>  {
        expect(getURLParameterByName('ticket_id')).toBe('123');
        expect(getURLParameterByName('token')).toBe('a1b2c3');
      });
    });

    describe('when given a key name that does not exist in the url', () => {
      it('returns null', () => {
        expect(getURLParameterByName('derp')).toBe(null);
      });
    });
  });
});
