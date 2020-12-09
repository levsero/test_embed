import FatalError from '../FatalError'

describe('FatalError', () => {
  const customErrorMsg = 'Danger Will Robinson!'
  const fatalError = new FatalError(customErrorMsg)

  it('is an instance of a fatal error type', function() {
    expect(fatalError instanceof FatalError).toEqual(true)
  })

  it('is also an instance of the builtin javascript Error type', function() {
    expect(fatalError instanceof Error).toEqual(true)
  })

  it('behaves like a regular Error object', function() {
    expect(fatalError.name).toEqual('FatalError')
    expect(fatalError.message).toEqual(customErrorMsg)
    expect(typeof fatalError.stack).toEqual('string')
  })

  it('includes a stacktrace which includes the error message', function() {
    expect(fatalError.stack.includes(customErrorMsg))
  })
})

describe('extending FatalError', () => {
  class FatalTestError extends FatalError {
    constructor(message) {
      super('FatalTestError', message)
    }
  }

  const error = new FatalTestError()

  it('is still an instance of a fatal error type', function() {
    expect(error instanceof FatalError).toEqual(true)
  })

  it('is also an instance of the builtin javascript Error type', function() {
    expect(error instanceof Error).toEqual(true)
  })
})
