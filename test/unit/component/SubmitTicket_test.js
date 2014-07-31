/** @jsx React.DOM */

describe('Submit ticket component', function() {
  var SubmitTicket,
      mockRegistry,
      formParams = {
        'set_tags': 'DROPBOX CEToolkit',
        'via_id': 17,
        'submitted_from': global.window.location.href,
        'email': 'mock@email.com',
        'description': 'Mock Description'
      },
      payload = {
        method: 'post',
        path: '/api/ticket_submission',
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

    this.addMatchers({
      toBeJSONEqual: function(expected) {
        return JSON.stringify(this.actual) === JSON.stringify(expected);
      }
    });

    mockGetSizingRatio = function() {
      return 1;
    };

    mockRegistry = initMockRegistry({
      'react/addons': React,
      'util/globals': { win: window },
      'util/devices': {
        getSizingRatio: function() {
          return 1;
        },
        isMobileBrowser: function() {
          return false;
        }
      },
      'component/SubmitTicketForm': {
        SubmitTicketForm: jasmine.createSpy('mockSubmitTicketForm')
          .andCallFake(React.createClass({
            render: function() {
              return <form onSubmit={this.props.handleSubmit} />;
            }
          })),
        MessageFieldset: noop,
        EmailField: noop
      },
      'service/identity': {
        identity: {
          getBuid: function() {
            return 'abc123';
          }
        }
      },
      'service/transport': {
        transport: jasmine.createSpyObj('transport', ['send']),
      },
      'imports?_=lodash!lodash': _
    });

    mockery.registerAllowable(submitTicketPath);

    SubmitTicket = require(submitTicketPath).SubmitTicket;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should correctly set the initial states when created', function() {
    var submitTicket = React.renderComponent(
      <SubmitTicket />,
      global.document.body
    );

    expect(submitTicket.state.showNotification)
      .toEqual(false);

    expect(submitTicket.state.message)
      .toEqual('');
  });

  it('should not submit form when invalid', function() {
    var mostRecentCall,
        mockSubmitTicketForm = mockRegistry['component/SubmitTicketForm'].SubmitTicketForm,
        mockTransport = mockRegistry['service/transport'].transport;

    React.renderComponent(
      <SubmitTicket />,
      global.document.body
    );

    mostRecentCall = mockSubmitTicketForm.mostRecentCall.args[0];

    mostRecentCall.submit({preventDefault: noop}, {isFormInvalid: true});

    expect(mockTransport.send)
      .not.toHaveBeenCalled();
  });

  it('should submit form when valid', function() {
    var mostRecentCall,
        mockSubmitTicketForm = mockRegistry['component/SubmitTicketForm'].SubmitTicketForm,
        mockTransport = mockRegistry['service/transport'].transport,
        transportRecentCall;

    React.renderComponent(
      <SubmitTicket />,
      global.document.body
    );

    mostRecentCall = mockSubmitTicketForm.mostRecentCall.args[0],

    mostRecentCall.submit({preventDefault: noop}, {
      isFormInvalid: false,
      value: {
        email: formParams.email,
        description: formParams.description
      }
    });

    transportRecentCall = mockTransport.send.mostRecentCall.args[0];

    expect(transportRecentCall)
      .toBeJSONEqual(payload);
  });

  it('should unhide notification element on state change', function() {
    var submitTicket = React.renderComponent(
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

      mockRegistry['util/devices'].isMobileBrowser = function() {
        return true;
      };

      mockery.resetCache();
      SubmitTicket = require(submitTicketPath).SubmitTicket;

      var submitTicket = React.renderComponent(
          <SubmitTicket />,
        global.document.body
      );
      
      expect(submitTicket.state.fullscreen)
        .toEqual(true);
    });

    it('should be false if isMobileBrowser() is false', function() {

      mockRegistry['util/devices'].isMobileBrowser = function() {
        return false;
      };

      mockery.resetCache();
      SubmitTicket = require(submitTicketPath).SubmitTicket;

      var submitTicket = React.renderComponent(
          <SubmitTicket />,
        global.document.body
      );
      
      expect(submitTicket.state.fullscreen)
        .toEqual(false);
    });
  });

  describe('container <div> class names', function() {
    it('should have the `fullscreen` classnames when fullscreen is true', function() {

      var submitTicket = React.renderComponent(
              <SubmitTicket />,
            global.document.body
          ),
          containerNode = submitTicket.getDOMNode().parentNode.firstChild,
          containerClasses;

      submitTicket.setState({fullscreen: true});

      containerClasses = containerNode.getAttribute('class');

      expect(containerClasses.indexOf('Container--fullscreen') >= 0)
        .toEqual(true);

      expect(containerClasses.indexOf('Container--popover'))
        .toEqual(-1);
    });

    it('should have the `popover` classnames when fullscreen is false', function() {

      var submitTicket = React.renderComponent(
              <SubmitTicket />,
            global.document.body
          ),
          containerNode = submitTicket.getDOMNode().parentNode.firstChild,
          containerClasses;

      submitTicket.setState({fullscreen: false});

      containerClasses = containerNode.getAttribute('class');

      expect(containerClasses.indexOf('Container--popover') >= 0)
        .toEqual(true);

      expect(containerClasses.indexOf('Container--fullscreen'))
        .toEqual(-1);
    });

  });

  describe('logo class names', function() {
    it('should have the `fullscreen` classnames when fullscreen is true', function() {

      var submitTicket = React.renderComponent(
              <SubmitTicket />,
            global.document.body
          ),
          logoNode = submitTicket.getDOMNode().parentNode.querySelector('a.Icon--zendesk'),
          logoClasses;

      submitTicket.setState({fullscreen: true});

      logoClasses = logoNode.getAttribute('class');

      expect(logoClasses.indexOf('u-posAbsolute'))
        .toEqual(-1);

      expect(logoClasses.indexOf('u-posStart'))
        .toEqual(-1);
      
    });

    it('should not have the `fullscreen` classnames when fullscreen is false', function() {

      var submitTicket = React.renderComponent(
              <SubmitTicket />,
            global.document.body
          ),
          logoNode = submitTicket.getDOMNode().parentNode.querySelector('a.Icon--zendesk'),
          logoClasses;

      submitTicket.setState({fullscreen: false});

      logoClasses = logoNode.getAttribute('class');

      expect(logoClasses.indexOf('u-posAbsolute') >= 0)
        .toEqual(true);

      expect(logoClasses.indexOf('u-posStart') >= 0)
        .toEqual(true);
       
    });

  });

  it('should pass on fullscreen to submitTicketForm', function() {
    var mostRecentCall,
        submitTicket,
        mockSubmitTicketForm = mockRegistry['component/SubmitTicketForm'].SubmitTicketForm;

    submitTicket = React.renderComponent(
      <SubmitTicket />,
      global.document.body
    );

    submitTicket.setState({fullscreen: 'VALUE'});
    mostRecentCall = mockSubmitTicketForm.mostRecentCall.args[0];

    expect(mostRecentCall.fullscreen)
      .toEqual('VALUE');
  });
    

});
