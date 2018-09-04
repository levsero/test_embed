describe('logging index', () => {
  let logging,
    rollbarInitSpy,
    rollbarErrorSpy,
    mockIsIE;
  const loggingPath = buildSrcPath('service/logging');

  beforeEach(() => {
    mockery.enable();

    rollbarInitSpy = jasmine.createSpy('rollbarInit');
    rollbarErrorSpy = jasmine.createSpy('rollbarError');

    initMockRegistry({
      'vendor/rollbar.umd.min.js': {
        init: (params) => {
          rollbarInitSpy(params);

          return { error: rollbarErrorSpy };
        }
      },
      'utility/devices': {
        isIE: () => mockIsIE
      },
      './config': {
        rollbarConfig: { foo: 'bar' }
      },
      'utility/utils': {}
    });

    mockery.registerAllowable(loggingPath);
    logging = requireUncached(loggingPath).logging;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#init', () => {
    let mockGetErrorReportingDisabled;

    beforeEach(() => {
      logging.init(mockGetErrorReportingDisabled);
    });

    describe('when getErrorReportingDisabled is false', () => {
      beforeAll(() => {
        mockGetErrorReportingDisabled = false;
      });

      describe('when the browser is IE', () => {
        beforeAll(() => {
          mockIsIE = true;
        });

        it('does not call init', () => {
          expect(rollbarInitSpy)
            .not.toHaveBeenCalled();
        });
      });

      describe('when the browser is not IE', () => {
        beforeAll(() => {
          mockIsIE = false;
        });

        it('calls init', () => {
          expect(rollbarInitSpy)
            .toHaveBeenCalledWith({ foo: 'bar' });
        });
      });
    });

    describe('when getErrorReportingDisabled is true', () => {
      beforeAll(() => {
        mockGetErrorReportingDisabled = true;
      });

      it('does not call init', () => {
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
    const customData = {
      embedName: 'webWidget',
      configItem: {
        embedName: 'webWidget',
        color: '#e99a27',
        position: 'left',
        visible: false
      }
    };

    beforeEach(() => {
      spyOn(console, 'error');
      spyOn(logging, 'error').and.callThrough();
    });

    describe('when environment is in dev mode', () => {
      beforeEach(() => {
        global.__DEV__ = true;

        logging.error(errPayload);
      });

      it('should call console.error in dev environment', () => {
        expect(console.error)
          .toHaveBeenCalledWith(errPayload);
      });
    });

    describe('when environment is not dev mode', () => {
      beforeEach(() => {
        global.__DEV__ = false;
      });

      describe('when special flag is set on error object', () => {
        afterEach(() => {
          _.unset(errPayload, 'error.special');
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
      });

      describe('when logging service is initialised', () => {
        describe('when getErrorReportingDisabled is false', () => {
          beforeEach(() => {
            logging.init(false);
            logging.error(errPayload, customData);
          });

          it('calls Rollbar.error', () => {
            expect(rollbarErrorSpy)
              .toHaveBeenCalledWith(errPayload, customData);
          });
        });

        describe('when getErrorReportingDisabled is true', () => {
          beforeEach(() => {
            logging.init(true);
            logging.error(errPayload, customData);
          });

          it('calls Rollbar.error', () => {
            expect(rollbarErrorSpy)
              .not.toHaveBeenCalled();
          });
        });
      });
    });
  });
});
