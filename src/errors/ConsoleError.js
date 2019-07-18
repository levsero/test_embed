import AbstractError from 'errors/AbstractError'

// Any errors that inherit from ConsoleError will be logged to the end users browser console

export default class ConsoleError extends AbstractError {
  constructor(message, name = 'ConsoleError') {
    super(message, name)
  }
}
