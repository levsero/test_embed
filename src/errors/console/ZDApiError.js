import ConsoleError from 'errors/ConsoleError';

export default class ZDApiError extends ConsoleError {
  constructor(message) {
    super('ZDApiError', message);
  }
}
