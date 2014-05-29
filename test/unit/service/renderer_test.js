describe('renderer', function() {
  var renderer,
      mockSubmitTicket,
      mockLauncher,
      mockGlobals = {
        win: {},
        document: {}
      },
      rendererPath = buildPath('service/renderer');


  beforeEach(function() {
    mockery.enable({useCleanCache: true});

    mockSubmitTicket = {
      create: jasmine.createSpy(),
      show: jasmine.createSpy(),
      render: jasmine.createSpy()
    };

    mockLauncher = {
      create: jasmine.createSpy(),
      render: jasmine.createSpy()
    };

    mockery.registerMock('util/globals', mockGlobals);
    mockery.registerMock('imports?_=lodash!lodash', _);
    mockery.registerMock('embed/submitTicket/submitTicket', {
      submitTicket: mockSubmitTicket
    });

    mockery.registerMock('embed/launcher/launcher', {
      launcher: mockLauncher
    });

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
            }
          },
          launcherProps = configJSON.ticketSubmissionLauncher.props,
          mockLauncherRecentCall = mockLauncher.create.mostRecentCall;

      renderer.init(configJSON);

      expect(mockSubmitTicket.create)
        .toHaveBeenCalledWith('ticketSubmissionForm', jasmine.any(Object));

      expect(mockLauncherRecentCall.args[1].position)
        .toEqual(launcherProps.position);

      // Access onClick callback and trigger it
      mockLauncherRecentCall.args[1].onClick();
      expect(mockSubmitTicket.show)
        .toHaveBeenCalledWith('ticketSubmissionForm');

      expect(mockSubmitTicket.render)
        .toHaveBeenCalledWith('ticketSubmissionForm');

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

