import logToCustomer from 'utility/logger'
import errorTracker from 'src/framework/services/errorTracker'

export const logAndTrackApiError = apiError => {
  logToCustomer.error(apiError.message)
  errorTracker.warn(apiError.realError || apiError, {
    rollbarFingerprint: apiError.rollbarFingerprint,
    rollbarTitle: apiError.rollbarTitle
  })
}
