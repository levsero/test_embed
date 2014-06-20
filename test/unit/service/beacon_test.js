describe('beacon', function() {
  var beacon,
      mockGlobals,
      mockPersistence,
      mockTransport,
      mockIdentity,
      mockUtils,
      beaconPath = buildSrcPath('service/beacon');


  function assertCommonParams(params) {
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

    mockGlobals = {
      win: {
        location: {
          origin: 'http://window.location.origin',
          href: 'http://window.location.href'
        }
      },
      document: {
        referrer: 'http://document.referrer',
        title: 'Document Title',
      },
      navigator: {
        language: 'navigator.language',
        userAgent: 'navigator.userAgent'
      }
    };

    mockPersistence = {
      store: jasmine.createSpyObj('store', ['set', 'get'])
    };

    mockTransport = {
      transport: jasmine.createSpyObj('transport', ['send'])
    };

    mockIdentity = {
      identity: {
        getBuid: jasmine.createSpy('getBuid').andReturn('abc123')
      }
    };

    mockUtils = {
        parseUrl: function() {
          return {
            href: 'http://document.referrer'
          };
        }
    };
  
    mockery.registerMock('service/transport', mockTransport);
    mockery.registerMock('util/globals', mockGlobals);
    mockery.registerMock('service/identity', mockIdentity);
    mockery.registerMock('service/persistence', mockPersistence);
    mockery.registerMock('util/utils', mockUtils);
    mockery.registerMock('imports?_=lodash!lodash', _);

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
          recentCall,
          resultTime;
      
      beacon.init();
      
      expect(mockPersistence.store.set)
        .toHaveBeenCalled();

      recentCall = mockPersistence.store.set.mostRecentCall;

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
          params;

      beacon.init();
      beacon.send();
      expect(mockTransport.transport.send).toHaveBeenCalled();

      payload = mockTransport.transport.send.mostRecentCall.args[0];

      expect(payload.method)
        .toBe('POST');

      expect(payload.path)
        .toBe('/api/blips');

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
    });

  });

  describe('#track', function() {

    it('should not send anything if the first two params are not provided', function() {

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
          };
      
      beacon.init();
      
      beacon.track(
        userActionParams.category,
        userActionParams.action,
        userActionParams.label,
        userActionParams.value
      );

      expect(mockTransport.transport.send)
        .toHaveBeenCalled();

      payload = mockTransport.transport.send.mostRecentCall.args[0];

      expect(payload.method)
        .toBe('POST');

      expect(payload.path)
        .toBe('/api/blips');

      params = payload.params;

      assertCommonParams(params);

      expect(params.userAction)
        .toEqual(userActionParams);
    });

  });
});
