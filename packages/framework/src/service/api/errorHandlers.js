import errorTracker from 'src/framework/services/errorTracker'
import logToCustomer from 'src/util/logger'

export const logAndTrackApiError = (apiError) => {
  logToCustomer.error(apiError.message)
  errorTracker.warn(apiError.realError || apiError, {
    rollbarFingerprint: apiError.rollbarFingerprint,
    rollbarTitle: apiError.rollbarTitle,
  })
}
