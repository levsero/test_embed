import { store } from 'src/persistence'
import inDebugMode from '../in-debug-mode'

beforeEach(() => {
  store.clear()
})

describe('#inDebugMode', () => {
  it('returns false by default', () => {
    expect(inDebugMode()).toEqual(false)
  })

  describe("when the 'debug' flag is set to true", () => {
    beforeEach(() => {
      store.set('debug', true)
    })

    it('returns true', () => {
      expect(inDebugMode()).toEqual(true)
    })
  })
})
