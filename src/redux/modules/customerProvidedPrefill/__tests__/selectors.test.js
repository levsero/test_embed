import { getLastTimestamp, getValues, getLastUpdateAcknowledged } from '../selectors'

describe('customerProvidedPrefill selectors', () => {
  describe('getLastTimestamp', () => {
    it('returns the last timestamp for the given type', () => {
      const state = {
        customerProvidedPrefill: {
          types: {
            prefill: {
              timestamp: 123
            }
          }
        }
      }

      expect(getLastTimestamp(state, 'prefill')).toBe(123)
    })
  })

  describe('getValues', () => {
    it('returns the values for the given type', () => {
      const state = {
        customerProvidedPrefill: {
          types: {
            prefill: {
              values: {
                name: 'Someone',
                email: 'someone@example.com'
              }
            }
          }
        }
      }

      expect(getValues(state, 'prefill')).toEqual({
        name: 'Someone',
        email: 'someone@example.com'
      })
    })
  })

  describe('getLastUpdateAcknowledged', () => {
    it('returns the timestamp of the last update the given id has acknowledged', () => {
      const state = {
        customerProvidedPrefill: {
          acknowledged: {
            prefill: {
              prechatForm: 123
            }
          }
        }
      }

      expect(getLastUpdateAcknowledged(state, 'prefill', 'prechatForm')).toBe(123)
    })

    it('returns undefined if the given id has not acknowledged any identify calls', () => {
      const state = {
        customerProvidedPrefill: {
          acknowledged: {
            prefill: {
              prechatForm: 123
            }
          }
        }
      }

      expect(getLastUpdateAcknowledged(state, 'prefill', 'some id')).toBe(undefined)
    })
  })
})
