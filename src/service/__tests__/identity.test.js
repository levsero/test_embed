import { identity } from '../identity';
import { store } from 'service/persistence';

jest.useFakeTimers();

beforeEach(() => {
  store.clear();
});

describe('getBuid', () => {
  it('returns a previously set buid', () => {
    store.set('buid', 'abc123');

    const buid = identity.getBuid();

    expect(buid)
      .toEqual('abc123');
  });

  it('sets a new buid if none is available', () => {
    const buid = identity.getBuid();

    expect(store.get('buid'))
      .toEqual(buid);
  });
});

describe('init', () => {
  it('initializes a new suid', () => {
    identity.init();

    expect(store.get('suid'))
      .toEqual(
        expect.objectContaining({
          id: expect.any(String),
          expiry: expect.any(Number),
          tabs: { count: 1, expiry: 0 }
        })
      );
  });

  it('increments tab count if suid already exists', () => {
    identity.init();
    const id = store.get('suid').id;

    identity.init();
    expect(store.get('suid'))
      .toEqual(
        expect.objectContaining({
          id,
          expiry: expect.any(Number),
          tabs: { count: 2, expiry: 0 }
        })
      );
  });

  it('generates a new suid if the current one is expired', () => {
    store.set('suid', {
      id: 1234,
      expiry: 12345,
    });

    identity.init();

    const newId = store.get('suid').id;

    expect(newId)
      .not.toEqual(1234);

    expect(store.get('suid'))
      .toEqual(
        expect.objectContaining({
          id: expect.any(String),
          expiry: expect.any(Number),
          tabs: { count: 1, expiry: 0 }
        })
      );
  });
});

describe('getSuid', () => {
  it('generates a new suid if it does not exist currently', () => {
    const suid = identity.getSuid();

    expect(suid)
      .toEqual(
        expect.objectContaining({
          id: expect.any(String),
          expiry: expect.any(Number),
          tabs: { count: 1, expiry: 0 }
        })
      );
  });

  it('returns the current suid if it already exists and is not expired', () => {
    const oldSuid = identity.getSuid();
    const newSuid = identity.getSuid();

    expect(newSuid)
      .toEqual(oldSuid);
  });

  it('generates a new suid if the current one is expired', () => {
    store.set('suid', {
      id: 1234,
      expiry: 12345,
    });

    const suid = identity.getSuid();

    expect(suid.id)
      .not.toEqual(1234);

    expect(suid)
      .toEqual(
        expect.objectContaining({
          id: expect.any(String),
          expiry: expect.any(Number),
          tabs: { count: 1, expiry: 0 }
        })
      );
  });
});

describe('unload', () => {
  it('is noop if suid does not exist', () => {
    expect(() => {
      identity.unload();
    }).not.toThrow();
  });

  it('decrements tab count of suid', () => {
    store.set('suid', {
      id: 1,
      expiry: 1234,
      tabs: { count: 4, expiry: 5 }
    });
    identity.unload();

    const suid = store.get('suid');

    expect(suid.tabs.expiry)
      .not.toEqual(5);
    expect(suid)
      .toEqual(
        expect.objectContaining({
          id: 1,
          expiry: 1234,
          tabs: { count: 3, expiry: expect.any(Number) }
        })
      );
  });
});
