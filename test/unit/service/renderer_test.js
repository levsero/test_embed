describe('renderer', () => {
  let renderer,
    mockRegistry,
    mockLauncher,
    mockChat,
    mockIpm,
    mockAutomaticAnswers,
    mockWebWidget,
    mockUpdateEmbedAccessible,
    loadSoundSpy;
  const updateBaseFontSize = jasmine.createSpy();
  const updateFrameSize = jasmine.createSpy();
  const rendererPath = buildSrcPath('service/renderer');
  const mediatorInitZopimStandaloneSpy = jasmine.createSpy('mediator.initZopimStandalone');
  const mediatorInitSpy = jasmine.createSpy('mediator.init');
  const mockTrackSettings = { webWidget: 'foo' };

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
        updateFrameSize: updateFrameSize
      }
    });

    return mock;
  };

  beforeEach(() => {
    mockery.enable();

    mockUpdateEmbedAccessible = jasmine.createSpy();

    mockLauncher = embedMocker('mockLauncher');
    mockChat = embedMocker('mockChat');
    mockIpm = embedMocker('mockIpm');
    mockAutomaticAnswers = embedMocker('mockAutomaticAnswers');
    mockWebWidget = embedMocker('mockWebWidget');
    loadSoundSpy = jasmine.createSpy('loadSound');

    mockRegistry = initMockRegistry({
      'embed/launcher/launcher': {
        launcher: mockLauncher
      },
      'embed/chat/chat': {
        chat: mockChat
      },
      'embed/ipm/ipm': {
        ipm: mockIpm
      },
      'embed/automaticAnswers/automaticAnswers': {
        automaticAnswers: mockAutomaticAnswers
      },
      'embed/webWidget/webWidget': {
        webWidget: mockWebWidget
      },
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', ['setCustomTranslations', 'setLocale', 't'])
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
      'service/audio': {
        audio: { loadSound: loadSoundSpy }
      },
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
      'src/redux/createStore': () => ({
        dispatch: noop
      }),
      'utility/globals': {
        win: global.window
      },
      'utility/devices':  {
        isMobileBrowser: jasmine.createSpy()
      },
      'src/redux/modules/base': {
        updateEmbedAccessible: mockUpdateEmbedAccessible
      }
    });

    mockery.registerAllowable(rendererPath);
    renderer = requireUncached(rendererPath).renderer;
  });

  afterEach(() => {
    jasmine.clock().uninstall();
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
          },
          'automaticAnswers': {
            'embed': 'automaticAnswers'
          }
        }
      };
    });

    it('should call and render correct embeds from config', () => {
      const launcherProps = configJSON.embeds.launcher.props;
      const mockMediator = mockRegistry['service/mediator'].mediator;

      renderer.init(configJSON);

      const mockLauncherRecentCall = mockLauncher.create.calls.mostRecent();

      expect(mockUpdateEmbedAccessible)
        .toHaveBeenCalledWith(jasmine.any(String), true);

      expect(mockChat.create)
        .toHaveBeenCalledWith('zopimChat', jasmine.any(Object), jasmine.any(Object));

      expect(mockLauncher.create.calls.count())
        .toBe(1);

      expect(mockLauncherRecentCall.args[1].position)
        .toEqual(launcherProps.position);

      expect(mockMediator.init)
        .toHaveBeenCalled();

      expect(mockAutomaticAnswers.create)
        .toHaveBeenCalled();

      expect(mockAutomaticAnswers.render)
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
            embeds: { zopimChat: { embed: 'chat' }}
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
            embeds: { zopimChat: { embed: 'chat' }}
          };

          mockWebWidget.create.calls.reset();

          renderer.init(config);
        });

        it('should not create zopimChat', () => {
          expect(mockChat.create)
            .not.toHaveBeenCalled();
        });

        it('should create webWidget embed', () => {
          expect(mockWebWidget.create)
            .toHaveBeenCalled();
        });
      });
    });

    describe('initialising services', () => {
      let mockSettings,
        mocki18n;

      beforeEach(() => {
        mockSettings = mockRegistry['service/settings'].settings;
        mocki18n = mockRegistry['service/i18n'].i18n;
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

      it('should call i18n.setLocale with the correct locale', () => {
        expect(mocki18n.setLocale)
          .toHaveBeenCalledWith('en');
      });
    });

    describe('loading sounds', () => {
      describe('when newChat is true', () => {
        beforeEach(() => {
          const config = {
            newChat: true,
            embeds: { zopimChat: { embed: 'chat' }}
          };

          renderer.init(config);
        });

        it('calls loadSound with incoming message sound', () => {
          expect(loadSoundSpy)
            .toHaveBeenCalledWith('incoming_message', 'https://v2.zopim.com/widget/sounds/triad_gbd');
        });
      });

      describe('when newChat is false', () => {
        beforeEach(() => {
          const config = {
            newChat: false,
            embeds: { zopimChat: { embed: 'chat' }}
          };

          renderer.init(config);
        });

        it('does not call loadSound with incoming message sound', () => {
          expect(loadSoundSpy)
            .not.toHaveBeenCalled();
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
        .toHaveBeenCalledWith('24px');

      expect(updateBaseFontSize.calls.count())
        .toEqual(3);

      expect(updateFrameSize)
        .toHaveBeenCalled();

      expect(updateFrameSize.calls.count())
        .toEqual(3);
    });

    it('should trigger propagateFontRatio call on orientationchange', () => {
      jasmine.clock().install();

      dispatchEvent('orientationchange', window);

      jasmine.clock().tick(10);

      expect(updateBaseFontSize)
        .toHaveBeenCalled();

      expect(updateFrameSize)
        .toHaveBeenCalled();
    });

    it('should trigger propagateFontRatio call on pinch zoom gesture', () => {
      jasmine.clock().install();

      dispatchEvent('touchend', window);

      jasmine.clock().tick(10);

      expect(updateBaseFontSize)
        .toHaveBeenCalled();

      expect(updateFrameSize)
        .toHaveBeenCalled();
    });

    it('should trigger propagateFontRatio call on window load', () => {
      dispatchEvent('load', window);

      expect(updateBaseFontSize)
        .toHaveBeenCalled();

      expect(updateFrameSize)
        .toHaveBeenCalled();
    });

    it('should trigger propagateFontRatio call on dom content loaded', () => {
      dispatchEvent('DOMContentLoaded', document);

      expect(updateBaseFontSize)
        .toHaveBeenCalled();

      expect(updateFrameSize)
        .toHaveBeenCalled();
    });
  });
});
