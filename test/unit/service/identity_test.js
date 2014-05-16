var mockery = require('mockery');

describe('identity', function() {
  var identity,
      mockPersistence = {
        store: { 
          get: function() {},
          set: function() {}
        }
      };

  beforeEach(function() {
    mockery.enable();
    mockery.registerMock('service/persistence', mockPersistence);
    mockery.registerAllowable(buildPath('service/identity'));
    identity = require(buildPath('service/identity')).identity;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#getBuid', function() {
    it('returns a previously set buid', function() {
      var buid;
      spyOn(mockPersistence.store, 'get').andReturn('abc123');

      buid = identity.getBuid();

      expect(mockPersistence.store.get).toHaveBeenCalledWith('buid');
      expect(buid).toEqual('abc123');
    });

    it('sets a new buid if none is available', function() {
      var buid, recentCall;

      spyOn(mockPersistence.store, 'get').andReturn(undefined);
      spyOn(mockPersistence.store, 'set');

      buid = identity.getBuid();

      expect(mockPersistence.store.set).toHaveBeenCalled();

      recentCall = mockPersistence.store.set.mostRecentCall;

      expect(recentCall.args[0]).toEqual('buid');
      expect(typeof recentCall.args[1]).toEqual('string');
      expect(recentCall.args[1].length).toEqual(32);
    });

  });

});
