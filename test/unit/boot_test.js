describe('boot', () => {
  let boot;
  const registerImportSpy = (name, ...methods) => {
    return {
      [name]: jasmine.createSpyObj(name, methods)
    };
  };
  const bootPath = buildSrcPath('boot'),
    authenticationSpy = registerImportSpy('authentication', 'init'),
    beaconSpy = registerImportSpy('beacon', 'setConfig', 'sendPageView', 'trackSettings', 'sendConfigLoadTime'),
    i18nSpy = registerImportSpy('i18n', 'init', 'setLocale'),
    identitySpy = registerImportSpy('identity', 'init'),
    loggingSpy = registerImportSpy('logging', 'init', 'error'),
    persistenceSpy = registerImportSpy('persistence', 'store'),
    transportSpy = registerImportSpy('transport', 'get'),
    mediatorSpy = { mediator: registerImportSpy('channel', 'broadcast', 'subscribe') },
    rendererSpy = registerImportSpy('renderer', 'init', 'postRenderCallbacks');

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'service/authentication': authenticationSpy,
      'service/beacon': beaconSpy,
      'service/i18n': i18nSpy,
      'service/identity': identitySpy,
      'service/logging': loggingSpy,
      'service/persistence': persistenceSpy,
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
      'service/transport': transportSpy,
      'service/mediator': mediatorSpy,
      'service/renderer': rendererSpy,
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
      mockGetCalls;

    beforeEach(() => {
      win = {};
      postRenderQueue = [];

      mockGetCalls = transportSpy.transport.get.calls;
    });

    describe('when win.zESkipWebWidget is true', () => {
      beforeEach(() => {
        win.zESkipWebWidget = true;
        boot.getConfig(win, postRenderQueue);
      });

      it('does not call /embeddable/config', () => {
        expect(transportSpy.transport.get)
          .not.toHaveBeenCalled();
      });

      it('should call renderer.init with automatic answers only', () => {
        expect(rendererSpy.renderer.init)
          .toHaveBeenCalledWith(jasmine.objectContaining({
            embeds: {
              automaticAnswers: {
                embed: 'automaticAnswers'
              }
            }
          }));
      });
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

      expect(transportSpy.transport.get)
        .toHaveBeenCalledWith(jasmine.objectContaining(params), false);
    });

    describe('when the request succeeds', () => {
      let doneHandler;
      const config = {};

      beforeEach(() => {
        jasmine.clock().install();
        jasmine.clock().mockDate(new Date());

        spyOn(boot, 'handlePostRenderQueue');
        boot.getConfig(win, postRenderQueue);
        doneHandler = mockGetCalls.mostRecent().args[0].callbacks.done;

        Math.random = jasmine.createSpy('random').and.returnValue(1);

        doneHandler({ body: config });
      });

      afterEach(() => {
        jasmine.clock().uninstall();
      });

      it('calls beacon.setConfig with the config', () => {
        expect(beaconSpy.beacon.setConfig)
          .toHaveBeenCalledWith(config);
      });

      it('calls beacon.sendPageView', () => {
        expect(beaconSpy.beacon.sendPageView)
          .toHaveBeenCalled();
      });

      it('calls renderer.init with the config', () => {
        expect(rendererSpy.renderer.init)
          .toHaveBeenCalled();
      });

      it('calls handlePostRenderQueue with win and postRenderQueue', () => {
        expect(boot.handlePostRenderQueue)
          .toHaveBeenCalledWith(win, postRenderQueue);
      });

      it('should not call beacon.sendConfigLoadTime', () => {
        expect(beaconSpy.beacon.sendConfigLoadTime)
          .not.toHaveBeenCalled();
      });

      describe('when win.zESettings is not defined', () => {
        beforeEach(() => {
          win.zESettings = undefined;
          doneHandler({ body: config });
        });

        it('should not call beacon.trackSettings', () => {
          expect(beaconSpy.beacon.trackSettings)
            .not.toHaveBeenCalled();
        });
      });

      describe('when win.zESettings is defined', () => {
        beforeEach(() => {
          win.zESettings = { authenticate: 'boo' };
          doneHandler({ body: config });
        });

        it('should call beacon.trackSettings', () => {
          expect(beaconSpy.beacon.trackSettings)
            .toHaveBeenCalledWith({
              webWidget: {
                authenticate: true
              }
            });
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
          expect(beaconSpy.beacon.sendConfigLoadTime)
            .toHaveBeenCalledWith(1000);
        });
      });
    });

    describe('when the request fails', () => {
      let failHandler;

      beforeEach(() => {
        boot.getConfig(win, postRenderQueue);

        failHandler = mockGetCalls.mostRecent().args[0].callbacks.fail;
      });

      describe('when the error status code is 404', () => {
        beforeEach(() => {
          failHandler({ status: 404 });
        });

        it('should not call logging.error', () => {
          expect(loggingSpy.logging.error)
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
          expect(loggingSpy.logging.error)
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
