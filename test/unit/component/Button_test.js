/** @jsx React.DOM */

describe('Button component', function() {
  var Button,
      mockRegistry,
      buttonPath = buildSrcPath('component/Button');

  beforeEach(function() {

    resetDOM();

    mockery.enable({
      useCleanCache: true
    });

    mockRegistry = initMockRegistry({
      'react/addons': React,
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', [
          'isRTL'
        ])
      }
    });

    mockery.registerAllowable(buttonPath);

    Button = require(buttonPath).Button;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should not have fullscreen classes when fullscreen prop is false', function() {
    var button = React.renderComponent(
          <Button />,
          global.document.body
        ),
        buttonElem = ReactTestUtils
          .findRenderedDOMComponentWithClass(button, 'Button--cta'),
        buttonClasses = buttonElem.props.className,
        buttonContainerClasses = buttonElem.getDOMNode().parentNode.className;

    expect(buttonContainerClasses)
      .toMatch('u-textRight');

    expect(buttonClasses)
      .not.toMatch('u-sizeFull');
  });

  it('should have fullscreen classes when fullscreen prop is true', function() {
    var button = React.renderComponent(
          <Button fullscreen={true} />,
          global.document.body
        ),
        buttonElem = ReactTestUtils
          .findRenderedDOMComponentWithClass(button, 'Button--cta'),
        buttonClasses = buttonElem.props.className,
        buttonContainerClasses = buttonElem.getDOMNode().parentNode.className;


    expect(buttonClasses)
      .toMatch('u-sizeFull');

    expect(buttonContainerClasses)
      .not.toMatch('u-textRight');
  });

  it('should not have rtl classes when rtl prop is false', function() {
    var button = React.renderComponent(
          <Button />,
          global.document.body
        ),
        buttonElem = ReactTestUtils
          .findRenderedDOMComponentWithClass(button, 'Button--cta'),
        buttonContainerClasses = buttonElem.getDOMNode().parentNode.className;


    expect(buttonContainerClasses)
      .not.toMatch('u-textLeft');

    expect(buttonContainerClasses)
      .toMatch('u-textRight');
  });

  it('should have rtl classes when rtl prop is true', function() {
    mockRegistry['service/i18n'].i18n = {
      isRTL: function() {
        return true;
      }
    };

    mockery.resetCache();
    Button = require(buttonPath).Button;

    var button = React.renderComponent(
          <Button />,
          global.document.body
        ),
        buttonElem = ReactTestUtils
          .findRenderedDOMComponentWithClass(button, 'Button--cta'),
        buttonContainerClasses = buttonElem.getDOMNode().parentNode.className;


    expect(buttonContainerClasses)
      .toMatch('u-textLeft');

    expect(buttonContainerClasses)
      .not.toMatch('u-textRight');
  });

});

