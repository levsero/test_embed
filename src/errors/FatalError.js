import AbstractError from 'errors/AbstractError'

export default class FatalError extends AbstractError {
  constructor(message, name = 'FatalError') {
    super(message, name)
  }
}
