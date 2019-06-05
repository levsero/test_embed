import logger from '../logger';

describe('#error', () => {
  /* eslint no-console:0 */
  const errPayload = {
    error: {
      message: 'error'
    }
  };
  const logMsg = 'test msg';

  beforeEach(() => {
    console.log = jest.fn();
    console.info = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
  });

  it('logs to console.log', () => {
    logger.log(logMsg, errPayload);
    expect(console.log).toHaveBeenCalledWith(logMsg, errPayload);
  });

  it('logs to console.info', () => {
    logger.info(logMsg, errPayload);
    expect(console.info).toHaveBeenCalledWith(logMsg, errPayload);
  });

  it('logs to console.warn', () => {
    logger.warn(logMsg, errPayload);
    expect(console.warn).toHaveBeenCalledWith(logMsg, errPayload);
  });

  it('logs to console.error', () => {
    logger.error(logMsg, errPayload);
    expect(console.error).toHaveBeenCalledWith(logMsg, errPayload);
  });
});
