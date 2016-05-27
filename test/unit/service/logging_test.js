describe('logging', function() {
  let logging;
  let mockRegistry;
  const loggingPath = buildSrcPath('service/logging');

  beforeEach(function() {
    mockery.enable();
    mockRegistry = initMockRegistry({
      'airbrake-js': jasmine.createSpy().and.returnValue(
          setProject: jasmine.createSpy(),
          addFilter: jasmine.createSpy()
        };
      })
    });

    mockery.registerAllowable(loggingPath);
    logging = requireUncached(loggingPath).logging;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  fdescribe('#init', function() {
    it('should register Airbrake id and key on init and add errors to filter', function() {
      const mockAirbrake = mockRegistry['airbrake-js'];

      logging.init();

      expect(mockAirbrake.setProject)
        .toHaveBeenCalledWith('124081', '8191392d5f8c97c8297a08521aab9189');

      expect(mockAirbrake.addFilter)
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

      expect(Airbrake.push)
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
});
