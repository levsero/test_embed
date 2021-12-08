import { UPDATE_ACKNOWLEDGED } from 'classicSrc/redux/modules/customerProvidedPrefill/action-types'

export const updateAcknowledged = (type, id, timestamp) => ({
  type: UPDATE_ACKNOWLEDGED,
  payload: {
    type,
    id,
    timestamp,
  },
})
