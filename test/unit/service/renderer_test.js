describe('renderer', function() {
  var renderer,
      mockGlobals = {
        win: {
        },
        document: {}
      },
      rendererPath = buildPath('service/renderer'),
      configJSON = {
        'ticketSubmissionForm': {
          'embed': 'submitTicket'
        },
        'ticketSubmissionLauncher': {
          'embed': 'launcher',
          'props': {
            'position': 'right',
            'onClick': {
              name: 'ticketSubmissionForm',
              method: 'show'
            }
          }
        }
      },
      mockSubmitTicket = {
        create: jasmine.createSpy(),
        show: jasmine.createSpy(),
        render: jasmine.createSpy()
      },
      mockLauncher = {
        create: jasmine.createSpy(),
        render: jasmine.createSpy()
      };

  beforeEach(function() {
    mockery.enable();

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
      renderer.init(configJSON);
      var submitTickProps = configJSON.ticketSubmissionLauncher.props;

      expect(mockSubmitTicket.create)
        .toHaveBeenCalledWith('ticketSubmissionForm', jasmine.any(Object));
      expect(mockLauncher.create)
        .toHaveBeenCalledWith('ticketSubmissionLauncher', submitTickProps);

      expect(mockSubmitTicket.render)
        .toHaveBeenCalledWith('ticketSubmissionForm');
      expect(mockLauncher.render)
        .toHaveBeenCalledWith('ticketSubmissionLauncher');

      // Access onClick callback and trigger it
      mockLauncher.create.mostRecentCall.args[1].onClick();
      expect(mockSubmitTicket.show).toHaveBeenCalledWith('ticketSubmissionForm');
    });
  });
});

