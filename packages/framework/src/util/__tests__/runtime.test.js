import { store } from 'src/framework/services/persistence'
import { inDebugMode } from '../runtime'

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
