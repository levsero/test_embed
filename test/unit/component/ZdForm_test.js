/** @jsx React.DOM */

describe('ZdForm component', function() {
  var ZdForm,
      defaultValue = '123abc',
      mockValidation = {
        validateEmail: function() {
          return 'abc123';
        }
      },
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
        }));

  beforeEach(function() {

    mockery.enable({
      warnOnReplace:false
    });

    var zdFormPath = buildPath('component/ZdForm');

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
    mockery.registerMock('mixin/validation', {
      validation: mockValidation
    });
    mockery.registerMock('imports?_=lodash!lodash', {});
    mockery.registerAllowable(zdFormPath);
    mockery.registerAllowable('react/addons');
    mockery.registerAllowable('./lib/ReactWithAddons');
    mockery.registerAllowable('util/globals');

    ZdForm = require(zdFormPath).ZdForm;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should correctly render form with noValidate attribute', function() {
    var zdForm = React.renderComponent(
      <ZdForm />,
      global.document.body
    );

    expect(zdForm.getDOMNode().getAttribute('novalidate'))
      .toEqual('');
  });

  it('should call parent component submit when form is submitted', function() {
    var zdForm = React.renderComponent(
      <ZdForm submit={onSubmit} />,
      global.document.body
    );

    ReactTestUtils.Simulate.submit(zdForm.getDOMNode());

    expect(onSubmit)
      .toHaveBeenCalled();
  });
});
