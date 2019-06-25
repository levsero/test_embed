import AbstractError from 'errors/AbstractError';

export default class NonFatalError extends AbstractError {
  constructor(name = 'NonFatalError', message) {
    super(name, message);
  }
}
