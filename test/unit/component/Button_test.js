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
        buttonClasses = buttonElem.props.className;

    expect(buttonClasses)
      .toMatch('u-pullRight');

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
        buttonClasses = buttonElem.props.className;


    expect(buttonClasses)
      .toMatch('u-sizeFull');

    expect(buttonClasses)
      .not.toMatch('u-pullRight');
  });

});

