describe('Button component', function() {
  var Button,
      mockRegistry;
  const buttonPath = buildSrcPath('component/Button');

  beforeEach(function() {

    resetDOM();

    mockery.enable({
      useCleanCache: true
    });

    mockRegistry = initMockRegistry({
      'react/addons': React
    });

    mockery.registerAllowable(buttonPath);

    Button = require(buttonPath).Button;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should not have fullscreen classes when fullscreen prop is false', function() {
    const button = React.render(
      <Button />,
      global.document.body
    );
    const buttonElem = ReactTestUtils
      .findRenderedDOMComponentWithClass(button, 'Button--cta');
    const buttonClasses = buttonElem.props.className;
    const buttonContainerClasses = buttonElem.getDOMNode().parentNode.className;

    expect(buttonContainerClasses)
      .toMatch('u-textRight');

    expect(buttonClasses)
      .not.toMatch('u-sizeFull');
  });

  it('should have fullscreen classes when fullscreen prop is true', function() {
    const button = React.render(
      <Button fullscreen={true} />,
      global.document.body
    );
    const buttonElem = ReactTestUtils
      .findRenderedDOMComponentWithClass(button, 'Button--cta');
    const buttonClasses = buttonElem.props.className;
    const buttonContainerClasses = buttonElem.getDOMNode().parentNode.className;

    expect(buttonClasses)
      .toMatch('u-sizeFull');

    expect(buttonContainerClasses)
      .not.toMatch('u-textRight');
  });

  it('should not have rtl classes when rtl prop is false', function() {
    const button = React.render(
      <Button />,
      global.document.body
    );
    const buttonElem = ReactTestUtils
      .findRenderedDOMComponentWithClass(button, 'Button--cta');
    const buttonContainerClasses = buttonElem.getDOMNode().parentNode.className;

    expect(buttonContainerClasses)
      .not.toMatch('u-textLeft');

    expect(buttonContainerClasses)
      .toMatch('u-textRight');
  });

  it('should have rtl classes when rtl prop is true', function() {
    const button = React.render(
      <Button rtl={true} />,
      global.document.body
    );
    const buttonElem = ReactTestUtils
      .findRenderedDOMComponentWithClass(button, 'Button--cta');
    const buttonContainerClasses = buttonElem.getDOMNode().parentNode.className;

    expect(buttonContainerClasses)
      .toMatch('u-textLeft');

    expect(buttonContainerClasses)
      .not.toMatch('u-textRight');
  });

});

