describe('renderer', function() {
  let renderer,
    mockRegistry,
    mockSubmitTicket,
    mockLauncher,
    mockHelpCenter,
    mockChat,
    mockNps,
    mockIpm;
  const updateBaseFontSize = jasmine.createSpy();
  const updateFrameSize = jasmine.createSpy();
  const rendererPath = buildSrcPath('service/renderer');
  const embedMocker = function(name) {
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

  beforeEach(function() {
    mockery.enable();

    mockSubmitTicket = embedMocker('mockSubmitTicket');
    mockLauncher = embedMocker('mockLauncher');
    mockHelpCenter = embedMocker('mockHelpCenter');
    mockChat = embedMocker('mockChat');
    mockNps = embedMocker('mockNps');
    mockIpm = embedMocker('mockIpm');

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
      'embed/chat/chat': {
        chat: mockChat
      },
      'embed/nps/nps': {
        nps: mockNps
      },
      'embed/ipm/ipm': {
        ipm: mockIpm
      },
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', ['init', 'setLocale', 't'])
      },
      'service/mediator': {
        mediator: {
          channel: jasmine.createSpyObj('channel', ['broadcast', 'subscribe']),
          init: jasmine.createSpy(),
          initMessaging: jasmine.createSpy(),
          initNakedZopim: jasmine.createSpy()
        }
      },
      'lodash': _,
      'service/logging': {
        logging: jasmine.createSpyObj('logging', ['init', 'error'])
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

  afterEach(function() {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#init', function() {
    it('should call and render correct embeds from config', function() {
      const configJSON = {
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
      const launcherProps = configJSON.embeds.launcher.props;
      const mockMediator = mockRegistry['service/mediator'].mediator;

      renderer.init(configJSON);

      const mockLauncherRecentCall = mockLauncher.create.calls.mostRecent();

      expect(mockSubmitTicket.create)
        .toHaveBeenCalledWith('ticketSubmissionForm', jasmine.any(Object));

      expect(mockHelpCenter.create)
        .toHaveBeenCalledWith('helpCenterForm', jasmine.any(Object));

      expect(mockChat.create)
        .toHaveBeenCalledWith('zopimChat', jasmine.any(Object));

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
    });

    it('should handle dodgy config values', function() {
      const logging = mockRegistry['service/logging'].logging;

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

      expect(logging.error)
        .toHaveBeenCalled();

      expect(mockLauncher.create)
        .toHaveBeenCalled();

      expect(mockLauncher.create)
        .toHaveBeenCalledWith('aSubmissionForm', jasmine.any(Object));

      expect(mockLauncher.create)
        .toHaveBeenCalledWith('thingLauncher', jasmine.any(Object));

      expect(mockSubmitTicket.create)
        .toHaveBeenCalledWith('thing',
                              {visible: true,
                               hideZendeskLogo: undefined,
                               brand: undefined});

      expect(mockLauncher.render)
        .toHaveBeenCalledWith('aSubmissionForm');

      expect(mockLauncher.render)
        .toHaveBeenCalledWith('thingLauncher');
    });
  });

  it('should handle empty config', function() {
    renderer.init({});

    expect(renderer.init)
      .not.toThrow();
  });

  it('should not call renderer.init more than once', function() {
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

  describe('#propagateFontRatio', function() {
    it('should loop over all rendered embeds and update base font-size based on ratio', function() {
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

      expect(updateBaseFontSize.calls.count())
        .toEqual(2);

      expect(updateFrameSize)
        .toHaveBeenCalled();

      expect(updateFrameSize.calls.count())
        .toEqual(2);
    });

    it('should trigger propagateFontRatio call on orientationchange', function() {
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

    it('should trigger propagateFontRatio call on pinch zoom gesture', function() {
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

    it('should trigger propagateFontRatio call on window load', function() {
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

    it('should trigger propagateFontRatio call on dom content loaded', function() {
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

