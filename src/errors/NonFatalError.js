import AbstractError from 'errors/AbstractError'

export default class NonFatalError extends AbstractError {
  constructor(message, name = 'NonFatalError') {
    super(message, name)
  }
}
