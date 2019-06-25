import AbstractError from 'errors/AbstractError';

export default class FatalError extends AbstractError {
  constructor(name = 'FatalError', message) {
    super(name, message);
  }
}
