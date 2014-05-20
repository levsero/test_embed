/** @jsx React.DOM */
var TextAreaInput;

describe('TextAreaInput component', function() {
  beforeEach(function() {

    mockery.enable({
      warnOnReplace:false
    });
    mockery.registerMock('mixin/validation', {
      validation: {
        baseValidation: [{test: function() {}, message: ''}],
        emailValidation: function() {},
        ValidationMixin: function() {}
      }
    });
    mockery.registerMock('imports?_=lodash!lodash', _ );

    var textAreaInputPath = buildPath('component/TextAreaInput');

    mockery.registerAllowable('react');
    mockery.registerAllowable(textAreaInputPath);

    TextAreaInput = require(textAreaInputPath).TextAreaInput;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should be added to the document when called', function () {
    var textAreaInput = React.renderComponent(<TextAreaInput />, global.document.body);

    expect(textAreaInput.getDOMNode()).toBeDefined();
  });

  it('should have the correct props when defined', function () {
    var textAreaInput1 = <TextAreaInput />;

    expect(textAreaInput1.props.validation).toBeUndefined();
    expect(textAreaInput1.props.className).toBeUndefined();

    var validation = [],
        className = 'styles',
        textAreaInput2 = <TextAreaInput validation={validation} className={className} />;

    expect(textAreaInput2.props.validation).toEqual(validation);
    expect(textAreaInput2.props.className).toEqual(className);
  });

});
