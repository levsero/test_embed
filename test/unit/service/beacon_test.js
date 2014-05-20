describe('beacon', function() {
  var beacon,
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
      },
      mockPersistence = {
        store: jasmine.createSpyObj('store', ['set', 'get'])
      },
      mockTransport = {
        transport: jasmine.createSpyObj('transport', ['send'])
      },
      mockIdentity = {
        identity: {
          getBuid: function() {}
        }
      },
      mockUtils = {
          parseUrl: function() {
            return {
              href: 'http://document.referrer'
            };
          }
      },

      beaconPath = buildPath('service/beacon');

  beforeEach(function() {
    mockery.enable();
    
    mockery.registerMock('service/transport', mockTransport);
    mockery.registerMock('util/globals', mockGlobals);
    mockery.registerMock('service/identity', mockIdentity);
    mockery.registerMock('service/persistence', mockPersistence);
    mockery.registerMock('util/utils', mockUtils);

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

      expect(resultTime > (currentTime - 1))
        .toBeTruthy();

      expect(resultTime < (currentTime + 1))
        .toBeTruthy();
    });
  });

  describe('#send', function() {
    it('sends correct payload using transport.send', function() {
      var payload, params;

      spyOn(mockIdentity.identity, 'getBuid').andReturn('abc123');

      beacon.init();
      beacon.send();
      expect(mockTransport.transport.send).toHaveBeenCalled();

      payload = mockTransport.transport.send.mostRecentCall.args[0];
      expect(payload.method).toBe('POST');
      expect(payload.path).toBe('/api/blips');

      params = payload.params;

      /* jshint sub:true */
      expect(params['url']).toBe(mockGlobals.win.location.href);
      expect(params['buid']).toBe('abc123');
      expect(params['user_agent']).toBe(mockGlobals.navigator.userAgent);
      expect(params['referrer']).toBe(mockUtils.parseUrl().href);
      expect(params['navigator_language']).toBe(mockGlobals.navigator.language);
      expect(params['page_title']).toBe(mockGlobals.document.title);
    });
  });

});

