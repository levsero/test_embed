/** @jsx React.DOM */

describe('TextAreaInput component', function() {
  var TextAreaInput;
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

  it('should correctly set the initial state when created', function () {
    var textAreaInput = React.renderComponent(
          <TextAreaInput />,
          global.document.body
        ),
        state = textAreaInput.state;

    expect(state.value)
      .toBe('');

    expect(state.errors.length)
      .toBe(0);

    expect(state.id)
      .toContain('description_');

    expect(state.errorId)
      .toContain('errors_');
  });

  it('should add an item to its errors array when onBlur is called', function() {
    var textAreaInput = React.renderComponent(
         <TextAreaInput />,
         global.document.body
       ),
       state = textAreaInput.state;

   expect(state.errors.length)
     .toBe(0);

   ReactTestUtils.Simulate.blur(global.document.querySelector('textarea'));
   state = textAreaInput.state;

   expect(state.errors.length)
     .toBe(1);
  });
});
