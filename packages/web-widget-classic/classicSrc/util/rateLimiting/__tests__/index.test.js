import { beacon } from '@zendesk/widget-shared-services/beacon'
import rateLimiting from '../'
import * as helpers from '../helpers'

jest.mock('../helpers')

jest.mock('@zendesk/widget-shared-services/beacon')

describe('rateLimiting', () => {
  let apiCall, errorCallback

  beforeEach(() => {
    Date.now = () => 7300000
    apiCall = jest.fn()
    errorCallback = jest.fn()
  })

  describe('when rate limited', () => {
    beforeEach(() => {
      helpers.isRateLimited.mockReturnValue(true)

      rateLimiting(apiCall, {}, 'queue', errorCallback)
    })

    it('calls out to beacon', () => {
      expect(beacon.trackUserAction).toHaveBeenCalledWith('api', 'rateLimited', {
        label: 'queue',
      })
    })

    it('makes the api call', () => {
      expect(apiCall).toHaveBeenCalled()
    })
  })

  describe('when not rate limited', () => {
    beforeEach(() => {
      helpers.isRateLimited.mockReturnValue(false)

      rateLimiting(apiCall, 'payload', 'queue', errorCallback)
    })

    it('does not call out to beacon', () => {
      expect(beacon.trackUserAction).not.toHaveBeenCalled()
    })

    it('makes the api call', () => {
      expect(apiCall).toHaveBeenCalledWith('payload')
    })
  })
})
