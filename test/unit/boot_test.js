describe('boot', () => {
  let getConfig,
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
      'service/beacon': registerImportSpy('beacon', 'sendPageView', 'trackSettings', 'sendConfigLoadTime'),
      'service/i18n': registerImportSpy('i18n', 'init', 'setLocale'),
      'service/identity': registerImportSpy('identity', 'init'),
      'service/logging': registerImportSpy('logging', 'init', 'error'),
      'service/settings': {
        settings: {
          get: noop
        }
      },
      'service/transport': registerImportSpy('transport', 'get'),
      'service/mediator': { mediator: registerImportSpy('channel', 'broadcast', 'subscribe')  },
      'service/renderer': registerImportSpy('renderer', 'init'),
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
    getConfig = requireUncached(bootPath).getConfig;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('getConfig', () => {
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
      getConfig(win, postRenderQueue);

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
      it('calls beacon.setConfig with the config', () => {

      });

      it('calls beacon.sendPageView', () => {

      });

      it('calls renderer.init with the config', () => {

      });

      it('calls handlePostRenderQueue', () => {

      });

      describe('when one in ten times', () => {
        it('should call beacon.sendConfigLoadTime with the load time', () => {

        });
      });

      describe('when win.zESettings is defined', () => {
        it('should call beacon.trackSettings', () => {

        });
      });
    });

    describe('when the request fails', () => {
      let failHandler,
        loggingSpy;

      beforeEach(() => {
        getConfig(win, postRenderQueue);

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
