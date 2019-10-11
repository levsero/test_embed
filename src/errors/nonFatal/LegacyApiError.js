import NonFatalError from 'errors/NonFatalError'

export default class LegacyApiError extends NonFatalError {
  constructor(message) {
    super(message, 'LegacyApiError')
  }
}
