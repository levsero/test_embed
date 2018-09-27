describe('boot', () => {
  let boot,
    mockGetErrorReportingEnabled;
  const registerImportSpy = (name, ...methods) => {
    return {
      [name]: jasmine.createSpyObj(name, methods)
    };
  };
  const bootPath = buildSrcPath('boot'),
    beaconSpy = registerImportSpy('beacon', 'setConfig', 'sendPageView', 'trackSettings', 'sendConfigLoadTime'),
    i18nSpy = registerImportSpy('i18n', 'init', 'setLocale'),
    identitySpy = registerImportSpy('identity', 'init'),
    loggingSpy = registerImportSpy('logging', 'init', 'error'),
    persistenceSpy = registerImportSpy('persistence', 'store'),
    transportSpy = registerImportSpy('http', 'get', 'init', 'updateConfig'),
    mediatorSpy = { mediator: registerImportSpy('channel', 'broadcast', 'subscribe') },
    rendererSpy = registerImportSpy('renderer', 'init', 'postRenderCallbacks'),
    gaSpy = registerImportSpy('GA', 'init');

  let updateEmbeddableConfigSpy = jasmine.createSpy('updateEmbeddableConfig');

  beforeEach(() => {
    mockery.enable();

    mockGetErrorReportingEnabled = false;

    initMockRegistry({
      'service/beacon': beaconSpy,
      'service/i18n': i18nSpy,
      'service/identity': identitySpy,
      'service/logging': loggingSpy,
      'service/persistence': persistenceSpy,
      'service/analytics/googleAnalytics': gaSpy,
      'service/settings': {
        settings: {
          get: noop,
          init: noop,
          getTrackSettings: () => {
            return {
              webWidget: {
                authenticate: true
              }
            };
          },
          getErrorReportingEnabled: () => mockGetErrorReportingEnabled
        }
      },
      'service/transport': transportSpy,
      'service/mediator': mediatorSpy,
      'service/renderer': rendererSpy,
      'src/redux/createStore': () => ({
        dispatch: jasmine.createSpy.and.callThrough()
      }),
      'utility/devices': {
        appendMetaTag: noop,
        clickBusterHandler: noop,
        getMetaTagsByName: noop,
        isMobileBrowser: noop
      },
      'utility/mobileScaling': {
        initMobileScaling: noop
      },
      'utility/window': {
        initResizeMonitor: noop
      },
      'src/redux/modules/base': {
        handleIdentifyRecieved: noop,
        logout: noop,
        updateEmbeddableConfig: updateEmbeddableConfigSpy
      },
      'src/redux/modules/helpCenter': {
        displayArticle: noop,
        setContextualSuggestionsManually: noop
      },
      'src/redux/modules/settings': {
        updateSettings: noop
      },
      'src/redux/modules/chat': {
        chatLogout: noop
      }
    });

    mockery.registerAllowable(bootPath);
    boot = requireUncached(bootPath).boot;
  });

  afterEach(() => {
    updateEmbeddableConfigSpy.calls.reset();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#setupServices', () => {
    it('sets up the services', () => {
      boot.setupServices({});
      expect(identitySpy.identity.init)
        .toHaveBeenCalled();
      expect(transportSpy.http.init)
        .toHaveBeenCalled();
      expect(gaSpy.GA.init)
        .toHaveBeenCalled();
    });

    describe('zendeskHost', () => {
      beforeEach(() => {
        document.zendeskHost = 'test.zendesk.com';
        boot.setupServices({});
      });

      afterEach(() => {
        document.zendeskHost = null;
      });

      it('gets the zendeskHost from document', () => {
        expect(transportSpy.http.init)
          .toHaveBeenCalledWith(jasmine.objectContaining({
            zendeskHost: 'test.zendesk.com'
          }));
      });
    });

    describe('zendesk.web_widget.id', () => {
      beforeEach(() => {
        document.zendesk = { web_widget: { id: 'test3.zendesk.com' } }; // eslint-disable-line camelcase
        boot.setupServices({});
      });

      afterEach(() => {
        document.zendesk = null;
      });

      it('gets the zendeskHost from document', () => {
        expect(transportSpy.http.init)
          .toHaveBeenCalledWith(jasmine.objectContaining({
            zendeskHost: 'test3.zendesk.com'
          }));
      });
    });

    describe('web_widget.id', () => {
      beforeEach(() => {
        document.web_widget = { id: 'test2.zendesk.com' }; // eslint-disable-line camelcase
        boot.setupServices({});
      });

      afterEach(() => {
        document.web_widget = null; // eslint-disable-line camelcase
      });

      it('gets the zendeskHost from document', () => {
        expect(transportSpy.http.init)
          .toHaveBeenCalledWith(jasmine.objectContaining({
            zendeskHost: 'test2.zendesk.com'
          }));
      });
    });

    describe('when settings.getErrorReportingDisabled returns true', () => {
      beforeEach(() => {
        mockGetErrorReportingEnabled = true;
        boot.setupServices({});
      });

      it('calls logging.init with errorReportingDisabled as true', () => {
        expect(loggingSpy.logging.init)
          .toHaveBeenCalledWith(true);
      });
    });

    describe('when settings.getErrorReportingDisabled returns false', () => {
      beforeEach(() => {
        mockGetErrorReportingEnabled = false;
        boot.setupServices({});
      });

      it('calls logging.init with errorReportingDisabled as false', () => {
        expect(loggingSpy.logging.init)
          .toHaveBeenCalledWith(false);
      });
    });
  });

  describe('#getConfig', () => {
    let win,
      postRenderQueue,
      mockGetCalls;

    beforeEach(() => {
      win = {};
      postRenderQueue = [];

      mockGetCalls = transportSpy.http.get.calls;
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

      expect(transportSpy.http.get)
        .toHaveBeenCalledWith(jasmine.objectContaining(params), false);
    });

    describe('when the request succeeds', () => {
      let doneHandler;
      let config = {};

      beforeEach(() => {
        jasmine.clock().install();
        jasmine.clock().mockDate(new Date());

        spyOn(boot, 'handlePostRenderQueue');
        let reduxStore = {
          dispatch: jasmine.createSpy().and.callThrough()
        };

        boot.getConfig(win, postRenderQueue, reduxStore);
        doneHandler = mockGetCalls.mostRecent().args[0].callbacks.done;

        Math.random = jasmine.createSpy('random').and.returnValue(1);

        doneHandler({ body: config });
      });

      afterEach(() => {
        jasmine.clock().uninstall();
      });

      it('calls updateEmbeddableConfig with the correct args', () => {
        expect(updateEmbeddableConfigSpy)
          .toHaveBeenCalledWith(config);
      });

      it('calls beacon.setConfig with the config', () => {
        expect(beaconSpy.beacon.setConfig)
          .toHaveBeenCalledWith(config);
      });

      it('does not update http config if hostMapping is not present', () => {
        expect(transportSpy.http.updateConfig)
          .not.toHaveBeenCalled();
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

      it('does not call beacon.sendConfigLoadTime', () => {
        expect(beaconSpy.beacon.sendConfigLoadTime)
          .not.toHaveBeenCalled();
      });

      describe('filterEmbeds', () => {
        describe('talk config is available but talk feature is not', () => {
          beforeAll(() => {
            document.zendesk = {
              web_widget: { // eslint-disable-line camelcase
                features: ['chat']
              }
            };

            config = {
              embeds: {
                'helpCenterForm': {
                  'embed': 'helpCenter',
                  'props': {
                    'position': 'right'
                  }
                },
                'talk': {
                  'embed': 'talk',
                  'props': {
                    'color': 'black'
                  }
                }
              }
            };
          });

          it('filters out talk from config', () => {
            expect(beaconSpy.beacon.setConfig)
              .toHaveBeenCalledWith({
                embeds: {
                  'helpCenterForm': {
                    'embed': 'helpCenter',
                    'props': {
                      'position': 'right'
                    }
                  }
                }
              });
          });
        });

        describe('chat config is available but chat feature is not', () => {
          beforeAll(() => {
            document.zendesk = {
              web_widget: { // eslint-disable-line camelcase
                features: ['help_center']
              }
            };

            config = {
              newChat: true,
              embeds: {
                'helpCenterForm': {
                  'embed': 'helpCenter',
                  'props': {
                    'position': 'right'
                  }
                },
                'zopimChat': {
                  'embed': 'chat',
                  'props': {
                    'zopimId': 'P6xCvZrbOWtNh1gArZXCkD0q0MnIvAfA'
                  }
                }
              }
            };
          });

          it('filters out zopimChat from config', () => {
            expect(beaconSpy.beacon.setConfig)
              .toHaveBeenCalledWith({
                newChat: true,
                embeds: {
                  'helpCenterForm': {
                    'embed': 'helpCenter',
                    'props': {
                      'position': 'right'
                    }
                  }
                }
              });
          });
        });
      });

      describe('when hostMapping is present', () => {
        beforeAll(() => {
          config = {
            hostMapping: 'test.zd.com'
          };
        });

        it('updates http config', () => {
          expect(transportSpy.http.updateConfig)
            .toHaveBeenCalledWith({ hostMapping: 'test.zd.com' });
        });
      });

      describe('when win.zESettings is not defined', () => {
        beforeEach(() => {
          win.zESettings = undefined;
          doneHandler({ body: config });
        });

        it('does not call beacon.trackSettings', () => {
          expect(beaconSpy.beacon.trackSettings)
            .not.toHaveBeenCalled();
        });
      });

      describe('when win.zESettings is defined', () => {
        beforeEach(() => {
          win.zESettings = { authenticate: 'boo' };
          doneHandler({ body: config });
        });

        it('calls beacon.trackSettings', () => {
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

        it('calls beacon.sendConfigLoadTime with the load time', () => {
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

        it('does not call logging.error', () => {
          expect(loggingSpy.logging.error)
            .not.toHaveBeenCalled();
        });
      });

      describe('when the error status code is not 404', () => {
        const error = { status: 500 };

        describe('using zendeskHost', () => {
          beforeEach(() => {
            document.zendeskHost = 'pizza.zendesk.com';
            failHandler(error);
          });

          it('calls logging.error', () => {
            expect(loggingSpy.logging.error)
              .toHaveBeenCalledWith({
                error,
                context: {
                  account: 'pizza.zendesk.com'
                }
              });
          });

          afterEach(() => {
            document.zendeskHost = null;
          });
        });

        describe('using widget.id', () => {
          beforeEach(() => {
            document.web_widget = { id: 'pepperoni.zendesk.com' }; // eslint-disable-line camelcase
            failHandler(error);
          });

          it('calls logging.error', () => {
            expect(loggingSpy.logging.error)
              .toHaveBeenCalledWith({
                error,
                context: {
                  account: 'pepperoni.zendesk.com'
                }
              });
          });

          afterEach(() => {
            document.web_widget = null; // eslint-disable-line camelcase
          });
        });

        describe('using zendesk.widget.id', () => {
          beforeEach(() => {
            document.zendesk = { web_widget: { id: 'anchovy.zendesk.com' } }; // eslint-disable-line camelcase
            failHandler(error);
          });

          it('calls logging.error', () => {
            expect(loggingSpy.logging.error)
              .toHaveBeenCalledWith({
                error,
                context: {
                  account: 'anchovy.zendesk.com'
                }
              });
          });

          afterEach(() => {
            document.zendesk = null;
          });
        });
      });
    });
  });
});
