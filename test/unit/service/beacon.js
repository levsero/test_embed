var mockery = require('mockery');


describe('beacon', function() {
  var beacon,
      mockGlobals = {
        win: jasmine.createSpy(),
        document: jasmine.createSpyObj('document', ['referrer']),
        navigator: jasmine.createSpy()
      },
      mockPersistence = {
        store: jasmine.createSpyObj('store', ['set', 'get'])
      },
      mockTransport = {
        transport: jasmine.createSpyObj('transport', ['send'])
      },
      beaconPath = buildPath('service/beacon');

  beforeEach(function() {
    mockery.enable({
      warnOnReplace: false
    });
    
    mockery.registerMock('service/transport', mockTransport);
    mockery.registerMock('util/globals', mockGlobals);
    mockery.registerMock('service/identity', {});
    mockery.registerMock('service/persistence', mockPersistence);
    mockery.registerMock('util/utils', {});

    mockery.registerAllowable(beaconPath);
    beacon = require(beaconPath).beacon;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#init', function() {
    it('Saves the currentTime', function() {
      var currentTime = Date.now();
      var recentCall;
      beacon.init();
      
      expect(mockPersistence.store.set)
        .toHaveBeenCalled();

      recentCall = mockPersistence.store.set.mostRecentCall;

      expect(recentCall.args[0])
        .toEqual('currentTime');
      expect(recentCall.args[1])
        .toBeCloseTo(currentTime, 1);
    });
  });

  describe('#send', function() {
    it('uses transport.send', function() {
      //beacon.init();
      //beacon.send({});
      //expect(mockTransport.transport.send).toHaveBeenCalled();
    });
  });

});

