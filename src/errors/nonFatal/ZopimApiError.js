import NonFatalError from 'errors/NonFatalError'

export default class ZopimApiError extends NonFatalError {
  constructor(message) {
    super(message, 'ZopimApiError')
  }
}
