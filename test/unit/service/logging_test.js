describe('logging', function() {
  let logging,
    airbrakeInitSpy,
    airbrakeAddFilterSpy,
    airbrakeWrapSpy,
    airbrakeNotifySpy,
    mockRegistry;
  const loggingPath = buildSrcPath('service/logging');

  beforeEach(function() {
    mockery.enable();

    airbrakeInitSpy = jasmine.createSpy('init');
    airbrakeAddFilterSpy = jasmine.createSpy('addFilter');
    airbrakeWrapSpy = jasmine.createSpy('wrap');
    airbrakeNotifySpy = jasmine.createSpy('notify');

    mockRegistry = initMockRegistry({
      'airbrake-js': (opts) => {
        airbrakeInitSpy(opts);
        return {
          addFilter: airbrakeAddFilterSpy,
          wrap: airbrakeWrapSpy,
          notify: airbrakeNotifySpy
        };
      },
      'utility/globals': {
        win: { onerror: null }
      }
    });

    mockery.registerAllowable(loggingPath);
    logging = requireUncached(loggingPath).logging;
    logging.init();
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#init', function() {
    let expectedOptions;

    beforeEach(function() {
      expectedOptions = {
        projectId: '124081',
        projectKey: '8191392d5f8c97c8297a08521aab9189',
        onerror: true
      };
    });

    it('should register Airbrake id and key', function() {
      expect(airbrakeInitSpy)
        .toHaveBeenCalledWith(expectedOptions);
    });

    it('should add a filter event handler', () => {
      expect(airbrakeAddFilterSpy)
        .toHaveBeenCalled();
    });

    describe('when main.js is embedded directly on the host page', () => {
      beforeEach(function() {
        mockRegistry['utility/globals'].win = global.window;
        logging = requireUncached(loggingPath).logging;
        logging.init();
      });

      it('should initialise airbrake with `onerror` false', () => {
        expectedOptions.onerror = false;

        expect(airbrakeInitSpy)
          .toHaveBeenCalledWith(expectedOptions);
      });
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

    it('should call Airbrake.notify', function() {
      logging.error(errPayload);

      expect(airbrakeNotifySpy)
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

      expect(airbrakeWrapSpy)
        .toHaveBeenCalledWith(fn);
    });
  });

  describe('errorFilter', () => {
    let notice;

    beforeEach(function() {
      notice = {
        errors: [
          {
            message: ''
          }
        ]
      };
    });

    it('should filter out cross origin errors', () => {
      notice.errors[0].message = 'No \'Access-Control-Allow-Origin\' header is present on the requested resource';
      expect(logging.errorFilter(notice))
        .toEqual(null);
    });

    it('should filter out timeout exceeded errors', () => {
      notice.errors[0].message = 'timeout of 10000ms exceeded';

      expect(logging.errorFilter(notice))
        .toEqual(null);
    });

    it('should not filter out any other errors', () => {
      notice.errors[0].message = 'Attempted to assign to readonly property.';

      expect(logging.errorFilter(notice))
        .toEqual(notice);

      notice.errors[0].message = 'Some other error';

      expect(logging.errorFilter(notice))
        .toEqual(notice);
    });
  });
});
