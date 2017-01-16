describe('logging', function() {
  let logging,
    airbrakeInitSpy,
    airbrakeAddFilterSpy,
    airbrakeWrapSpy,
    airbrakeNotifySpy;
  const loggingPath = buildSrcPath('service/logging');

  beforeEach(function() {
    mockery.enable();

    airbrakeInitSpy = jasmine.createSpy('init');
    airbrakeAddFilterSpy = jasmine.createSpy('addFilter');
    airbrakeWrapSpy = jasmine.createSpy('wrap');
    airbrakeNotifySpy = jasmine.createSpy('notify');

    initMockRegistry({
      'airbrake-js': (opts) => {
        airbrakeInitSpy(opts);
        return {
          addFilter: airbrakeAddFilterSpy,
          wrap: airbrakeWrapSpy,
          notify: airbrakeNotifySpy
        };
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
        projectKey: '8191392d5f8c97c8297a08521aab9189'
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
    let errorA, errorB;

    beforeEach(() => {
      errorA = {
        message: 'Valid error baby!',
        backtrace: [
          { file: 'eval at <anonymous> (https://assets.zendesk.com/embeddable_framework/main.js:1:2), <anonymous>' },
          { file: 'eval at <anonymous> (http://assets.zendesk.com/embeddable_framework/main.js:3:4), <anonymous>' }
        ]
      };
      errorB = {
        message: 'Another valid error baby!',
        backtrace: [
          { file: 'eval at <anonymous> (https://assets.zendesk.com/embeddable_framework/main.js:5:6), <anonymous>' },
          { file: 'eval at <anonymous> (http://assets.zendesk.com/embeddable_framework/main.js:7:8), <anonymous>' }
        ]
      };
      notice = {
        errors: [errorA, errorB]
      };
    });

    describe('when an error is valid', () => {
      it('returns the notice object', () => {
        expect(logging.errorFilter(notice))
          .toBe(notice);
      });

      it('error should not be dropped', () => {
        expect(logging.errorFilter(notice).errors)
          .toContain(errorA);

        expect(logging.errorFilter(notice).errors)
          .toContain(errorB);
      });
    });

    describe('when all errors are invalid', () => {
      it('should return null', () => {
        errorA.message = 'No \'Access-Control-Allow-Origin\' header is present on the requested resource';
        errorB.backtrace[0].file = 'eval at <anonymous> (https://pizzapasta.com/intercom.js:1:2), <anonymous>';
        errorB.backtrace[1].file = 'eval at <anonymous> (https://gyros.com/salesforce.js:3:4), <anonymous>';

        expect(logging.errorFilter(notice))
          .toBe(null);
      });
    });

    describe('when an error contains a cross origin message', () => {
      it('should be dropped', () => {
        errorA.message = 'No \'Access-Control-Allow-Origin\' header is present on the requested resource';

        expect(logging.errorFilter(notice).errors)
          .not.toContain(errorA);
      });
    });

    describe('when an error contains a timeout exceeded error', () => {
      it('should be dropped', () => {
        errorB.message = 'timeout of 10000ms exceeded';

        expect(logging.errorFilter(notice).errors)
          .not.toContain(errorB);
      });
    });

    describe('when error does not originate from embeddable framework', () => {
      it('should be dropped', () => {
        errorA.backtrace[0].file = 'eval at <anonymous> (https://pizzapasta.com/intercom.js:1:2), <anonymous>';
        errorA.backtrace[1].file = 'eval at <anonymous> (https://gyros.com/salesforce.js:3:4), <anonymous>';

        expect(logging.errorFilter(notice).errors)
          .not.toContain(errorA);
      });
    });
  });
});
