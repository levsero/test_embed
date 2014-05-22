/** @jsx React.DOM */

describe('TextInput component', function() {
  var TextInput;
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

    var textInputPath = buildPath('component/TextInput');

    mockery.registerAllowable('react');
    mockery.registerAllowable(textInputPath);

    TextInput = require(textInputPath).TextInput;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should correctly set the initial state when created', function () {
    var textInput = React.renderComponent(
         <TextInput />,
         global.document.body
       ),
       state = textInput.state;

    expect(state.value)
      .toBe('');

    expect(state.errors.length)
      .toBe(0);

    expect(state.id)
      .toContain('input_');
  });

  it('should add an item to its errors array when onBlur is called', function() {
    var textInput = React.renderComponent(
         <TextInput />,
         global.document.body
       ),
       state = textInput.state;

    expect(state.errors.length)
      .toBe(0);

    ReactTestUtils.Simulate.blur(global.document.querySelector('input'));
    state = textInput.state;

    expect(state.errors.length)
      .toBe(1);
  });
});


