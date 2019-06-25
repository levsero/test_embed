import extendableError from './extendableError';

export default class AbstractError extends extendableError() {
  constructor(name, message) {
    super(message);
    this.name = name; // NOTE: minification of class names means that we need to specify the error name as a string
    this.message = message;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.name);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}
