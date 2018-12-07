describe('renderer', () => {
  let renderer,
    mockRegistry,
    mockLauncher,
    mockChat,
    mockWebWidget,
    mockWebWidgetFactory,
    mockUpdateEmbedAccessible,
    mockUpdateArturos,
    widgetInitialisedSpy,
    mockLocale;
  const updateBaseFontSize = jasmine.createSpy();
  const forceUpdateWorldSpy = jasmine.createSpy();
  const setLocaleApiSpy = jasmine.createSpy();
  const rendererPath = buildSrcPath('service/renderer');
  const mediatorInitZopimStandaloneSpy = jasmine.createSpy('mediator.initZopimStandalone');
  const mediatorInitSpy = jasmine.createSpy('mediator.init');
  const mockTrackSettings = { webWidget: 'foo' };
  const FONT_SIZE = 14;

  const embedMocker = (name) => {
    const mock = jasmine.createSpyObj(name, [
      'create',
      'render',
      'show',
      'hide',
      'get',
      'postRender'
    ]);

    mock.get.and.returnValue({
      instance: {
        updateBaseFontSize: updateBaseFontSize,
        forceUpdateWorld: forceUpdateWorldSpy
      }
    });

    return mock;
  };

  beforeEach(() => {
    mockery.enable();

    mockUpdateEmbedAccessible = jasmine.createSpy();
    mockUpdateArturos = jasmine.createSpy();
    widgetInitialisedSpy = jasmine.createSpy();

    mockLauncher = embedMocker('mockLauncher');
    mockChat = embedMocker('mockChat');
    mockWebWidget = embedMocker('mockWebWidget');
    mockWebWidgetFactory = () => mockWebWidget;

    mockRegistry = initMockRegistry({
      'embed/launcher/launcher': {
        launcher: mockLauncher
      },
      'embed/chat/chat': {
        chat: mockChat
      },
      'embed/webWidget/webWidget': mockWebWidgetFactory,
      'service/i18n': {
        i18n: {
          setCustomTranslations: jasmine.createSpy(),
          setLocale: jasmine.createSpy(),
          t: jasmine.createSpy(),
          setFallbackTranslations: jasmine.createSpy(),
          getLocale: () => mockLocale
        }
      },
      'service/mediator': {
        mediator: {
          channel: jasmine.createSpyObj('channel', ['broadcast', 'subscribe']),
          init: mediatorInitSpy,
          initMessaging: jasmine.createSpy(),
          initZopimStandalone: mediatorInitZopimStandaloneSpy
        }
      },
      'lodash': _,
      'service/logging': {
        logging: jasmine.createSpyObj('logging', ['init', 'error'])
      },
      'service/settings': {
        settings: {
          enableCustomizations: jasmine.createSpy(),
          getTrackSettings: jasmine.createSpy().and.returnValue(mockTrackSettings),
          get: (value) => _.get({ contactOptions: { enabled: false } }, value, null)
        }
      },
      'utility/globals': {
        win: global.window
      },
      'constants/shared': {
        FONT_SIZE
      },
      'src/redux/modules/base': {
        updateEmbedAccessible: mockUpdateEmbedAccessible,
        updateArturos: mockUpdateArturos,
        widgetInitialised: widgetInitialisedSpy
      },
      'src/service/api/apis': {
        setLocaleApi: setLocaleApiSpy
      }
    });

    mockery.registerAllowable(rendererPath);
    renderer = requireUncached(rendererPath).renderer;
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    setLocaleApiSpy.calls.reset();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#init', () => {
    let configJSON;

    beforeEach(() => {
      configJSON = {
        embeds: {
          'helpCenterForm': {
            'embed': 'helpCenter',
            'props': {}
          },
          'launcher': {
            'embed': 'launcher',
            'props': {
              'position': 'right'
            }
          },
          'ticketSubmissionForm': {
            'embed': 'submitTicket'
          },
          'zopimChat': {
            'embed': 'chat',
            'props': {
              'zopimId': '2EkTn0An31opxOLXuGgRCy5nPnSNmpe6',
              'position': 'br'
            }
          }
        }
      };
    });

    it('should call and render correct embeds from config', () => {
      const launcherProps = configJSON.embeds.launcher.props;
      const mockMediator = mockRegistry['service/mediator'].mediator;

      renderer.init(configJSON);

      const mockLauncherRecentCall = mockLauncher.create.calls.mostRecent();

      expect(mockUpdateArturos)
        .toHaveBeenCalledWith({
          newChat: false,
          chatPopout: false,
          chatBadge: false
        });

      expect(mockUpdateEmbedAccessible)
        .toHaveBeenCalledWith(jasmine.any(String), true);

      expect(widgetInitialisedSpy)
        .toHaveBeenCalled();

      expect(mockChat.create)
        .toHaveBeenCalledWith('zopimChat', jasmine.any(Object), jasmine.any(Object));

      expect(mockLauncher.create.calls.count())
        .toBe(1);

      expect(mockLauncherRecentCall.args[1].position)
        .toEqual(launcherProps.position);

      expect(mockMediator.init)
        .toHaveBeenCalled();
    });

    it('should handle dodgy config values', () => {
      renderer.init({
        embeds: {
          'aSubmissionForm': {
            'embed': 'launcher',
            'props': {
              'onMouserMove': {
                'name': 'foobar',
                'method': 'show'
              }
            }
          },
          'thing': {
            'embed': 'submitTicket'
          },
          'thingLauncher': {
            'embed': 'launcher',
            'props': {
              'onDoubleClick': {
                'name': 'thing',
                'method': 'show'
              }
            }
          }
        }
      });

      expect(renderer.init)
        .not.toThrow();

      expect(mockLauncher.create)
        .toHaveBeenCalled();

      expect(mockLauncher.create)
        .toHaveBeenCalledWith('aSubmissionForm', jasmine.any(Object), jasmine.any(Object));

      expect(mockLauncher.create)
        .toHaveBeenCalledWith('thingLauncher', jasmine.any(Object), jasmine.any(Object));

      expect(mockLauncher.render)
        .toHaveBeenCalledWith('aSubmissionForm');

      expect(mockLauncher.render)
        .toHaveBeenCalledWith('thingLauncher');
    });

    it('should handle empty config', () => {
      renderer.init({});

      expect(renderer.init)
        .not.toThrow();
    });

    it('should not call renderer.init more than once', () => {
      renderer.init({
        embeds: {
          'thing': {
            'embed': 'submitTicket'
          },
          'thingLauncher': {
            'embed': 'launcher',
            'props': {
              'onDoubleClick': {
                'name': 'thing',
                'method': 'show'
              }
            }
          }
        }
      });

      renderer.init({
        embeds: {
          'thing': {
            'embed': 'submitTicket'
          },
          'thingLauncher': {
            'embed': 'launcher',
            'props': {
              'onDoubleClick': {
                'name': 'thing',
                'method': 'show'
              }
            }
          }
        }
      });

      expect(mockLauncher.create.calls.count())
        .toEqual(1);

      expect(mockLauncher.render.calls.count())
        .toEqual(1);
    });

    describe('zopimStandalone', () => {
      let configJSON;

      beforeEach(() => {
        configJSON = {
          newChat: false,
          embeds: {
            'zopimChat': {
              'embed': 'chat',
              'props': {
                'zopimId': '2EkTn0An31opxOLXuGgRCy5nPnSNmpe6',
                'position': 'br',
                'standalone': true
              }
            }
          }
        };

        mediatorInitSpy.calls.reset();
        mediatorInitZopimStandaloneSpy.calls.reset();

        renderer.init(configJSON);
      });

      it('should call mediator.initZopimStandalone', () => {
        expect(mediatorInitZopimStandaloneSpy)
          .toHaveBeenCalled();
      });

      it('should not call mediator.init', () => {
        expect(mediatorInitSpy)
          .not.toHaveBeenCalled();
      });
    });

    describe('when config is not naked zopim', () => {
      beforeEach(() => {
        renderer.init(configJSON);
      });

      it('should create a webWidget embed', () => {
        expect(mockWebWidget.create)
          .toHaveBeenCalledWith('webWidget', jasmine.any(Object), jasmine.any(Object));
      });

      it('should pass through the ticketSubmissionForm and helpCenterForm config', () => {
        const config = mockWebWidget.create.calls.mostRecent().args[1];

        expect(config.ticketSubmissionForm)
          .toBeTruthy();

        expect(config.helpCenterForm)
          .toBeTruthy();
      });

      it('should still create zopimChat', () => {
        expect(mockChat.create)
          .toHaveBeenCalled();
      });

      describe('when newChat is true', () => {
        beforeEach(() => {
          configJSON.newChat = true;

          mockChat.create.calls.reset();

          renderer.init(configJSON);
        });

        it('should not create zopimChat', () => {
          expect(mockChat.create)
            .not.toHaveBeenCalled();
        });
      });
    });

    describe('when the config is naked zopim', () => {
      describe('newChat is false', () => {
        beforeEach(() => {
          const config = {
            embeds: { zopimChat: { embed: 'chat' } }
          };

          mockWebWidget.create.calls.reset();

          renderer.init(config);
        });

        it('should not create webWidget embed', () => {
          expect(mockWebWidget.create)
            .not.toHaveBeenCalled();
        });

        it('should create zopimChat', () => {
          expect(mockChat.create)
            .toHaveBeenCalled();
        });
      });

      describe('newChat is true', () => {
        beforeEach(() => {
          const config = {
            newChat: true,
            embeds: { zopimChat: { embed: 'chat' } }
          };

          mockWebWidget.create.calls.reset();

          renderer.init(config);
        });

        it('does not create a zopimChat embed', () => {
          expect(mockChat.create)
            .not.toHaveBeenCalled();
        });

        it('creates a webWidget embed', () => {
          expect(mockWebWidget.create)
            .toHaveBeenCalled();
        });

        it('sets visibile prop in config to false', () => {
          const params = mockWebWidget.create.calls.mostRecent().args;

          expect(params[1].visible)
            .toBe(false);
        });
      });
    });

    describe('initialising services', () => {
      let mockSettings;

      beforeEach(() => {
        mockSettings = mockRegistry['service/settings'].settings;
        global.window.zESettings = {};

        renderer.init({
          locale: 'en',
          webWidgetCustomizations: true
        });
      });

      it('should call settings.enableCustomizations', () => {
        expect(mockSettings.enableCustomizations)
          .toHaveBeenCalled();
      });

      describe('when locale has not been set', () => {
        beforeAll(() => {
          mockLocale = null;
        });

        it('should call i18n.setLocale with the correct locale', () => {
          expect(setLocaleApiSpy)
            .toHaveBeenCalledWith(jasmine.any(Object), 'en');
        });
      });

      describe('when locale has been set', () => {
        beforeAll(() => {
          mockLocale = 'ar';
        });

        it('does not call i18n.setLocale', () => {
          expect(setLocaleApiSpy)
            .not
            .toHaveBeenCalled();
        });
      });
    });
  });

  describe('#propagateFontRatio', () => {
    beforeEach(() => {
      renderer.init({
        embeds: {
          'ticketSubmissionForm': {
            'embed': 'ticketSubmissionForm'
          },
          'thingLauncher': {
            'embed': 'launcher',
            'props': {
              'onDoubleClick': {
                'name': 'thing',
                'method': 'show'
              }
            }
          }
        }
      });
    });

    it('should loop over all rendered embeds and update base font-size based on ratio', () => {
      renderer.propagateFontRatio(2);

      expect(updateBaseFontSize)
        .toHaveBeenCalledWith(`${FONT_SIZE*2}px`);

      expect(updateBaseFontSize.calls.count())
        .toEqual(2);
    });

    it('should trigger propagateFontRatio call on orientationchange', () => {
      jasmine.clock().install();

      dispatchEvent('orientationchange', window);

      jasmine.clock().tick(10);

      expect(updateBaseFontSize)
        .toHaveBeenCalled();
    });

    it('should trigger propagateFontRatio call on pinch zoom gesture', () => {
      jasmine.clock().install();

      dispatchEvent('touchend', window);

      jasmine.clock().tick(10);

      expect(updateBaseFontSize)
        .toHaveBeenCalled();
    });

    it('should trigger propagateFontRatio call on window load', () => {
      dispatchEvent('load', window);

      expect(updateBaseFontSize)
        .toHaveBeenCalled();
    });

    it('should trigger propagateFontRatio call on dom content loaded', () => {
      dispatchEvent('DOMContentLoaded', document);

      expect(updateBaseFontSize)
        .toHaveBeenCalled();
    });
  });

  describe('#initIPM', () => {
    let configJSON;

    beforeEach(() => {
      configJSON = {
        embeds: {
          'helpCenterForm': {
            'embed': 'helpCenter',
            'props': { 'color': 'white' }
          }
        }
      };
    });

    it('calls and render correct embeds from config', () => {
      const hcProps = configJSON.embeds.helpCenterForm.props;

      renderer.initIPM(configJSON);

      const mockWebWidgetRecentCall = mockWebWidget.create.calls.mostRecent();

      expect(mockUpdateEmbedAccessible)
        .toHaveBeenCalledWith(jasmine.any(String), true);

      expect(mockWebWidget.create.calls.count())
        .toBe(1);

      expect(mockWebWidgetRecentCall.args[1].helpCenterForm.color)
        .toEqual(hcProps.color);
    });

    describe('embeddableConfig present', () => {
      let embeddableConfig;

      beforeEach(() => {
        embeddableConfig = {
          'embeds': {
            'helpCenterForm': {
              embed: 'helpCenter',
              props: {
                color: 'black',
                position: 'left'
              }
            }
          }
        };
      });

      it('merges the embeddableConfig with the custom config', () => {
        const hcProps = configJSON.embeds.helpCenterForm.props;

        renderer.initIPM(configJSON, embeddableConfig);

        const mockWebWidgetRecentCall = mockWebWidget.create.calls.mostRecent();

        expect(mockWebWidgetRecentCall.args[1].helpCenterForm.color)
          .toEqual(hcProps.color);

        expect(mockWebWidgetRecentCall.args[1].helpCenterForm.position)
          .toEqual('left');
      });
    });
  });

  describe('#updateEmbeds', () => {
    beforeEach(() => {
      renderer.init({
        embeds: {
          'ticketSubmissionForm': {
            'embed': 'ticketSubmissionForm'
          },
          'launcher': {
            'embed': 'launcher'
          }
        }
      });

      renderer.updateEmbeds();
    });

    it('loops over all rendered embeds and calls forceUpdateWorld on them', () => {
      renderer.propagateFontRatio(2);

      expect(forceUpdateWorldSpy)
        .toHaveBeenCalled();

      expect(forceUpdateWorldSpy.calls.count())
        .toEqual(2);
    });
  });
});
