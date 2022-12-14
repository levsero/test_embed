import { errorTracker } from '@zendesk/widget-shared-services'

const errorLoggerMiddleware = (_store) => (next) => (action) => {
  try {
    return next(action)
  } catch (err) {
    errorTracker.error(err || new Error('Unknown reason'), {
      rollbarFingerprint: 'Something failed in the store',
      rollbarTitle: 'Something failed in the store',
      action,
    })
    throw err
  }
}

export default errorLoggerMiddleware
