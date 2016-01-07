describe('Submit ticket component', function() {
  let SubmitTicket,
    mockIsMobileBrowserValue,
    mockRegistry;
  const formParams = {
    'set_tags': 'web_widget',
    'via_id': 48,
    'submitted_from': global.window.location.href,
    'email': 'mock@email.com',
    'description': 'Mock Description'
  };
  const payload = {
    method: 'post',
    path: '/requests/embedded/create',
    params: formParams,
    callbacks: {
      done: noop,
      fail: noop
    }
  };
  const submitTicketPath = buildSrcPath('component/SubmitTicket');

  beforeEach(function() {

    resetDOM();

    mockIsMobileBrowserValue = false;

    mockery.enable();

    jasmine.addMatchers({
      toBeJSONEqual: function(util, customEqualityTesters) {
        return {
          compare: function(actual, expected) {
            const result = {};

            result.pass = util.equals(
              JSON.stringify(actual),
              JSON.stringify(expected),
              customEqualityTesters
            );
            return result;
          }
        };
      }
    });

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
          return mockIsMobileBrowserValue;
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
        })
      },
      'component/ScrollContainer': {
        ScrollContainer: React.createClass({
          render: function() {
            return <div>{this.props.children}</div>;
          }
        })
      },
      'service/i18n': {
        i18n: {
          init: noop,
          setLocale: noop,
          getLocaleId : noop,
          isRTL: noop,
          t: noop
        }
      },
      'component/Icon': {
        Icon: noopReactComponent()
      },
      'lodash': _
    });

    mockery.registerAllowable(submitTicketPath);

    SubmitTicket = requireUncached(submitTicketPath).SubmitTicket;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should correctly set the initial states when created', function() {
    const submitTicket = React.render(
      <SubmitTicket />,
      global.document.body
    );

    expect(submitTicket.state.showNotification)
      .toEqual(false);

    expect(submitTicket.state.message)
      .toEqual('');
  });

  it('should not call submitTicketSender and not send the form when invalid', function() {
    const mockSubmitTicketSender = jasmine.createSpy('mockSubmitTicketSender');
    const submitTicket = React.render(
      <SubmitTicket submitTicketSender={mockSubmitTicketSender} />,
      global.document.body
    );

    submitTicket.handleSubmit({preventDefault: noop}, {isFormValid: false});

    expect(mockSubmitTicketSender)
      .not.toHaveBeenCalled();
  });

  it('should call submitTicketSender and send the form when valid', function() {
    const mockSubmitTicketSender = jasmine.createSpy('mockSubmitTicketSender');
    const mockOnSubmitted = jasmine.createSpy('mockOnSubmitted');
    const submitTicket = React.render(
      <SubmitTicket
        submitTicketSender={mockSubmitTicketSender}
        onSubmitted={mockOnSubmitted}
        updateFrameSize={noop} />,
      global.document.body
    );

    submitTicket.handleSubmit({preventDefault: noop}, {
      isFormValid: true,
      value: {
        email: formParams.email,
        description: formParams.description
      }
    });

    expect(mockSubmitTicketSender)
      .toHaveBeenCalled();

    const params = mockSubmitTicketSender.calls.mostRecent().args[0];

    expect(params)
      .toBeJSONEqual(payload.params);

    mockSubmitTicketSender.calls.mostRecent().args[1]({});

    expect(mockOnSubmitted)
      .toHaveBeenCalled();
  });

  it('should call onSubmitted with given last search state', function() {
    const mockSubmitTicketSender = jasmine.createSpy('mockSubmitTicketSender');
    const mockOnSubmitted = jasmine.createSpy('mockOnSubmitted');
    const submitTicket = React.render(
      <SubmitTicket
        submitTicketSender={mockSubmitTicketSender}
        onSubmitted={mockOnSubmitted}
        updateFrameSize={noop} />,
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

    mockSubmitTicketSender.calls.mostRecent().args[1]({});

    expect(mockOnSubmitted)
      .toHaveBeenCalled();

    expect(mockOnSubmitted.calls.mostRecent().args[0].searchString)
      .toEqual('a search');

    expect(mockOnSubmitted.calls.mostRecent().args[0].searchLocale)
      .toEqual('en-US');
  });

  it('should correctly format custom fields', function() {
    const mockCustomField = [
      {
        id: '22660514',
        type: 'text',
        title: 'Text',
        required: true
      }
    ];
    const mockValues = {
      value: {
        22660514: 'mockCustomField',
        name: 'mockName',
        description: 'mockDescription'
      }
    };
    const expectedPayload = {
      fields: {
        22660514: 'mockCustomField'
      },
      name: 'mockName',
      description: 'mockDescription'
    };

    const submitTicket = React.render(
      <SubmitTicket customFields={mockCustomField} updateFrameSize={noop} />,
      global.document.body
    );

    const payload = submitTicket.formatTicketSubmission(mockValues);

    expect(payload)
      .toBeJSONEqual(expectedPayload);
  });

  it('should unhide notification element on state change', function() {
    const submitTicket = React.render(
      <SubmitTicket />,
      global.document.body
    );
    const notificationElem = submitTicket.refs.notification;

    expect(notificationElem.props.className)
      .toContain('u-isHidden');

    submitTicket.setState({showNotification: true});

    expect(notificationElem.props.className)
      .not.toContain('u-isHidden');
  });

  describe('fullscreen state', function() {
    it('should be true if isMobileBrowser() is true', function() {

      mockIsMobileBrowserValue = true;

      const submitTicket = React.render(
        <SubmitTicket />,
        global.document.body
      );

      expect(submitTicket.state.fullscreen)
        .toEqual(true);
    });

    it('should be false if isMobileBrowser() is false', function() {

      mockIsMobileBrowserValue = false;

      const submitTicket = React.render(
        <SubmitTicket />,
        global.document.body
      );

      expect(submitTicket.state.fullscreen)
        .toEqual(false);
    });
  });

  it('should pass on fullscreen to submitTicketForm', function() {
    const submitTicket = React.render(
          <SubmitTicket />,
          global.document.body
        );

    submitTicket.setState({fullscreen: 'VALUE'});

    expect(submitTicket.state.fullscreen)
      .toEqual('VALUE');
  });

});
