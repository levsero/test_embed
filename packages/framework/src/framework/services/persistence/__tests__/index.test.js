import { store } from '../'
import { win } from 'utility/globals'

describe('localStorage', () => {
  beforeEach(() => {
    store.clear()
    store.enableLocalStorage()
  })

  test('get returns defaults when nothing is set', () => {
    expect(store.get('suid')).toEqual({ id: null, tabs: [] })
  })

  test('can set then get', () => {
    store.set('here', 1234)
    expect(win.localStorage.getItem('ZD-here')).toEqual('1234')

    expect(store.get('here')).toEqual(1234)
  })

  test('can set then get objects', () => {
    store.set('objects', { x: 1, y: 1 })

    expect(store.get('objects')).toEqual({ x: 1, y: 1 })
    expect(win.localStorage.getItem('ZD-objects')).toEqual('{"x":1,"y":1}')
  })

  test('returns null for non-existent keys', () => {
    expect(store.get('objects')).toBeNull()
  })

  test('can remove keys', () => {
    store.set('val', 123)

    expect(store.get('val')).toEqual(123)
    expect(win.localStorage.getItem('ZD-val')).toEqual('123')

    store.remove('val')

    expect(store.get('val')).toBeNull()
    expect(win.localStorage.getItem('ZD-val')).toBeNull()
  })

  test('clear only removes zd keys', () => {
    win.localStorage.setItem('hello', 1234)

    store.set('world', 5678)

    store.clear()

    expect(win.localStorage.getItem('hello')).toEqual('1234')

    expect(store.get('world')).toBeNull()
  })
})

describe('sessionStorage', () => {
  beforeEach(() => {
    store.clear('session')
    store.enableSessionStorage()
  })

  test('can set then get', () => {
    store.set('here', 1234)

    expect(store.get('here')).toEqual(1234)
    expect(win.sessionStorage.getItem('ZD-here')).toEqual('1234')
  })

  test('can set then get objects', () => {
    store.set('objects', { x: 1, y: 1 })

    expect(store.get('objects')).toEqual({ x: 1, y: 1 })
    expect(win.sessionStorage.getItem('ZD-objects')).toEqual('{"x":1,"y":1}')
  })

  test('returns null for non-existent keys', () => {
    expect(store.get('objects')).toBeNull()
  })

  test('can remove keys', () => {
    store.set('val', 123)

    expect(win.sessionStorage.getItem('ZD-val')).toEqual('123')
    expect(store.get('val')).toEqual(123)

    store.remove('val')

    expect(store.get('val')).toBeNull()
    expect(win.sessionStorage.getItem('ZD-val')).toBeNull()
  })

  test('clear only removes zd keys', () => {
    win.sessionStorage.setItem('hello', 1234)

    store.set('world', 5678)

    store.clear('session')

    expect(win.localStorage.getItem('hello')).toEqual('1234')

    expect(store.get('world')).toBeNull()
  })

  test('cannot set when cookies setting is false', () => {
    store.disable()
    store.set('cookies', 'blah')

    expect(store.get('cookies')).toBeNull()
  })

  describe('enableLocalStorage', () => {
    it('returns true if successfully switched to local storage', () => {
      const success = store.enableLocalStorage()

      expect(success).toBe(true)
    })

    it('returns false if failed to switch to local storage', () => {
      const localStorage = win.localStorage
      delete win.localStorage

      const success = store.enableLocalStorage()

      expect(success).toBe(false)
      win.localStorage = localStorage
    })
  })

  describe('enableSessionStorage', () => {
    it('returns true if successfully switched to local storage', () => {
      const success = store.enableSessionStorage()

      expect(success).toBe(true)
    })

    it('returns false if failed to switch to local storage', () => {
      const sessionStorage = win.sessionStorage
      delete win.sessionStorage

      const success = store.enableSessionStorage()

      expect(success).toBe(false)
      win.sessionStorage = sessionStorage
    })
  })
})
