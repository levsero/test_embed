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
      'service/logging': registerImportSpy('logging', 'init'),
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
      transportSpy;

    beforeEach(() => {
      win = {};
      postRenderQueue = [];
      transportSpy = mockRegistry['service/transport'].transport;
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

    });

    describe('when the request fails', () => {

    });
  });
});
