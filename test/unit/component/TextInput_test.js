/** @jsx React.DOM */
var TextInput;

describe('TextInput component', function() {
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

    var textInputPath = buildPath('component/TextInput');

    mockery.registerAllowable('react');
    mockery.registerAllowable(textInputPath);

    TextInput = require(textInputPath).TextInput;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should be added to the document when called', function () {
    var textInput = React.renderComponent(<TextInput />, global.document.body);

    expect(textInput.getDOMNode()).toBeDefined();
  });

  it('should have the correct props when defined', function () {
    var textInput1 = <TextInput />;

    expect(textInput1.props.name).toBeUndefined();
    expect(textInput1.props.validation).toBeUndefined();
    expect(textInput1.props.placeholder).toBeUndefined();
    expect(textInput1.props.className).toBeUndefined();

    var name = 'bob',
        validation = [],
        placeholder = 'testing',
        className = 'styles',
        textInput2 = <TextInput name={name} validation={validation} placeholder={placeholder} className={className} />;

    expect(textInput2.props.name).toEqual(name);
    expect(textInput2.props.validation).toEqual(validation);
    expect(textInput2.props.placeholder).toEqual(placeholder);
    expect(textInput2.props.className).toEqual(className);
  });

});

