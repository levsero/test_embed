describe('identity', function() {
  let identity,
    mockPersistence;

  beforeEach(function() {
    mockery.enable();

    mockPersistence = {
      store: {
        get: noop,
        set: noop
      }
    };

    initMockRegistry({
      'service/persistence': mockPersistence
    });

    mockery.registerAllowable(buildSrcPath('service/identity'));
    identity = requireUncached(buildSrcPath('service/identity')).identity;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('returns a previously set buid', function() {
    spyOn(mockPersistence.store, 'get').and.returnValue('abc123');

    const buid = identity.getBuid();

    expect(mockPersistence.store.get).toHaveBeenCalledWith('buid');
    expect(buid).toEqual('abc123');
  });

  it('sets a new buid if none is available', function() {
    spyOn(mockPersistence.store, 'get').and.returnValue(undefined);
    spyOn(mockPersistence.store, 'set');

    identity.getBuid();

    expect(mockPersistence.store.set).toHaveBeenCalled();

    const recentCall = mockPersistence.store.set.calls.mostRecent();

    expect(recentCall.args[0]).toEqual('buid');
    expect(typeof recentCall.args[1]).toEqual('string');
    expect(recentCall.args[1].length).toEqual(32);
  });
});
