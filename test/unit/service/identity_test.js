describe('identity', function() {
  var identity,
      mockRegistry,
      mockPersistence;

  beforeEach(function() {
    mockery.enable({useCleanCache: true});

    mockPersistence = {
      store: {
        get: noop,
        set: noop
      }
    };

    mockRegistry = initMockRegistry({
      'service/persistence': mockPersistence,
      'imports?_=lodash!lodash': _,
    });

    mockery.registerAllowable(buildSrcPath('service/identity'));
    identity = require(buildSrcPath('service/identity')).identity;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('returns a previously set buid', function() {
    var buid;
    spyOn(mockPersistence.store, 'get').and.returnValue('abc123');

    buid = identity.getBuid();

    expect(mockPersistence.store.get).toHaveBeenCalledWith('buid');
    expect(buid).toEqual('abc123');
  });

  it('sets a new buid if none is available', function() {
    var buid, recentCall;

    spyOn(mockPersistence.store, 'get').and.returnValue(undefined);
    spyOn(mockPersistence.store, 'set');

    buid = identity.getBuid();

    expect(mockPersistence.store.set).toHaveBeenCalled();

    recentCall = mockPersistence.store.set.calls.mostRecent();

    expect(recentCall.args[0]).toEqual('buid');
    expect(typeof recentCall.args[1]).toEqual('string');
    expect(recentCall.args[1].length).toEqual(32);
  });
});
