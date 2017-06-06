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
      'utility/utils': {
        getEnvironment: () => 'production'
      }
    });

    mockery.registerAllowable(loggingPath);
    logging = requireUncached(loggingPath).logging;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('errorMessageBlacklist', () => {
    let patternList;

    const accessControl = {
      name: 'Access-Control-Allow-Origin',
      pattern: /Access-Control-Allow-Origin/,
      validMatches: [
        'Access-Control-Allow-Origin',
        '\'Access-Control-Allow-Origin\' header is present on the requested resource. ' +
        'Origin \'foo.com\' is therefore not allowed access'
      ],
      invalidMatches: [
        'access-control-allow-origin',
        123
      ]
    };
    const timeoutExceeded = {
      name: 'timeout of [0-9]+ms exceeded',
      pattern: /timeout of [0-9]+ms exceeded/,
      validMatches: [
        'timeout of 312ms exceeded',
        'timeout of 9001ms exceeded',
        'timeout of 1ms exceeded'
      ],
      invalidMatches: [
        'timeout of ms exceeded',
        'timeout of -1ms exceeded'
      ]
    };
    const scriptError = {
      name: '^(\(unknown\): )?(Script error).?$',
      pattern: /^(\(unknown\): )?(Script error).?$/,
      validMatches: [
        '(unknown): Script error',
        '(unknown): Script error.',
        'Script error.',
        'Script error'
      ],
      invalidMatches: [
        '(unknown): ',
        '(unknown): .',
        'script error'
      ]
    };
    const blacklistedErrors = [accessControl, timeoutExceeded, scriptError];

    const patternExistSpec = (patternName) => {
      it('should exist in pattern list', () => {
        expect(patternList.indexOf(patternName))
          .not.toEqual(-1);
      });
    };
    const patternValidatorSpec = (pattern, errorStrings, expectation = true) => {
      const regexp = new RegExp(pattern);

      errorStrings.forEach((errorString) => {
        it(`should return ${expectation}`, () => {
          expect(regexp.test(errorString))
            .toBe(expectation);
        });
      });
    };

    beforeEach(() => {
      patternList = logging.errorMessageBlacklist;
    });

    it('should test at least 1 element', () => {
      expect(_.size(blacklistedErrors))
        .toBeGreaterThan(0);
    });

    blacklistedErrors.forEach((blacklistedError) => {
      const { name, pattern, validMatches, invalidMatches } = blacklistedError;

      describe(name, () => {
        patternExistSpec(name);

        describe('when error strings are valid', () => {
          patternValidatorSpec(pattern, validMatches, true);
        });

        describe('when error strings are invalid', () => {
          patternValidatorSpec(pattern, invalidMatches, false);
        });
      });
    });
  });

  describe('#init', () => {
    describe('when useRollbar is true', () => {
      beforeEach(() => {
        logging.init(true);
      });

      it('should call init on Rollbar', () => {
        const expectation = {
          accessToken: '94eb0137fdc14471b21b34c5a04f9359',
          endpoint: 'https://rollbar-eu.zendesk.com/api/1/',
          hostWhiteList: ['assets.zd-staging.com', 'assets.zendesk.com']
        };

        expect(rollbarInitSpy)
          .toHaveBeenCalledWith(jasmine.objectContaining(expectation));
      });

      it('should not init Airbrake', () => {
        expect(airbrakeInitSpy)
          .not.toHaveBeenCalled();
      });
    });

    describe('when useRollbar is false', () => {
      beforeEach(() => {
        logging.init();
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

      it('should not init Rollbar', () => {
        expect(rollbarInitSpy)
          .not.toHaveBeenCalled();
      });
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
          logging.init(true);
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
