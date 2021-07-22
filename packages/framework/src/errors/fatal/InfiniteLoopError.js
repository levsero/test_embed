import FatalError from 'src/errors/FatalError'

export default class InfiniteLoopError extends FatalError {
  constructor(message) {
    super(message, 'InfiniteLoopError')
  }
}
