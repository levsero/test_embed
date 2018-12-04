import { store } from '../persistence';
import { win } from 'utility/globals';

describe('localStorage', () => {
  beforeEach(() => {
    store.clear();
  });

  test('can set then get', () => {
    store.set('here', 1234);

    expect(store.get('here'))
      .toEqual(1234);
  });

  test('can set then get objects', () => {
    store.set('objects', { x: 1, y: 1 });

    expect(store.get('objects'))
      .toEqual({ x: 1, y: 1 });
  });

  test('returns null for non-existent keys', () => {
    expect(store.get('objects'))
      .toBeNull();
  });

  test('can remove keys', () => {
    store.set('val', 123);

    expect(store.get('val'))
      .toEqual(123);

    store.remove('val');

    expect(store.get('val'))
      .toBeNull();
  });

  test('clear only removes zd keys', () => {
    win.localStorage.setItem('hello', 1234);

    store.set('world', 5678);

    store.clear();

    expect(win.localStorage.getItem('hello'))
      .toEqual('1234');

    expect(store.get('world'))
      .toBeNull();
  });
});

describe('sessionStorage', () => {
  beforeEach(() => {
    store.clear('session');
  });

  test('can set then get', () => {
    store.set('here', 1234, 'session');

    expect(store.get('here', 'session'))
      .toEqual(1234);
  });

  test('can set then get objects', () => {
    store.set('objects', { x: 1, y: 1 }, 'session');

    expect(store.get('objects', 'session'))
      .toEqual({ x: 1, y: 1 });
  });

  test('returns null for non-existent keys', () => {
    expect(store.get('objects', 'session'))
      .toBeNull();
  });

  test('can remove keys', () => {
    store.set('val', 123, 'session');

    expect(store.get('val', 'session'))
      .toEqual(123);

    store.remove('val', 'session');

    expect(store.get('val', 'session'))
      .toBeNull();
  });

  test('clear only removes zd keys', () => {
    win.sessionStorage.setItem('hello', 1234);

    store.set('world', 5678, 'session');

    store.clear('session');

    expect(win.localStorage.getItem('hello', 'session'))
      .toEqual('1234');

    expect(store.get('world', 'session'))
      .toBeNull();
  });
});
