import AbstractError from 'errors/AbstractError'
import logger from 'utility/logger'
import errorTracker from 'service/errorTracker'

export default class NonFatalError extends AbstractError {
  constructor(message, name = 'NonFatalError') {
    super(message, name)
  }

  track() {
    errorTracker.error(this.name, { actualErrorMessage: this.message })
  }

  log() {
    logger.error(this.message)
  }

  report() {
    this.log()
    this.track()
  }
}
