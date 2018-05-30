describe('logging', () => {
  let logging,
    airbrakeInitSpy,
    airbrakeAddFilterSpy,
    airbrakeNotifySpy,
    rollbarInitSpy,
    rollbarErrorSpy,
    mockIsIE;
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
      },
      'utility/devices': {
        isIE: () => mockIsIE
      }
    });

    mockery.registerAllowable(loggingPath);
    logging = requireUncached(loggingPath).logging;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('hostBlackList', () => {
    let regex;

    beforeEach(() => {
      regex = new RegExp(logging.hostBlackList[0]);
    });

    describe('when the trace contains patterns to blacklist', () => {
      const traceList = [
        'File https://www.betabrand.com/angular/bower_components/tinymce/tinymce.min.js line 2 col 13017 in m',
        'File "webpack-internal:///./node_modules/component-emitter/index.js" line 133 col 20 in Request.Emitter.emit',
        'File https://v2.zopim.com/ line 7462 col 1 in t.exports</m.increment'
      ];

      it('has at least one entry', () => {
        expect(traceList.length)
          .toBeGreaterThan(0);
      });

      it('returns true for all patterns', () => {
        traceList.forEach((pattern) => {
          expect(regex.test(pattern))
            .toEqual(true);
        });
      });
    });

    describe('when the trace contains patterns that should not be blacklisted', () => {
      const traceList = [
        'File https://assets.zendesk.com/embeddable_framework/main.js line 51 col 1060096 in render/</</<',
        'https://static.zdassets.com/web_widget/00b4ca1a169d2dc52a34f2938e7280039c621394/web_widget.js',
        'https://static-staging.zdassets.com/ekr/asset_composer.js?key=7144da5b-c5f6-4e4a-8e14-3db3d8404d35',
        'assets.zd-staging.com/embeddable_framework/webWidgetPreview.js'
      ];

      it('has at least one entry', () => {
        expect(traceList.length)
          .toBeGreaterThan(0);
      });

      it('returns false for all patterns', () => {
        traceList.forEach((pattern) => {
          expect(regex.test(pattern))
            .toEqual(false);
        });
      });
    });
  });

  describe('errorMessageBlacklist', () => {
    let patternList;

    const accessControl = {
      pattern: 'Access-Control-Allow-Origin',
      validStrings: [
        'Access-Control-Allow-Origin',
        '\'Access-Control-Allow-Origin\' header is present on the requested resource. ' +
        'Origin \'foo.com\' is therefore not allowed access'
      ],
      invalidStrings: [
        'access-control-allow-origin',
        123
      ]
    };
    const timeoutExceeded = {
      pattern: 'timeout of [0-9]+ms exceeded',
      validStrings: [
        'timeout of 312ms exceeded',
        'timeout of 9001ms exceeded',
        'timeout of 1ms exceeded'
      ],
      invalidStrings: [
        'timeout of ms exceeded',
        'timeout of -1ms exceeded'
      ]
    };
    const scriptError = {
      pattern: /^(\(unknown\): )?(Script error).?$/,
      validStrings: [
        '(unknown): Script error',
        '(unknown): Script error.',
        'Script error.',
        'Script error'
      ],
      invalidStrings: [
        '(unknown): ',
        '(unknown): .',
        'script error'
      ]
    };
    const blacklistedErrors = [accessControl, timeoutExceeded, scriptError];

    const patternExistSpec = (pattern) => {
      it('should exist in pattern list', () => {
        const mapFn = (pattern) => pattern.toString();
        const result = _.chain(patternList)
          .map(mapFn)
          .indexOf(pattern.toString())
          .value();

        expect(result)
          .not.toEqual(-1);
      });
    };
    const patternValidatorSpec = (pattern, strings, expectation = true) => {
      const regexp = new RegExp(pattern);

      strings.forEach((string) => {
        it(`should return ${expectation}`, () => {
          expect(regexp.test(string))
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
      const { pattern, validStrings, invalidStrings } = blacklistedError;

      describe(pattern, () => {
        patternExistSpec(pattern);

        describe('when error strings are valid', () => {
          patternValidatorSpec(pattern, validStrings, true);
        });

        describe('when error strings are invalid', () => {
          patternValidatorSpec(pattern, invalidStrings, false);
        });
      });
    });
  });

  describe('#init', () => {
    const rollbarExpectation = {
      accessToken: '94eb0137fdc14471b21b34c5a04f9359',
      endpoint: 'https://rollbar-eu.zendesk.com/api/1/',
      hostWhiteList: ['assets.zd-staging.com', 'assets.zendesk.com']
    };
    const airbrakeExpectation = {
      projectId: '124081',
      projectKey: '8191392d5f8c97c8297a08521aab9189'
    };

    describe('when useRollbar is true and the browser is IE', () => {
      beforeEach(() => {
        const useRollbar = true;

        mockIsIE = true;
        logging.init(useRollbar);
      });

      it('should register Airbrake id and key', () => {
        expect(airbrakeInitSpy)
          .toHaveBeenCalledWith(airbrakeExpectation);
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

    describe('when useRollbar is true and the browser is not IE', () => {
      beforeEach(() => {
        const useRollbar = true;

        mockIsIE = false;
        logging.init(useRollbar);
      });

      it('should call init on Rollbar', () => {
        expect(rollbarInitSpy)
          .toHaveBeenCalledWith(jasmine.objectContaining(rollbarExpectation));
      });

      it('should not init Airbrake', () => {
        expect(airbrakeInitSpy)
          .not.toHaveBeenCalled();
      });
    });

    describe('when useRollbar is false and the browser is IE', () => {
      beforeEach(() => {
        const useRollbar = false;

        mockIsIE = true;
        logging.init(useRollbar);
      });

      it('should register Airbrake id and key', () => {
        expect(airbrakeInitSpy)
          .toHaveBeenCalledWith(airbrakeExpectation);
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

    describe('when useRollbar is false and the browser is not IE', () => {
      beforeEach(() => {
        const useRollbar = false;

        mockIsIE = false;
        logging.init(useRollbar);
      });

      it('should register Airbrake id and key', () => {
        expect(airbrakeInitSpy)
          .toHaveBeenCalledWith(airbrakeExpectation);
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

      describe('when logging service is not initialised', () => {
        beforeEach(() => {
          logging.error(errPayload);
        });

        it('should not call rollbar.error', () => {
          expect(rollbarErrorSpy)
            .not.toHaveBeenCalled();
        });

        it('should not call airbrake.notify', () => {
          expect(airbrakeNotifySpy)
            .not.toHaveBeenCalled();
        });
      });

      describe('when logging service is initialised', () => {
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
});
