describe('beacon', function() {
  var beacon,
      mockRegistry,
      beaconPath = buildSrcPath('service/beacon');


  function assertCommonParams(params) {
    var mockGlobals = mockRegistry['utility/globals'];

    /* jshint sub:true */
    expect(params['buid'])
      .toBe('abc123');

    expect(params['url'])
      .toBe(mockGlobals.win.location.href);

    expect(typeof params['timestamp'])
      .toBe('string');

    expect(params['timestamp'])
      .toBe((new Date(Date.parse(params['timestamp']))).toISOString());
  }

  beforeEach(function() {
    mockery.enable({ useCleanCache: true });

    mockRegistry = initMockRegistry({
      'service/transport': {
        transport: jasmine.createSpyObj('transport', ['send'])
      },
      'utility/globals': {
        win: {
          location: {
            origin: 'http://window.location.origin',
            href: 'http://window.location.href'
          }
        },
        document: {
          referrer: 'http://document.referrer',
          title: 'Document Title',
          t: '1414541964593'
        },
        navigator: {
          language: 'navigator.language',
          userAgent: 'navigator.userAgent'
        }
      },
      'service/identity': {
        identity: {
          getBuid: jasmine.createSpy('getBuid').and.returnValue('abc123')
        }
      },
      'service/persistence': {
        store: jasmine.createSpyObj('store', ['set', 'get'])
      },
      'utility/utils': {
          parseUrl: function() {
            return {
              href: 'http://document.referrer'
            };
          },
          getFrameworkLoadTime: function() {
            return 200;
          }
      },
      'imports?_=lodash!lodash': _
    });

    mockery.registerAllowable(beaconPath);
    beacon = require(beaconPath).beacon;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#init', function() {

    it('Saves the currentTime', function() {
      var currentTime = Date.now(),
          mockPersistence = mockRegistry['service/persistence'],
          recentCall,
          resultTime;

      beacon.init();

      expect(mockPersistence.store.set)
        .toHaveBeenCalled();

      recentCall = mockPersistence.store.set.calls.mostRecent();

      expect(recentCall.args[0])
        .toEqual('currentTime');

      resultTime = recentCall.args[1];

      expect(resultTime > (currentTime - 30))
        .toBeTruthy();

      expect(resultTime < (currentTime + 30))
        .toBeTruthy();
    });

  });

  describe('#send', function() {

    it('sends correct payload using transport.send', function() {
      var payload,
          params,
          mockTransport = mockRegistry['service/transport'],
          mockGlobals = mockRegistry['utility/globals'],
          mockUtils = mockRegistry['utility/utils'];

      beacon.init();
      beacon.send();
      expect(mockTransport.transport.send).toHaveBeenCalled();

      payload = mockTransport.transport.send.calls.mostRecent().args[0];

      expect(payload.method)
        .toBe('POST');

      expect(payload.path)
        .toBe('/embeddable/blips');

      params = payload.params;

      assertCommonParams(params);

      /* jshint sub:true */
      expect(params.pageView.userAgent)
        .toBe(mockGlobals.navigator.userAgent);

      expect(params.pageView.referrer)
        .toBe(mockUtils.parseUrl().href);

      expect(params.pageView.navigatorLanguage)
        .toBe(mockGlobals.navigator.language);

      expect(params.pageView.pageTitle)
        .toBe(mockGlobals.document.title);

      expect(params.pageView.time)
        .toBeDefined();

      expect(params.pageView.loadTime)
        .toBe(mockUtils.getFrameworkLoadTime());
    });

  });

  describe('#track', function() {
    it('should not send anything if the first two params are not provided', function() {
      var mockTransport = mockRegistry['service/transport'];

      beacon.track();
      beacon.track('only one param');
      beacon.track(undefined, 'second param');
      beacon.track(undefined, undefined, 'third param');

      expect(mockTransport.transport.send)
        .not.toHaveBeenCalled();
    });

    it('sends the correct payload', function() {
      var payload,
          params,
          userActionParams = {
            category: 'Category01',
            action: 'Action02',
            label: 'Label03',
            value: 'Value04'
          },
          mockTransport = mockRegistry['service/transport'];

      beacon.init();

      beacon.track(
        userActionParams.category,
        userActionParams.action,
        userActionParams.label,
        userActionParams.value
      );

      expect(mockTransport.transport.send)
        .toHaveBeenCalled();

      payload = mockTransport.transport.send.calls.mostRecent().args[0];

      expect(payload.method)
        .toBe('POST');

      expect(payload.path)
        .toBe('/embeddable/blips');

      params = payload.params;

      assertCommonParams(params);

      expect(params.userAction)
        .toEqual(userActionParams);
    });

  });
});
