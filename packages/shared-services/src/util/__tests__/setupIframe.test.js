import { setReferrerMetas } from 'src/util/globals'
import setupIframe from 'src/util/setup-iframe'

jest.mock('src/util/globals')

describe('setupIframe', () => {
  let mockComputedStyle = {},
    mockDoc = {
      documentElement: {},
    }

  beforeEach(() => {
    jest.spyOn(window, 'getComputedStyle').mockImplementation(() => mockComputedStyle)
    setReferrerMetas.mockImplementation(() => {})
  })

  afterEach(() => {
    window.getComputedStyle.mockRestore()
    setReferrerMetas.mockRestore()
  })

  describe('when Iframe is provied', () => {
    beforeEach(() => {
      setupIframe({}, mockDoc)
    })

    it('expect setReferrerMetas to have been called', () => {
      expect(setReferrerMetas).toHaveBeenCalled()
    })
  })

  describe('when Iframe has not been provided', () => {
    beforeEach(() => {
      setupIframe(null, mockDoc)
    })

    it('expect setReferrerMetas not to have been called', () => {
      expect(setReferrerMetas).not.toHaveBeenCalled()
    })
  })
})
