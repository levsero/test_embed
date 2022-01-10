import { isNativeFunction } from '../native'
import { setWindowScroll } from '../scrollHacks'

jest.mock('../native')

describe('setWindowScroll', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('when scrollTo has been overridden', () => {
    it('calls the restored native scrollTo', () => {
      global.scrollTo = jest.fn()
      isNativeFunction.mockImplementation(() => false)
      setWindowScroll(1)

      expect(global.scrollTo).toHaveBeenCalledWith(0, 1)
    })
  })

  describe('when scrollTo has not been overridden', () => {
    it('calls the parents window scrollTo', () => {
      global.parent.scrollTo = jest.fn()
      isNativeFunction.mockImplementation(() => true)
      setWindowScroll(1)

      expect(global.parent.scrollTo).toHaveBeenCalledWith(0, 1)
    })
  })
})
