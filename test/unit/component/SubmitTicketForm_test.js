/** @jsx React.DOM */

describe('SubmitTicketForm component', function() {
  var SubmitTicketForm,
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

    mockery.enable({
      warnOnReplace:false
    });

    mockery.registerMock('react-forms', {
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
    });
    mockery.registerMock('component/SubmitTicketSchema', {
      submitTicketSchema: noop
    });
    mockery.registerMock('imports?_=lodash!lodash', {});
    mockery.registerAllowable(submitTicketFormPath);
    mockery.registerAllowable('react/addons');
    mockery.registerAllowable('./lib/ReactWithAddons');
    mockery.registerAllowable('util/globals');

    SubmitTicketForm = require(submitTicketFormPath).SubmitTicketForm;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should correctly render form with noValidate attribute', function() {
    var zdForm = React.renderComponent(
      <SubmitTicketForm />,
      global.document.body
    );

    expect(zdForm.getDOMNode().getAttribute('novalidate'))
      .toEqual('');
  });

  it('should call parent component submit when form is submitted', function() {
    var zdForm = React.renderComponent(
      <SubmitTicketForm submit={onSubmit} />,
      global.document.body
    );

    ReactTestUtils.Simulate.submit(zdForm.getDOMNode());

    expect(onSubmit)
      .toHaveBeenCalled();
  });
});
