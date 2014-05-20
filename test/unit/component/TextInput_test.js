/** @jsx React.DOM */
var TextInput, baseTextInput, propsTextInput, name, validation, placeholder, className, div;

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

    name = 'bob';
    validation = [];
    placeholder = 'testing';
    className = 'styles';
    div = document.body.appendChild(document.createElement('div'));
    baseTextInput = <TextInput />;
    propsTextInput = <TextInput name={name} validation={validation} placeholder={placeholder} className={className} />;

  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();

    if(div) {
      div.parentNode.removeChild(div);
    }
  });

  it('should be added to the document when called', function () {
    var textInput = React.renderComponent(baseTextInput, div);
    expect(textInput.getDOMNode()).toBeDefined();
  });

  it('should have the correct props when defined', function () {
    expect(baseTextInput.props.name).toBeUndefined();
    expect(baseTextInput.props.validation).toBeUndefined();
    expect(baseTextInput.props.placeholder).toBeUndefined();
    expect(baseTextInput.props.className).toBeUndefined();

    expect(propsTextInput.props.name).toEqual(name);
    expect(propsTextInput.props.validation).toEqual(validation);
    expect(propsTextInput.props.placeholder).toEqual(placeholder);
    expect(propsTextInput.props.className).toEqual(className);
  });

});

