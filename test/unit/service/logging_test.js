describe('logging', function() {
  let logging,
      mockRegistry;
  const loggingPath = buildSrcPath('service/logging');

  beforeEach(function() {
    mockery.enable({useCleanCache: true});
    mockRegistry = initMockRegistry({
      'airbrake-js': jasmine.createSpy()
    });

    mockery.registerAllowable(loggingPath);
    logging = require(loggingPath).logging;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#init', function() {

    it('should register Airbrake id and key on init and add errors to filter', function() {
      logging.init();

      expect(Airbrake.setProject)
        .toHaveBeenCalledWith('100143', 'abcbe7f85eb9d5e1e77ec0232b62c6e3');

      expect(Airbrake.addFilter)
        .toHaveBeenCalled();
    });

  });

  describe('#error', function() {
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
