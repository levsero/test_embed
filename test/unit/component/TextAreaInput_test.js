/** @jsx React.DOM */
var TextAreaInput, baseTextAreaInput, propsTextAreaInput, validation, className, div;

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

    validation = [];
    className = 'styles';
    div = document.body.appendChild(document.createElement('div'));
    baseTextAreaInput = <TextAreaInput />;
    propsTextAreaInput = <TextAreaInput validation={validation} className={className} />;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();

    if(div) {
      div.parentNode.removeChild(div);
    }
  });

  it('should be added to the document when called', function () {
    var textAreaInput = React.renderComponent(baseTextAreaInput, div);
    expect(textAreaInput.getDOMNode()).toBeDefined();
  });

  it('should have the correct props when defined', function () {
    expect(baseTextAreaInput.props.validation).toBeUndefined();
    expect(baseTextAreaInput.props.className).toBeUndefined();

    expect(propsTextAreaInput.props.validation).toEqual(validation);
    expect(propsTextAreaInput.props.className).toEqual(className);
  });

});
