export const getLastUpdateAcknowledged = (state, type, id) =>
  state.customerProvidedPrefill.acknowledged[type]?.[id]
export const getLastTimestamp = (state, type) =>
  state.customerProvidedPrefill.types[type]?.timestamp
export const getValues = (state, type) => state.customerProvidedPrefill.types[type]?.values
