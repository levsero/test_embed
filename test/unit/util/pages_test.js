describe('pages', function() {
  let isOnHelpCenterPage,
    isOnHostMappedDomain,
    getDecodedJWTBody;
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

    mockery.enable();

    initMockRegistry({
      'utility/globals': mockGlobals,
      'utility/utils': {
        base64decode: window.atob
      },
      'lodash': _
    });

    isOnHelpCenterPage = require(pagePath).isOnHelpCenterPage;
    isOnHostMappedDomain = require(pagePath).isOnHostMappedDomain;
    getDecodedJWTBody = require(pagePath).getDecodedJWTBody;
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

  describe('getDecodedJWTBody', () => {
    let jwtToken, jwtPayload;

    describe('when jwt token body is valid', () => {
      beforeEach(() => {
        const jsonwebtoken = require('jsonwebtoken');

        jwtPayload = {
          'account_id': 95423,
          'user_id': 11234,
          'ticket_id': 29,
          'articles': [ 1,2,3],
          'token': 'crazy-weird-token',
          'exp': 1482367796,
          'iat': Math.floor(Date.now() / 1000) - 30
        };
        jwtToken = jsonwebtoken.sign(jwtPayload, 'secret');
      });

      it('returns a decoded json object', () =>  {
        expect(jwtPayload)
          .toEqual(getDecodedJWTBody(jwtToken));
      });
    });

    describe('when jwt token body is invalid', () => {
      beforeEach(() => {
        jwtToken = 'thing';
      });

      it('returns null', () => {
        expect(getDecodedJWTBody(jwtToken))
          .toBeNull();
      });
    });
  });
});
