import AbstractError from 'src/errors/AbstractError'

export default class FatalError extends AbstractError {
  constructor(message, name = 'FatalError') {
    super(message, name)
  }
}
