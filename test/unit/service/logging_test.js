describe('logging', function() {
  var logging,
      mockRegistry,
      loggingPath = buildSrcPath('service/logging');

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

    it('should register Airbrake id and key on init', function() {
      logging.init();

      expect(Airbrake.setProject)
        .toHaveBeenCalledWith('100143', 'abcbe7f85eb9d5e1e77ec0232b62c6e3');
    });

  });

});
