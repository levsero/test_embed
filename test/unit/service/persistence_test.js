describe('store', () => {
  let store,
    mockLocalStorage,
    mockSessionStorage;
  const prefix = 'ZD-';
  const persistencePath = buildSrcPath('service/persistence');

  beforeEach(() => {
    mockery.enable();

    mockLocalStorage = {
      getItem: noop,
      setItem: noop,
      removeItem: noop,
      clear: noop
    };
    mockSessionStorage = _.extend({}, mockLocalStorage);

    initMockRegistry({
      'utility/globals': {
        win: {
          localStorage: mockLocalStorage,
          sessionStorage: mockSessionStorage
        }
      },
      'lodash': _
    });

    mockery.registerAllowable(persistencePath);
    store = requireUncached(persistencePath).store;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#get', () => {
    it('should return a value local storage', () => {
      const key = 'abc';
      const value = 'xyz';

      spyOn(mockSessionStorage, 'getItem');
      spyOn(mockLocalStorage, 'getItem')
        .and.returnValue(value);

      expect(store.get(key))
        .toEqual(value);

      expect(mockLocalStorage.getItem)
        .toHaveBeenCalledWith(prefix + key);
      expect(mockSessionStorage.getItem).not.toHaveBeenCalled();
    });

    it('should deserialized a JSON string from local storage', () => {
      const key = 'abc';
      const value = {a: [1, 2], b: ['abc', 'def']};

      spyOn(mockLocalStorage, 'getItem')
        .and.returnValue(JSON.stringify(value));

      spyOn(mockSessionStorage, 'getItem');

      expect(store.get(key))
        .toEqual(value);

      expect(mockLocalStorage.getItem)
        .toHaveBeenCalledWith(prefix + key);
    });

    it('should return a value from session storage', () => {
      const key = 'abc';
      const value = 'xyz';

      spyOn(mockSessionStorage, 'getItem')
        .and.returnValue(value);

      spyOn(mockLocalStorage, 'getItem');

      expect(store.get(key, 'session'))
        .toEqual(value);

      expect(mockSessionStorage.getItem)
        .toHaveBeenCalledWith(prefix + key);

      expect(mockLocalStorage.getItem).not.toHaveBeenCalled();
    });
  });

  describe('#set', () => {
    beforeEach(() => {
      spyOn(mockLocalStorage, 'setItem');
      spyOn(mockSessionStorage, 'setItem');
    });

    it('should save a value to local storage', () => {
      const key = 'abc';
      const value = 'xyz';

      store.set(key, value);

      expect(mockLocalStorage.setItem)
        .toHaveBeenCalledWith(prefix + key, value);
    });

    it('should save a value to session storage', () => {
      const key = 'abc';
      const value = 'xyz';

      store.set(key, value, 'session');

      expect(mockSessionStorage.setItem)
        .toHaveBeenCalledWith(prefix + key, value);
    });

    it('should serialize an object before saving', () => {
      const key = 'abc';
      const value = {a: [1, 2], b: ['abc', 'def']};

      store.set(key, value);
      expect(mockLocalStorage.setItem)
        .toHaveBeenCalledWith(prefix + key, JSON.stringify(value));

      const recentCall = mockLocalStorage.setItem.calls.mostRecent();

      expect(JSON.parse(recentCall.args[1])).toEqual(value);
    });
  });

  describe('#remove', () => {
    beforeEach(() => {
      spyOn(mockLocalStorage, 'removeItem');
      spyOn(mockSessionStorage, 'removeItem');
    });

    it('removes an item from local storage', () => {
      const key = 'abc';

      store.remove(key);

      expect(mockLocalStorage.removeItem)
        .toHaveBeenCalledWith(prefix + key);
      expect(mockSessionStorage.removeItem).not.toHaveBeenCalled();
    });

    it('removes an item from session storage', () => {
      const key = 'abc';

      store.remove(key, 'session');

      expect(mockSessionStorage.removeItem)
        .toHaveBeenCalledWith(prefix + key);
      expect(mockLocalStorage.removeItem).not.toHaveBeenCalled();
    });
  });

  describe('#clear', () => {
    beforeEach(() => {
      spyOn(mockSessionStorage, 'removeItem');
      spyOn(mockLocalStorage,   'removeItem');
    });

    it('should only delete ZD-* keys in the local storage store', () => {
      // We're using _.keys to retreive the keys in storage
      spyOn(_, 'keys')
        .and.returnValue(['ZD-a', 'ZD-b', 'dont-delete']);

      store.clear();

      expect(mockLocalStorage.removeItem)
        .toHaveBeenCalledWith('ZD-a');

      expect(mockLocalStorage.removeItem)
        .toHaveBeenCalledWith('ZD-b');

      expect(mockLocalStorage.removeItem)
        .not.toHaveBeenCalledWith('dont-delete');
    });

    it('should only delete ZD-* keys in the session storage store', () => {
      // We're using _.keys to retreive the keys in storage
      spyOn(_, 'keys')
        .and.returnValue(['ZD-a', 'ZD-b', 'dont-delete']);

      store.clear('session');

      expect(mockSessionStorage.removeItem)
        .toHaveBeenCalledWith('ZD-a');

      expect(mockSessionStorage.removeItem)
        .toHaveBeenCalledWith('ZD-b');

      expect(mockSessionStorage.removeItem)
        .not.toHaveBeenCalledWith('dont-delete');
    });
  });
});
