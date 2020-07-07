describe('boot', () => {
  let boot, mockGetErrorReportingEnabled, mockHost
  const registerImportSpy = (name, ...methods) => {
    return {
      [name]: jasmine.createSpyObj(name, methods)
    }
  }

  const bootPath = buildSrcPath('boot'),
    beaconSpy = registerImportSpy(
      'beacon',
      'setConfig',
      'sendPageView',
      'trackSettings',
      'setConfigLoadTime',
      'trackLocaleDiff'
    ),
    identitySpy = registerImportSpy('identity', 'init'),
    errorTracker = jasmine.createSpyObj('errorTracker', ['init', 'error']),
    transportSpy = registerImportSpy('http', 'send', 'init', 'updateConfig'),
    rendererSpy = registerImportSpy('renderer', 'init', 'postRenderCallbacks', 'run'),
    gaSpy = registerImportSpy('GA', 'init'),
    apiSpy = jasmine.createSpyObj('webWidgetApi', ['apisExecutePostRenderQueue', 'apiSetup']),
    zopimApiSpy = jasmine.createSpyObj('zopimApi', ['setupZopimQueue', 'setUpZopimApiMethods']),
    trackerSpy = jasmine.createSpyObj('tracker', ['send', 'enable']),
    initSpy = jasmine.createSpy('init')

  let updateEmbeddableConfigSpy = jasmine.createSpy('updateEmbeddableConfig')

  beforeEach(() => {
    mockery.enable()

    mockGetErrorReportingEnabled = false

    initMockRegistry({
      'service/beacon': beaconSpy,
      'service/identity': identitySpy,
      'src/framework/services/errorTracker': errorTracker,
      'service/api/webWidgetApi': apiSpy,
      'service/api/zopimApi': zopimApiSpy,
      'service/analytics/googleAnalytics': gaSpy,
      'service/tracker': trackerSpy,
      'service/settings': {
        settings: {
          get: noop,
          init: noop,
          getTrackSettings: () => {
            return {
              webWidget: {
                authenticate: true
              }
            }
          },
          getErrorReportingEnabled: () => mockGetErrorReportingEnabled
        }
      },
      'service/i18n': {
        i18n: {
          init: initSpy,
          setLocale: (_, cb) => {
            cb()
          }
        }
      },
      'service/transport': transportSpy,
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
      'src/redux/modules/base': {
        updateEmbeddableConfig: updateEmbeddableConfigSpy
      },
      'utility/globals': {
        getZendeskHost: () => mockHost
      },
      'service/persistence': {
        store: {
          get: noop
        }
      },
      'src/framework/services/publicApi': {
        registerApi: () => undefined,
        registerLegacyApi: () => undefined,
        run: () => undefined
      },
      'service/api/webWidgetApi/setupApi': {
        getWebWidgetPublicApi: () => ({})
      },
      'service/api/webWidgetApi/setupLegacyApi': {
        getWebWidgetLegacyPublicApi: () => ({})
      }
    })

    mockery.registerAllowable(bootPath)
    boot = requireUncached(bootPath).boot
  })

  afterEach(() => {
    updateEmbeddableConfigSpy.calls.reset()
    mockery.deregisterAll()
    mockery.disable()
  })

  describe('#setupServices', () => {
    it('sets up the services', () => {
      boot.setupServices({})
      expect(identitySpy.identity.init).toHaveBeenCalled()
      expect(gaSpy.GA.init).toHaveBeenCalled()
    })
  })

  describe('#getConfig', () => {
    let win, mockGetCalls

    beforeEach(() => {
      win = {}

      mockGetCalls = transportSpy.http.send.calls
    })

    it('makes a GET request to /embeddable/config', () => {
      boot.getConfig(win)

      const params = {
        method: 'get',
        path: '/embeddable/config',
        callbacks: {
          done: jasmine.any(Function)
        }
      }

      expect(transportSpy.http.send).toHaveBeenCalledWith(jasmine.objectContaining(params), false)
    })

    describe('when the request succeeds', () => {
      let doneHandler, reduxStore
      let config = {
        embeds: {
          a: 1
        }
      }

      beforeEach(() => {
        jasmine.clock().install()
        jasmine.clock().mockDate(new Date())

        reduxStore = {
          dispatch: jasmine.createSpy().and.callThrough()
        }

        boot.getConfig(win, reduxStore)
        doneHandler = mockGetCalls.mostRecent().args[0].callbacks.done

        doneHandler({ body: config })
      })

      afterEach(() => {
        jasmine.clock().uninstall()
      })

      it('calls updateEmbeddableConfig with the correct args', () => {
        expect(updateEmbeddableConfigSpy).toHaveBeenCalledWith(config)
      })

      it('calls beacon.setConfig with the config', () => {
        expect(beaconSpy.beacon.setConfig).toHaveBeenCalledWith(config)
      })

      it('does not update http config if hostMapping is not present', () => {
        expect(transportSpy.http.updateConfig).not.toHaveBeenCalled()
      })

      it('calls beacon.sendPageView', () => {
        expect(beaconSpy.beacon.sendPageView).toHaveBeenCalled()
      })

      it('calls tracker.enable', () => {
        expect(trackerSpy.enable).toHaveBeenCalled()
      })

      it('calls renderer.init with the config', () => {
        expect(rendererSpy.renderer.init).toHaveBeenCalled()
      })

      describe('when chat is not part of config', () => {
        beforeAll(() => {
          config = { embeds: { helpCenter: {} } }
        })

        it('does not call zopimApi setUpZopimApiMethods', () => {
          expect(zopimApiSpy.setUpZopimApiMethods).not.toHaveBeenCalled()
        })
      })

      describe('when chat is part of config', () => {
        beforeAll(() => {
          config = { embeds: { chat: {} } }
        })

        it('calls zopimApi setUpZopimApiMethods with the win and reduxStore', () => {
          expect(zopimApiSpy.setUpZopimApiMethods).toHaveBeenCalledWith(win, reduxStore)
        })
      })

      describe('filterEmbeds', () => {
        describe('talk config is available but talk feature is not', () => {
          beforeAll(() => {
            document.zendesk = {
              web_widget: {
                // eslint-disable-line camelcase
                features: ['chat']
              }
            }

            config = {
              embeds: {
                helpCenterForm: {
                  embed: 'helpCenter',
                  props: {
                    position: 'right'
                  }
                },
                talk: {
                  embed: 'talk',
                  props: {
                    color: 'black'
                  }
                }
              }
            }
          })

          it('filters out talk from config', () => {
            expect(beaconSpy.beacon.setConfig).toHaveBeenCalledWith({
              embeds: {
                helpCenterForm: {
                  embed: 'helpCenter',
                  props: {
                    position: 'right'
                  }
                }
              }
            })
          })
        })
      })

      describe('when hostMapping is present', () => {
        beforeAll(() => {
          config = {
            hostMapping: 'test.zd.com',
            embeds: { a: 1 }
          }
        })

        it('updates http config', () => {
          expect(transportSpy.http.updateConfig).toHaveBeenCalledWith({
            hostMapping: 'test.zd.com'
          })
        })
      })

      describe('when win.zESettings is not defined', () => {
        beforeEach(() => {
          win.zESettings = undefined
          doneHandler({ body: config })
        })

        it('does not call beacon.trackSettings', () => {
          expect(beaconSpy.beacon.trackSettings).not.toHaveBeenCalled()
        })
      })

      describe('when win.zESettings is defined', () => {
        beforeEach(() => {
          win.zESettings = { authenticate: 'boo' }
          doneHandler({ body: config })
        })

        it('calls beacon.trackSettings', () => {
          expect(beaconSpy.beacon.trackSettings).toHaveBeenCalledWith({
            webWidget: {
              authenticate: true
            }
          })
        })
      })

      describe('when one in ten times', () => {
        beforeEach(() => {
          // Simulate a 1/10 chance.
          Math.random = jasmine.createSpy('random').and.returnValue(0.1)

          // Simulate 1 second passing between the call to config, and the response.
          boot.getConfig(win)
          jasmine.clock().tick(1000)
          doneHandler({ body: config })
        })

        it('calls beacon.setConfigLoadTime with the load time', () => {
          expect(beaconSpy.beacon.setConfigLoadTime).toHaveBeenCalledWith(1000)
        })
      })
    })
  })
})
