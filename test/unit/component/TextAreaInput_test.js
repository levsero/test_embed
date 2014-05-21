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
        ValidationMixin: noop
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

});
