import ConsoleError from 'errors/ConsoleError'

export default class ZopimApiError extends ConsoleError {
  constructor(message = 'An error occurred in your use of the $zopim Widget API') {
    super(message, 'ZopimApiError')
  }
}
