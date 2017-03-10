describe('boot', () => {
  let boot,
    mockRegistry;
  const bootPath = buildSrcPath('boot');

  beforeEach(() => {
    mockery.enable();

    const registerImportSpy = (name, ...methods) => {
      return {
        [name]: jasmine.createSpyObj(name, methods)
      };
    };

    mockRegistry = initMockRegistry({
      'service/authentication': registerImportSpy('authentication', 'init'),
      'service/beacon': registerImportSpy('beacon', 'setConfig', 'sendPageView', 'trackSettings', 'sendConfigLoadTime'),
      'service/i18n': registerImportSpy('i18n', 'init', 'setLocale'),
      'service/identity': registerImportSpy('identity', 'init'),
      'service/logging': registerImportSpy('logging', 'init', 'error'),
      'service/settings': {
        settings: {
          get: noop,
          getTrackSettings: () => {
            return {
              webWidget: {
                authenticate: true
              }
            };
          }
        }
      },
      'service/transport': registerImportSpy('transport', 'get'),
      'service/mediator': { mediator: registerImportSpy('channel', 'broadcast', 'subscribe')  },
      'service/renderer': registerImportSpy('renderer', 'init', 'postRenderCallbacks'),
      'utility/devices': {
        appendMetaTag: noop,
        clickBusterHandler: noop,
        getMetaTagsByName: noop,
        isMobileBrowser: noop
      },
      'utility/mobileScaling': {
        initMobileScaling: noop
      }
    });

    mockery.registerAllowable(bootPath);
    boot = requireUncached(bootPath).boot;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#getConfig', () => {
    let win,
      postRenderQueue,
      transportSpy,
      mockGetCalls;

    beforeEach(() => {
      win = {};
      postRenderQueue = [];

      transportSpy = mockRegistry['service/transport'].transport;
      mockGetCalls = transportSpy.get.calls;
    });

    it('makes a GET request to /embeddable/config', () => {
      boot.getConfig(win, postRenderQueue);

      const params = {
        method: 'get',
        path: '/embeddable/config',
        callbacks: {
          done: jasmine.any(Function),
          fail: jasmine.any(Function)
        }
      };

      expect(transportSpy.get)
        .toHaveBeenCalledWith(jasmine.objectContaining(params), false);
    });

    describe('when the request succeeds', () => {
      let doneHandler,
        beaconSpy,
        rendererSpy;
      const config = {};

      beforeEach(() => {
        jasmine.clock().install();
        jasmine.clock().mockDate(new Date());

        spyOn(boot, 'handlePostRenderQueue');
        boot.getConfig(win, postRenderQueue);

        doneHandler = mockGetCalls.mostRecent().args[0].callbacks.done;
        beaconSpy = mockRegistry['service/beacon'].beacon;
        rendererSpy = mockRegistry['service/renderer'].renderer;
        Math.random = jasmine.createSpy('random').and.returnValue(1);

        doneHandler({ body: config });
      });

      afterEach(() => {
        jasmine.clock().uninstall();
      });

      it('calls beacon.setConfig with the config', () => {
        expect(beaconSpy.setConfig)
          .toHaveBeenCalledWith(config);
      });

      it('calls beacon.sendPageView', () => {
        expect(beaconSpy.sendPageView)
          .toHaveBeenCalled();
      });

      it('calls renderer.init with the config', () => {
        expect(rendererSpy.init)
          .toHaveBeenCalled();
      });

      it('calls handlePostRenderQueue', () => {
        expect(boot.handlePostRenderQueue)
          .toHaveBeenCalledWith(win, postRenderQueue);
      });

      it('should not call beacon.sendConfigLoadTime', () => {
        expect(beaconSpy.sendConfigLoadTime)
          .not.toHaveBeenCalled();
      });

      describe('when win.zESettings is not defined', () => {
        beforeEach(() => {
          win.zESettings = undefined;
          doneHandler({ body: config });
        });

        it('should not call beacon.trackSettings', () => {
          expect(beaconSpy.trackSettings)
            .not.toHaveBeenCalled();
        });
      });

      describe('when one in ten times', () => {
        beforeEach(() => {
          // Simulate a 1/10 chance.
          Math.random = jasmine.createSpy('random').and.returnValue(0.1);

          // Simulate 1 second passing between the call to config, and the response.
          boot.getConfig(win, postRenderQueue);
          jasmine.clock().tick(1000);
          doneHandler({ body: config });
        });

        it('should call beacon.sendConfigLoadTime with the load time', () => {
          expect(beaconSpy.sendConfigLoadTime)
            .toHaveBeenCalledWith(1000);
        });
      });

      describe('when win.zESettings is defined', () => {
        beforeEach(() => {
          win.zESettings = { authenticate: 'boo' };
          doneHandler({ body: config });
        });

        it('should call beacon.trackSettings', () => {
          expect(beaconSpy.trackSettings)
            .toHaveBeenCalledWith({
              webWidget: {
                authenticate: true
              }
            });
        });
      });
    });

    describe('when the request fails', () => {
      let failHandler,
        loggingSpy;

      beforeEach(() => {
        boot.getConfig(win, postRenderQueue);

        failHandler = mockGetCalls.mostRecent().args[0].callbacks.fail;
        loggingSpy = mockRegistry['service/logging'].logging;
      });

      describe('when the error status code is 404', () => {
        beforeEach(() => {
          failHandler({ status: 404 });
        });

        it('should not call logging.error', () => {
          expect(loggingSpy.error)
            .not.toHaveBeenCalled();
        });
      });

      describe('when the error status code is not 404', () => {
        const error = { status: 500 };

        beforeEach(() => {
          document.zendeskHost = 'pizza.zendesk.com';
          failHandler(error);
        });

        it('should call logging.error', () => {
          expect(loggingSpy.error)
            .toHaveBeenCalledWith({
              error,
              context: {
                account: 'pizza.zendesk.com'
              }
            });
        });
      });
    });
  });
});
