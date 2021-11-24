import { errorTracker } from 'src/errorTracker'
import { logger } from 'src/logger'

export const logAndTrackApiError = (apiError) => {
  logger.error(apiError.message)
  errorTracker.warn(apiError.realError || apiError, {
    rollbarFingerprint: apiError.rollbarFingerprint,
    rollbarTitle: apiError.rollbarTitle,
  })
}
