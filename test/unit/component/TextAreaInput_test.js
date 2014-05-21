/** @jsx React.DOM */
var TextAreaInput;

describe('TextAreaInput component', function() {
  beforeEach(function() {
    resetDOM();

    mockery.enable({
      warnOnReplace:false
    });
    mockery.registerMock('mixin/validation', {
      validation: {
        baseValidation: noop,
        emailValidation: noop,
        ValidationMixin: {
          hasErrors: function() {
            return ['error'];
          }
        }
      }
    });
    mockery.registerMock('imports?_=lodash!lodash', _);

    var textAreaInputPath = buildPath('component/TextAreaInput');

    mockery.registerAllowable('react');
    mockery.registerAllowable(textAreaInputPath);

    TextAreaInput = require(textAreaInputPath).TextAreaInput;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should correctly set the initial states when created', function () {
    var textAreaInput = React.renderComponent(
      <TextAreaInput />,
      global.document.body
    );

    expect(textAreaInput.state.value)
      .toBe('');
    expect(textAreaInput.state.errors.length)
      .toBe(0);
    expect(textAreaInput.state.id)
      .toContain('description_');
  });

  it('should add an item to its errors array when onBlur is called', function() {
    var textAreaInput = React.renderComponent(
      <TextAreaInput />,
      global.document.body
    );

   expect(textAreaInput.state.errors.length)
     .toBe(0);

   ReactTestUtils.Simulate.blur(global.document.querySelector('textarea'));

   expect(textAreaInput.state.errors.length)
     .toBe(1);
  });
});
