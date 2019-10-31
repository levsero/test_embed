import NonFatalError from 'errors/NonFatalError'

export default class HttpApiError extends NonFatalError {
  constructor(data) {
    super(data.message, 'HttpApiError')
    this.data = data
  }
}
