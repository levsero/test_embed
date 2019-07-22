import NonFatalError from 'errors/NonFatalError'

export default class ApiExecuteError extends NonFatalError {
  constructor(message) {
    super(message, 'ApiExecuteError')
  }
}
