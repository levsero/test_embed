import FatalError from 'errors/FatalError'

export default class InfiniteLoopError extends FatalError {
  constructor(message) {
    super(message, 'InfiniteLoopError')
  }
}
