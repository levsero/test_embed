describe('pages', function() {
  let isOnHelpCenterPage,
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

    describe('when host page is a HC page and subdomain does not include "zendesk"', () => {
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

    describe('when subdomain includes "zendesk"', () => {
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
