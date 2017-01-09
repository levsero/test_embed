describe('renderer', () => {
  let renderer,
    mockRegistry,
    mockSubmitTicket,
    mockLauncher,
    mockHelpCenter,
    mockChannelChoice,
    mockChat,
    mockNps,
    mockIpm,
    mockAutomaticAnswers,
    mockChannelChoiceValue,
    mockExpandedValue,
    mockWebWidget;
  const updateBaseFontSize = jasmine.createSpy();
  const updateFrameSize = jasmine.createSpy();
  const rendererPath = buildSrcPath('service/renderer');
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

    mockSubmitTicket = embedMocker('mockSubmitTicket');
    mockLauncher = embedMocker('mockLauncher');
    mockHelpCenter = embedMocker('mockHelpCenter');
    mockChannelChoice = embedMocker('mockChannelChoice');
    mockChat = embedMocker('mockChat');
    mockNps = embedMocker('mockNps');
    mockIpm = embedMocker('mockIpm');
    mockAutomaticAnswers = embedMocker('mockAutomaticAnswers');
    mockWebWidget = embedMocker('mockWebWidget');

    mockExpandedValue = false;

    mockRegistry = initMockRegistry({
      'embed/submitTicket/submitTicket': {
        submitTicket: mockSubmitTicket
      },
      'embed/launcher/launcher': {
        launcher: mockLauncher
      },
      'embed/helpCenter/helpCenter': {
        helpCenter: mockHelpCenter
      },
      'embed/channelChoice/channelChoice': {
        channelChoice: mockChannelChoice
      },
      'embed/chat/chat': {
        chat: mockChat
      },
      'embed/nps/nps': {
        nps: mockNps
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
          init: jasmine.createSpy(),
          initMessaging: jasmine.createSpy(),
          initZopimStandalone: jasmine.createSpy()
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
          get: (value) => _.get({
            channelChoice: mockChannelChoiceValue,
            expanded: mockExpandedValue
          }, value, null)
        }
      },
      'src/redux/createStore': () => {
        return {};
      },
      'utility/globals': {
        win: global.window
      },
      'utility/devices':  {
        isMobileBrowser: jasmine.createSpy()
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

      expect(mockSubmitTicket.create)
        .toHaveBeenCalledWith('ticketSubmissionForm', jasmine.any(Object), jasmine.any(Object));

      expect(mockHelpCenter.create)
        .toHaveBeenCalledWith('helpCenterForm', jasmine.any(Object), jasmine.any(Object));

      expect(mockChat.create)
        .toHaveBeenCalledWith('zopimChat', jasmine.any(Object), jasmine.any(Object));

      expect(mockLauncher.create.calls.count())
        .toBe(1);

      expect(mockLauncherRecentCall.args[1].position)
        .toEqual(launcherProps.position);

      expect(mockSubmitTicket.render)
        .toHaveBeenCalledWith('ticketSubmissionForm');

      expect(mockHelpCenter.render)
        .toHaveBeenCalledWith('helpCenterForm');

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

      expect(mockSubmitTicket.create)
        .toHaveBeenCalledWith('thing', {
          visible: true,
          hideZendeskLogo: undefined,
          brand: undefined,
          expandable: undefined,
          disableAutoComplete: undefined
        }, jasmine.any(Object));

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

    describe('when channelChoice setting is false', () => {
      beforeEach(() => {
        mockChannelChoiceValue = false;

        renderer.init(configJSON);
      });

      it('should not create a channelChoice embed', () => {
        expect(mockChannelChoice.create)
          .not.toHaveBeenCalled();
      });
    });

    describe('when channelChoice setting is true', () => {
      beforeEach(() => {
        mockChannelChoiceValue = true;

        renderer.init(configJSON);
      });

      it('should create a channelChoice embed', () => {
        expect(mockChannelChoice.create)
          .toHaveBeenCalledWith('channelChoice', jasmine.any(Object), jasmine.any(Object));
      });
    });

    describe('when expanded setting is true', () => {
      beforeEach(() => {
        mockExpandedValue = true;

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

      it('should not create submitTicket and helpCenter', () => {
        expect(mockSubmitTicket.create)
          .not.toHaveBeenCalledWith();

        expect(mockHelpCenter.create)
          .not.toHaveBeenCalledWith();
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
  });

  describe('#propagateFontRatio', () => {
    it('should loop over all rendered embeds and update base font-size based on ratio', () => {
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

      renderer.propagateFontRatio(2);

      expect(updateBaseFontSize)
        .toHaveBeenCalledWith('24px');

      // The two embeds above and IPM and NPS
      expect(updateBaseFontSize.calls.count())
        .toEqual(4);

      expect(updateFrameSize)
        .toHaveBeenCalled();

      expect(updateFrameSize.calls.count())
        .toEqual(4);
    });

    it('should trigger propagateFontRatio call on orientationchange', () => {
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

      jasmine.clock().install();

      dispatchEvent('orientationchange', window);

      jasmine.clock().tick(10);

      expect(updateBaseFontSize)
        .toHaveBeenCalled();

      expect(updateFrameSize)
        .toHaveBeenCalled();
    });

    it('should trigger propagateFontRatio call on pinch zoom gesture', () => {
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

      jasmine.clock().install();

      dispatchEvent('touchend', window);

      jasmine.clock().tick(10);

      expect(updateBaseFontSize)
        .toHaveBeenCalled();

      expect(updateFrameSize)
        .toHaveBeenCalled();
    });

    it('should trigger propagateFontRatio call on window load', () => {
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

      dispatchEvent('load', window);

      expect(updateBaseFontSize)
        .toHaveBeenCalled();

      expect(updateFrameSize)
        .toHaveBeenCalled();
    });

    it('should trigger propagateFontRatio call on dom content loaded', () => {
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

      dispatchEvent('DOMContentLoaded', document);

      expect(updateBaseFontSize)
        .toHaveBeenCalled();

      expect(updateFrameSize)
        .toHaveBeenCalled();
    });
  });
});
