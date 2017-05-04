describe('logging', () => {
  let logging,
    airbrakeInitSpy,
    airbrakeAddFilterSpy,
    airbrakeNotifySpy,
    rollbarInitSpy,
    rollbarErrorSpy;
  const loggingPath = buildSrcPath('service/logging');

  beforeEach(() => {
    mockery.enable();

    airbrakeInitSpy = jasmine.createSpy('airbrakeInit');
    airbrakeAddFilterSpy = jasmine.createSpy('addFilter');
    airbrakeNotifySpy = jasmine.createSpy('notify');

    rollbarInitSpy = jasmine.createSpy('rollbarInit');
    rollbarErrorSpy = jasmine.createSpy('rollbarError');

    initMockRegistry({
      'airbrake-js': (opts) => {
        airbrakeInitSpy(opts);

        return {
          addFilter: airbrakeAddFilterSpy,
          notify: airbrakeNotifySpy
        };
      },
      'vendor/rollbar.umd.nojson.min.js': {
        init: (params) => {
          rollbarInitSpy(params);

          return { error: rollbarErrorSpy };
        }
      },
      'utility/globals': {
        document: document
      }
    });

    mockery.registerAllowable(loggingPath);
    logging = requireUncached(loggingPath).logging;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#enableRollbar', () => {
    beforeEach(() => {
      spyOn(logging, 'enableRollbar');
      logging.enableRollbar();
    });

    describe('when enableRollbar is invoked', () => {
      it('should have been called', () => {
        expect(logging.enableRollbar)
          .toHaveBeenCalled();
      });
    });
  });

  describe('#init', () => {
    beforeEach(() => {
      logging.init();
    });

    it('should call init on Rollbar', () => {
      const expectation = {
        accessToken: '94eb0137fdc14471b21b34c5a04f9359',
        endpoint: 'https://rollbar-eu.zendesk.com/api/1/',
        hostWhiteList: ['assets.zendesk.com']
      };

      expect(rollbarInitSpy)
        .toHaveBeenCalledWith(jasmine.objectContaining(expectation));
    });

    it('should register Airbrake id and key', () => {
      const expectedOptions = {
        projectId: '124081',
        projectKey: '8191392d5f8c97c8297a08521aab9189'
      };

      expect(airbrakeInitSpy)
        .toHaveBeenCalledWith(expectedOptions);
    });

    it('should add a filter event handler', () => {
      expect(airbrakeAddFilterSpy)
        .toHaveBeenCalled();
    });
  });

  describe('#error', () => {
    /* eslint no-console:0 */
    const errPayload = {
      error: {
        message: 'error'
      }
    };

    beforeEach(() => {
      spyOn(console, 'error');
      spyOn(logging, 'error').and.callThrough();
    });

    describe('when environment is in dev mode', () => {
      beforeEach(() => {
        global.__DEV__ = true;
      });

      it('should call console.error in dev environment', () => {
        logging.error(errPayload);

        expect(console.error)
          .toHaveBeenCalledWith(errPayload.error.message);
      });
    });

    describe('when environment is not dev mode', () => {
      beforeEach(() => {
        global.__DEV__ = false;
      });

      describe('when special flag is set on error object', () => {
        afterEach(() => {
          errPayload.error.special = false;
        });

        it('should throw', () => {
          errPayload.error.special = true;

          expect(logging.error.bind(this, errPayload))
            .toThrow();
        });
      });

      describe('when Rollbar is enabled', () => {
        beforeEach(() => {
          logging.init();
          logging.enableRollbar();
          logging.error(errPayload);
        });

        it('should call Rollbar.error', () => {
          expect(rollbarErrorSpy)
            .toHaveBeenCalledWith(errPayload);
        });
      });

      describe('when Rollbar is not enabled', () => {
        beforeEach(() => {
          logging.init();
          logging.error(errPayload);
        });

        it('should call Airbrake.notify', () => {
          expect(airbrakeNotifySpy)
            .toHaveBeenCalledWith(errPayload);
        });
      });
    });
  });

  describe('#errorFilter', () => {
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

  describe('#warn', () => {
    beforeEach(() => {
      spyOn(console, 'warn');
    });

    it('should call warn', () => {
      const subjects = [
        [{ bob: 1 }, { fred: 2 }],
        'Ohmygerd Airbrake'
      ];

      subjects.forEach((subject) => {
        logging.warn(subject);

        expect(console.warn)
          .toHaveBeenCalledWith(subject);
      });
    });
  });
});
