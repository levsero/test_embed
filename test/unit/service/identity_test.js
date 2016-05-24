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

  describe('getBuid', function() {
    it('returns a previously set buid', function() {
      spyOn(mockPersistence.store, 'get').and.returnValue('abc123');

      const buid = identity.getBuid();

      expect(mockPersistence.store.get)
        .toHaveBeenCalledWith('buid');
      expect(buid)
        .toEqual('abc123');
    });

    it('sets a new buid if none is available', function() {
      spyOn(mockPersistence.store, 'get').and.returnValue(undefined);
      spyOn(mockPersistence.store, 'set');

      identity.getBuid();

      expect(mockPersistence.store.set).toHaveBeenCalled();

      const recentCall = mockPersistence.store.set.calls.mostRecent();

      expect(recentCall.args[0])
        .toEqual('buid');
      expect(typeof recentCall.args[1])
        .toEqual('string');
      expect(recentCall.args[1].length)
        .toEqual(32);
    });
  });

  describe('init', function() {
    describe('if there is no suid in local storage', function() {
      it('generates a new suid and stores it', function() {
        spyOn(mockPersistence.store, 'get').and.returnValue(undefined);
        spyOn(mockPersistence.store, 'set');

        identity.init();

        const recentCall = mockPersistence.store.set.calls.mostRecent();

        expect(recentCall.args[0])
          .toEqual('suid');
        expect(recentCall.args[1].tabs.count)
          .toEqual(1);
      });
    });

    describe('if there is a suid in local storage', function() {
      let recentCall;
      const mockSuid = {
        id: '123abc',
        expiry: Date.now() + 1000*60*15,
        tabs: {
          count: 1,
          expiry: 0
        }
      };

      beforeEach(function() {
        spyOn(mockPersistence.store, 'get').and.returnValue(mockSuid);
        spyOn(mockPersistence.store, 'set');

        identity.init();

        recentCall = mockPersistence.store.set.calls.mostRecent();
      });

      it('does not generate a new id', function() {
        expect(recentCall.args[1].id)
          .toEqual('123abc');
      });

      it('updates the expiry time on the suid', function() {
        const expires = Date.now() + 1000*60*15;

        expect(recentCall.args[1].expiry > (expires - 30))
          .toBeTruthy();
        expect(recentCall.args[1].expiry < (expires + 30))
          .toBeTruthy();
      });

      it('increments the count of tabs', function() {
        expect(recentCall.args[1].tabs.count)
          .toEqual(2);
      });
    });
  });

  describe('unload', function() {
    let recentCall;
    const mockSuid = {
      id: '123abc',
      expiry: 12345,
      tabs: {
        count: 2,
        expiry: 0
      }
    };

    beforeEach(function() {
      spyOn(mockPersistence.store, 'get').and.returnValue(mockSuid);
      spyOn(mockPersistence.store, 'set');

      identity.unload();

      recentCall = mockPersistence.store.set.calls.mostRecent();
    });

    it('decrements the count of tabs', function() {
      expect(recentCall.args[1].tabs.count)
        .toEqual(1);
    });

    it('does not update the expiry', function() {
      expect(recentCall.args[1].expiry)
        .toEqual(12345);
    });

    it('updates the tab expiry', function() {
      const expires = Date.now() + 1000*30;

      expect(recentCall.args[1].tabs.expiry > (expires - 30))
        .toBeTruthy();
      expect(recentCall.args[1].tabs.expiry < (expires + 30))
        .toBeTruthy();
    });
  });

  describe('getSuid', function() {
    it('returns the suid', function() {
      const mockSuid = {
        id: '123abc',
        expiry: Date.now() + 1000*60*15,
        tabs: {
          count: 1,
          expiry: 0
        }
      };

      spyOn(mockPersistence.store, 'get').and.returnValue(mockSuid);

      expect(identity.getSuid())
        .toEqual(mockSuid);
    });

    it('creates a new suid if none is found', function() {
      spyOn(mockPersistence.store, 'set');

      identity.getSuid();

      const recentCall = mockPersistence.store.set.calls.mostRecent();

      expect(recentCall.args[0])
        .toEqual('suid');
      expect(recentCall.args[1].tabs.count)
        .toEqual(1);
    });
  });
});
