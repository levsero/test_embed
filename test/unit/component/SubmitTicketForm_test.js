/** @jsx React.DOM */

describe('SubmitTicketForm component', function() {
  var SubmitTicketForm,
      mockRegistry,
      defaultValue = '123abc',
      onSubmit = jasmine.createSpy(),
      mockComponent = jasmine.createSpy('mockComponent')
        .andCallFake(React.createClass({
          value: function() {
            return {
              value: defaultValue
            };
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
        })),
      submitTicketFormPath = buildSrcPath('component/SubmitTicketForm');

  beforeEach(function() {

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

    mockery.registerAllowable(submitTicketFormPath);
    mockery.registerAllowable('util/globals');

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
