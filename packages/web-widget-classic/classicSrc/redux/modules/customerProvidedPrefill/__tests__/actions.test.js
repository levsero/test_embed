import { UPDATE_ACKNOWLEDGED } from '../action-types'
import { updateAcknowledged } from '../actions'

describe('customerProvidedPrefill actions', () => {
  describe('updateAcknowledged', () => {
    it('returns an action for when an update has been acknowledged', () => {
      expect(updateAcknowledged('some type', 'some id', 123)).toEqual({
        type: UPDATE_ACKNOWLEDGED,
        payload: {
          type: 'some type',
          id: 'some id',
          timestamp: 123,
        },
      })
    })
  })
})
