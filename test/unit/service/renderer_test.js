describe('renderer', function() {
  var renderer,
      mockSubmitTicket,
      mockLauncher,
      mockHelpCenter,
      updateBaseFontSize = jasmine.createSpy(),
      updateFrameSize = jasmine.createSpy(),
      mockGlobals = {
        win: {},
        document: {}
      },
      rendererPath = buildSrcPath('service/renderer'),
      embedMocker = function(name) {
        var mock = jasmine.createSpyObj(name, [
          'create',
          'render',
          'show',
          'hide',
          'get'
        ]);

        mock.get.andReturn({
          instance: {
            updateBaseFontSize: updateBaseFontSize,
            updateFrameSize: updateFrameSize
          }
        });

        return mock;
      };


  beforeEach(function() {
    mockery.enable({useCleanCache: true});

    mockSubmitTicket = embedMocker('mockSubmitTicket');
    mockLauncher = embedMocker('mockLauncher');
    mockHelpCenter = embedMocker('mockHelpCenter');

    mockery.registerMock('util/globals', mockGlobals);
    mockery.registerMock('imports?_=lodash!lodash', _);
    mockery.registerMock('embed/submitTicket/submitTicket', {
      submitTicket: mockSubmitTicket
    });

    mockery.registerMock('embed/launcher/launcher', {
      launcher: mockLauncher
    });

    mockery.registerMock('embed/helpCenter/helpCenter', {
      helpCenter: mockHelpCenter
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

  describe('#propagateFontRatio', function() {
    it('should loop over all rendered embeds and update base font-size based on ratio', function() {
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

      renderer.propagateFontRatio(2);

      expect(updateBaseFontSize)
        .toHaveBeenCalledWith('24px');

      expect(updateBaseFontSize.callCount)
        .toEqual(2);

      expect(updateFrameSize)
        .toHaveBeenCalled();

      expect(updateFrameSize.callCount)
        .toEqual(2);
    });

    it('should trigger propagateFontRatio call on orientationchange', function() {
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

      jasmine.Clock.useMock();

      dispatchEvent('orientationchange', window);

      jasmine.Clock.tick(10);

      expect(updateBaseFontSize)
        .toHaveBeenCalled();

      expect(updateFrameSize)
        .toHaveBeenCalled();
    });

    it('should trigger propagateFontRatio call on pinch zoom gensture', function() {
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

      jasmine.Clock.useMock();

      dispatchEvent('touchend', window);

      jasmine.Clock.tick(10);

      expect(updateBaseFontSize)
        .toHaveBeenCalled();

      expect(updateFrameSize)
        .toHaveBeenCalled();
    });
  });
});

