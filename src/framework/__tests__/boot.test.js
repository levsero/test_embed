import framework from '../index'

import * as globals from 'utility/globals'

describe('setupIframe', () => {
  let mockComputedStyle = {},
    mockDoc = {
      documentElement: {}
    }

  beforeEach(() => {
    jest.spyOn(window, 'getComputedStyle').mockImplementation(() => mockComputedStyle)
    jest.spyOn(globals, 'setReferrerMetas').mockImplementation(() => {})
  })

  afterEach(() => {
    window.getComputedStyle.mockRestore()
    globals.setReferrerMetas.mockRestore()
  })

  describe('when Iframe is provied', () => {
    beforeEach(() => {
      framework.setupIframe({}, mockDoc)
    })

    it('expect setReferrerMetas to have been called', () => {
      expect(globals.setReferrerMetas).toHaveBeenCalled()
    })
  })

  describe('when Iframe has not been provided', () => {
    beforeEach(() => {
      framework.setupIframe(null, mockDoc)
    })

    it('expect setReferrerMetas not to have been called', () => {
      expect(globals.setReferrerMetas).not.toHaveBeenCalled()
    })
  })
})
