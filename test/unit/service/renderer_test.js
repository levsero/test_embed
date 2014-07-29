describe('renderer', function() {
  var renderer,
      mockRegistry,
      mockSubmitTicket,
      mockLauncher,
      mockHelpCenter,
      mockChat,
      mockGlobals = {
        win: {},
        document: {}
      },
      rendererPath = buildSrcPath('service/renderer'),
      embedMocker = function(name) {
        return jasmine.createSpyObj(name, ['create', 'render', 'show', 'hide']);
      };


  beforeEach(function() {
    mockery.enable({useCleanCache: true});

    mockSubmitTicket = embedMocker('mockSubmitTicket');
    mockLauncher = embedMocker('mockLauncher');
    mockHelpCenter = embedMocker('mockHelpCenter');

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
      'util/globals': mockGlobals,
      'imports?_=lodash!lodash': _
    })

    mockery.registerAllowable(rendererPath);
    renderer = require(rendererPath).renderer;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#init', function() {
    it('should call and render correct embeds from config', function() {
      var configJSON = {
            'helpCenterForm': {
              'embed': 'helpCenter',
              'props': {
               'onShow': {
                  'name': 'helpCenterLauncher',
                  'method': 'hide'
                },
                'onHide': {
                  'name': 'helpCenterLauncher',
                  'method': 'show'
                }
              }
            },
            'helpCenterLauncher': {
              'embed': 'launcher',
              'props': {
                'position': 'right',
                'onClick': {
                  'name': 'helpCenterForm',
                  'method': 'show'
                }
              }
            },
            'ticketSubmissionForm': {
              'embed': 'submitTicket'
            },
            'ticketSubmissionLauncher': {
              'embed': 'launcher',
              'props': {
                'position': 'right',
                'onClick': {
                  'name': 'ticketSubmissionForm',
                  'method': 'show'
                }
              }
            },
            'zopimChat': {
              'embed': 'chat',
              'props': {
                'zopimId': '2EkTn0An31opxOLXuGgRCy5nPnSNmpe6',
                'position': 'br',
                'onShow': {
                  name: 'ticketSubmissionLauncher',
                  method: 'update'
                },
              }
            }
          },
          launcherProps = configJSON.ticketSubmissionLauncher.props,
          mockLauncherRecentCall = mockLauncher.create.mostRecentCall;

      renderer.init(configJSON);

      expect(mockSubmitTicket.create)
        .toHaveBeenCalledWith('ticketSubmissionForm', jasmine.any(Object));

      expect(mockHelpCenter.create)
        .toHaveBeenCalledWith('helpCenterForm', jasmine.any(Object));

      expect(mockLauncher.create.callCount)
        .toBe(2);

      expect(mockLauncherRecentCall.args[1].position)
        .toEqual(launcherProps.position);

      // Access onClick callback and trigger it
      mockLauncherRecentCall.args[1].onClick();
      expect(mockSubmitTicket.show)
        .toHaveBeenCalledWith('ticketSubmissionForm');

      expect(mockSubmitTicket.render)
        .toHaveBeenCalledWith('ticketSubmissionForm');

      expect(mockHelpCenter.render)
        .toHaveBeenCalledWith('helpCenterForm');

      expect(mockLauncher.render)
        .toHaveBeenCalledWith('ticketSubmissionLauncher');
    });

    it('should handle dodgy config values', function() {
      renderer.init({
        'foobar': {
          'props': {}
        },
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
      });

      expect(renderer.init)
        .not.toThrow();

      expect(mockLauncher.create)
        .toHaveBeenCalled();

      expect(mockLauncher.create)
        .toHaveBeenCalledWith('aSubmissionForm', jasmine.any(Object));

      expect(mockLauncher.create)
        .toHaveBeenCalledWith('thingLauncher', jasmine.any(Object));

      expect(mockSubmitTicket.create)
        .toHaveBeenCalledWith('thing', {});

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
      });

      renderer.init({
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
      });

      expect(mockLauncher.create.callCount)
        .toEqual(1);

      expect(mockLauncher.render.callCount)
        .toEqual(1);
  });
});

