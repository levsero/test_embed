describe('Submit ticket component', function() {
  var SubmitTicket,
      mockRegistry,
      formParams = {
        'set_tags': 'web_widget',
        'via_id': 48,
        'submitted_from': global.window.location.href,
        'email': 'mock@email.com',
        'description': 'Mock Description'
      },
      payload = {
        method: 'post',
        path: '/requests/embedded/create',
        params: formParams,
        callbacks: {
          done: noop,
          fail: noop
        }
      },
      submitTicketPath = buildSrcPath('component/SubmitTicket'),
      mockGetSizingRatio;

  beforeEach(function() {

    resetDOM();

    mockery.enable({
      useCleanCache: true
    });

    jasmine.addMatchers({
      toBeJSONEqual: function(util, customEqualityTesters) {
        return {
          compare: function(actual, expected) {
            var result= {};
            result.pass = util.equals(
              JSON.stringify(actual),
              JSON.stringify(expected),
              customEqualityTesters);
            return result;
          }
        };
      }
    });

    mockGetSizingRatio = function() {
      return 1;
    };

    mockRegistry = initMockRegistry({
      'react/addons': React,
      'utility/globals': {
        win: window,
        location: location
      },
      'utility/devices': {
        getSizingRatio: function() {
          return 1;
        },
        isMobileBrowser: function() {
          return false;
        }
      },
      'component/SubmitTicketForm': {
        SubmitTicketForm: React.createClass({
            getInitialState: function() {
              return {
                formState: {}
              };
            },
            render: function() {
              return <form onSubmit={this.props.handleSubmit} />;
            }
          }),
        MessageFieldset: noop,
        EmailField: noop
      },
      'component/ZendeskLogo': {
        ZendeskLogo: noopReactComponent()
      },
      'component/Button': {
        Button: noopReactComponent()
      },
      'component/Container': {
        Container: React.createClass({
            render: function() {
              return <div>{this.props.children}</div>;
            }
          }),
      },
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', [
          'init',
          'setLocale',
          'getLocaleId',
          't',
          'isRTL'
        ])
      },
      'service/transport': {
        transport: jasmine.createSpyObj('transport', ['send']),
      },
      'component/Icon': {
        Icon: noopReactComponent()
      },
      'lodash': _
    });

    mockery.registerAllowable(submitTicketPath);

    SubmitTicket = require(submitTicketPath).SubmitTicket;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should correctly set the initial states when created', function() {
    var submitTicket = React.render(
      <SubmitTicket />,
      global.document.body
    );

    expect(submitTicket.state.showNotification)
      .toEqual(false);

    expect(submitTicket.state.message)
      .toEqual('');
  });

  it('should not submit form when invalid', function() {
    var mockTransport = mockRegistry['service/transport'].transport,
        submitTicket = React.render(
          <SubmitTicket />,
          global.document.body
        );

    submitTicket.handleSubmit({preventDefault: noop}, {isFormValid: false});

    expect(mockTransport.send)
      .not.toHaveBeenCalled();
  });

  it('should submit form when valid', function() {
    var mockTransport = mockRegistry['service/transport'].transport,
        transportRecentCall,
        mockOnSubmitted = jasmine.createSpy('mockOnSubmitted'),
        submitTicket = React.render(
          <SubmitTicket onSubmitted={mockOnSubmitted} updateFrameSize={noop} />,
          global.document.body
        );

    submitTicket.handleSubmit({preventDefault: noop}, {
      isFormValid: true,
      value: {
        email: formParams.email,
        description: formParams.description
      }
    });

    transportRecentCall = mockTransport.send.calls.mostRecent().args[0];

    expect(transportRecentCall)
      .toBeJSONEqual(payload);

    transportRecentCall.callbacks.done({});

    expect(mockOnSubmitted)
      .toHaveBeenCalled();
  });

  it('should call onSubmitted with given last search state', function() {
    var mockTransport = mockRegistry['service/transport'].transport,
        transportRecentCall,
        mockOnSubmitted = jasmine.createSpy('mockOnSubmitted'),
        submitTicket = React.render(
          <SubmitTicket onSubmitted={mockOnSubmitted} updateFrameSize={noop} />,
          global.document.body
        );

    submitTicket.setState({
      searchString: 'a search',
      searchLocale: 'en-US'
    });

    submitTicket.handleSubmit({preventDefault: noop}, {
      isFormValid: true,
      value: {
        email: formParams.email,
        description: formParams.description
      }
    });

    transportRecentCall = mockTransport.send.calls.mostRecent().args[0];

    transportRecentCall.callbacks.done({});

    expect(mockOnSubmitted)
      .toHaveBeenCalled();

    expect(mockOnSubmitted.calls.mostRecent().args[0].searchString)
      .toEqual('a search');

    expect(mockOnSubmitted.calls.mostRecent().args[0].searchLocale)
      .toEqual('en-US');
  });

  it('should correctly format custom fields', function() {
    var mockCustomField = [
          {
            id: '22660514',
            type: 'text',
            title: 'Text',
            required: true
          },
        ],
        submitTicket,
        mockValues = {
          value: {
            22660514: 'mockCustomField',
            name: 'mockName',
            description: 'mockDescription'
          }
        },
        expectedPayload = {
          fields: {
            22660514: 'mockCustomField'
          },
          name: 'mockName',
          description: 'mockDescription'
        },
        payload;

    submitTicket = React.render(
      <SubmitTicket customFields={mockCustomField} updateFrameSize={noop} />,
      global.document.body
    );

    payload = submitTicket.formatTicketSubmission(mockValues);

    expect(payload)
      .toBeJSONEqual(expectedPayload);
  });

  it('should unhide notification element on state change', function() {
    var submitTicket = React.render(
          <SubmitTicket />,
          global.document.body
        ),
        notificationElem = ReactTestUtils
          .findRenderedDOMComponentWithClass(submitTicket, 'Notify');

    expect(notificationElem.props.className)
      .toContain('u-isHidden');

    submitTicket.setState({showNotification: true});

    expect(notificationElem.props.className)
      .not.toContain('u-isHidden');
  });

  describe('fullscreen state', function() {
    it('should be true if isMobileBrowser() is true', function() {

      mockRegistry['utility/devices'].isMobileBrowser = function() {
        return true;
      };

      mockery.resetCache();
      SubmitTicket = require(submitTicketPath).SubmitTicket;

      var submitTicket = React.render(
        <SubmitTicket />,
        global.document.body
      );

      expect(submitTicket.state.fullscreen)
        .toEqual(true);
    });

    it('should be false if isMobileBrowser() is false', function() {

      mockRegistry['utility/devices'].isMobileBrowser = function() {
        return false;
      };

      mockery.resetCache();
      SubmitTicket = require(submitTicketPath).SubmitTicket;

      var submitTicket = React.render(
        <SubmitTicket />,
        global.document.body
      );

      expect(submitTicket.state.fullscreen)
        .toEqual(false);
    });
  });

  it('should pass on fullscreen to submitTicketForm', function() {
    var submitTicket = React.render(
          <SubmitTicket />,
          global.document.body
        );

    submitTicket.setState({fullscreen: 'VALUE'});

    expect(submitTicket.state.fullscreen)
      .toEqual('VALUE');
  });


});
