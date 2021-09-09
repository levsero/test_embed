import { getNativeFunction, isNativeFunction } from 'src/util/native'
import { setWindowScroll } from 'src/util/scrollHacks'

jest.mock('src/util/native')

describe('setWindowScroll', () => {
  afterEach(() => {
    global.scrollTo = jest.fn()
    jest.clearAllMocks()
  })

  describe('when scrollTo has been overridden', () => {
    it('calls the restored native scrollTo', () => {
      const mockScrollTo = jest.fn()
      isNativeFunction.mockImplementation(() => false)
      getNativeFunction.mockImplementation(() => mockScrollTo)
      setWindowScroll(1)

      expect(getNativeFunction).toHaveBeenCalledWith('scrollTo')
      expect(mockScrollTo).toHaveBeenCalledWith(0, 1)
    })
  })

  describe('when scrollTo has not been overridden', () => {
    it('calls the window scrollTo', () => {
      isNativeFunction.mockImplementation(() => true)
      setWindowScroll(1)

      expect(getNativeFunction).not.toHaveBeenCalled()
      expect(global.scrollTo).toHaveBeenCalledWith(0, 1)
    })
  })
})
