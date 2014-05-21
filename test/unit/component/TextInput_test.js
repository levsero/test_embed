/** @jsx React.DOM */
var TextInput;

describe('TextInput component', function() {
  beforeEach(function() {
    resetDOM();

    mockery.enable({
      warnOnReplace:false
    });
    mockery.registerMock('mixin/validation', {
      validation: {
        baseValidation: noop,
        emailValidation: noop,
        ValidationMixin: noop
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
});


