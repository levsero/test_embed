import AbstractError from 'src/errors/AbstractError'

export default class NonFatalError extends AbstractError {
  constructor(message, name = 'NonFatalError') {
    super(message, name)
  }
}
