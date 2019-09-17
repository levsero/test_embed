import NonFatalError from 'errors/NonFatalError'

export default class ZEApiError extends NonFatalError {
  constructor(message) {
    super(message, 'ZEApiError')
  }
}
