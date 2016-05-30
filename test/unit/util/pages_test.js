describe('pages', function() {
  let isOnHelpCenterPage;
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
});
