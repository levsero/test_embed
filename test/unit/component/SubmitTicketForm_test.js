/** @jsx React.DOM */

describe('SubmitTicketForm component', function() {
  var SubmitTicketForm,
      onSubmit,
      mockRegistry,
      submitTicketFormPath = buildSrcPath('component/SubmitTicketForm');

  beforeEach(function() {

    var mockComponent = React.createClass({
      value: function() {
        return '123';
      },
      render: function() {
        /* jshint quotmark: false */
        var formBody = <div ref='form' />;
        return (
          <form
            noValidate
            onSubmit={onSubmit}
            className='Form'>
            {formBody}
          </form>
        );
      }
    });

    onSubmit = jasmine.createSpy();

    resetDOM();

    mockery.enable({
      warnOnReplace:false
    });

    mockRegistry = initMockRegistry({
      'react/addons': React,
      'react-forms': {
        Form: mockComponent,
        FormFor: mockComponent,
        schema: {
          Property: mockComponent
        },
        validation: {
          isFailure: function() {
            return false;
          }
        }
      },
      'component/SubmitTicketSchema': {
        submitTicketSchema: noop
      },
      'imports?_=lodash!lodash': _
    });

    mockery.registerAllowable('util/globals');
    mockery.registerAllowable(submitTicketFormPath);

    SubmitTicketForm = require(submitTicketFormPath).SubmitTicketForm;

  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should correctly render form with noValidate attribute', function() {
    var submitTicketForm = React.renderComponent(
      <SubmitTicketForm />,
      global.document.body
    );

    expect(submitTicketForm.getDOMNode().getAttribute('novalidate'))
      .toEqual('');
  });

  it('should call parent component submit when form is submitted', function() {
    var submitTicketForm = React.renderComponent(
      <SubmitTicketForm submit={onSubmit} />,
      global.document.body
    );

    ReactTestUtils.Simulate.submit(submitTicketForm.getDOMNode());

    expect(onSubmit)
      .toHaveBeenCalled();
  });

  describe('Send button classes', function() {

    it('should have fullscreen classes when fullscreen is true', function() {
      var submitTicketForm = React.renderComponent(
            <SubmitTicketForm submit={onSubmit} fullscreen={true} />,
            global.document.body
          ),
          button = ReactTestUtils
            .findRenderedDOMComponentWithClass(submitTicketForm, 'Button'),
          buttonClasses = button.props.className;

      expect(buttonClasses.indexOf('u-sizeFull') >= 0)
        .toEqual(true);

      expect(buttonClasses.indexOf('u-pullRight'))
        .toEqual(-1);
    });

    it('should not have fullscreen classes when fullscreen is false', function() {
      var submitTicketForm = React.renderComponent(
            <SubmitTicketForm submit={onSubmit} fullscreen={false} />,
            global.document.body
          ),
          button = ReactTestUtils
            .findRenderedDOMComponentWithClass(submitTicketForm, 'Button'),
          buttonClasses = button.props.className;

      expect(buttonClasses.indexOf('u-pullRight') >= 0)
        .toEqual(true);

      expect(buttonClasses.indexOf('u-sizeFull'))
        .toEqual(-1);
    });

  });

  it('should change state and alter submit button on valid submit', function() {
    var submitTicketForm = React.renderComponent(
          <SubmitTicketForm submit={onSubmit} />,
          global.document.body
        ),
        submitTicketFormNode = submitTicketForm.getDOMNode(),
        submitElem = submitTicketFormNode.querySelector('input[type="submit"]');

    expect(submitElem.disabled)
      .toEqual(true);

    submitTicketForm.setState({isValid: true});

    expect(submitElem.disabled)
      .toEqual(false);

    expect(submitTicketForm.state.isSubmitting)
      .toEqual(false);

    ReactTestUtils.Simulate.submit(submitTicketForm.getDOMNode());

    expect(submitTicketForm.state.buttonMessage)
      .toEqual('Submitting...');

    expect(submitTicketForm.state.isSubmitting)
      .toEqual(true);

    expect(submitElem.disabled)
      .toEqual(true);
  });
});
