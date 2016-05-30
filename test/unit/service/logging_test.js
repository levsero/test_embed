describe('logging', function() {
  let logging,
    mockAirbrakeClient;
  const loggingPath = buildSrcPath('service/logging');

  beforeEach(function() {
    mockery.enable();
    const mockRegistry = initMockRegistry({
      'airbrake-js': jasmine.createSpy().and.returnValue({
        setProject: jasmine.createSpy(),
        addFilter: jasmine.createSpy(),
        wrap: jasmine.createSpy(),
        notify: jasmine.createSpy()
      })
    });

    mockAirbrakeClient = mockRegistry['airbrake-js']();

    mockery.registerAllowable(loggingPath);
    logging = requireUncached(loggingPath).logging;
    logging.init();
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#init', function() {
    it('should register Airbrake id and key on init and add errors to filter', function() {
      expect(mockAirbrakeClient.setProject)
        .toHaveBeenCalledWith(
          '124081',
          '8191392d5f8c97c8297a08521aab9189'
        );

      expect(mockAirbrakeClient.addFilter)
        .toHaveBeenCalled();
    });
  });

  describe('#error', function() {
    /* eslint no-console:0 */
    const errPayload = {
      error: {
        message: 'error'
      }
    };

    beforeEach(function() {
      global.__DEV__ = false;
      spyOn(console, 'error');
      spyOn(logging, 'error').and.callThrough();
    });

    it('should call Airbrake.push', function() {
      logging.error(errPayload);

      expect(mockAirbrakeClient.notify)
        .toHaveBeenCalledWith(errPayload);
    });

    it('should call console.error in dev environment', function() {
      global.__DEV__ = true;
      logging.error(errPayload);

      expect(console.error)
        .toHaveBeenCalledWith(errPayload.error.message);
    });

    it('should throw when special flag is set on error object', function() {
      const err = errPayload;

      err.error.special = true;

      expect(logging.error.bind(this, err))
        .toThrow();
    });
  });

  describe('wrap', function() {
    it('should call airbrake.wrap() with the passed in callback', function() {
      const fn = () => {};

      logging.wrap(fn);

      expect(mockAirbrakeClient.wrap)
        .toHaveBeenCalledWith(fn);
    });
  });

  describe('errorFilter', function() {
    let errMessage,
      notice;

    beforeEach(function() {
      errMessage = 'No \'Access-Control-Allow-Origin\' header is present on the requested resource';
      notice = {
        errors: [
          { message: errMessage }
        ]
      };
    });

    it('should filter out cross origin errors', function() {
      expect(logging.errorFilter(notice))
        .toBe(null);
    });

    it('should filter out timeout exceeded errors', function() {
      errMessage = 'timeout of 10000ms exceeded';
      notice.errors[0].message = errMessage;

      expect(logging.errorFilter(notice))
        .toBe(null);
    });

    it('should not filter out any other errors', function() {
      errMessage = 'Attempted to assign to readonly property.';
      notice.errors[0].message = errMessage;

      expect(logging.errorFilter(notice))
        .toBe(notice);

      errMessage = 'Some other error';
      notice.errors[0].message = errMessage;

      expect(logging.errorFilter(notice))
        .toBe(notice);
    });
  });
});
