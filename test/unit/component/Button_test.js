describe('Button component', function() {
  let Button,
      mockRegistry;
  const buttonPath = buildSrcPath('component/Button');

  beforeEach(function() {

    resetDOM();

    mockery.enable({
      useCleanCache: true
    });

    mockRegistry = initMockRegistry({
      'react/addons': React,
      'component/Icon': {
        Icon: noopReactComponent()
      },
      'service/i18n': noop
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
      .findRenderedDOMComponentWithClass(button, 'c-btn');
    const buttonClasses = buttonElem.props.className;

    expect(buttonClasses)
      .not.toMatch('u-sizeFull');
  });

  it('should have fullscreen classes when fullscreen prop is true', function() {
    const button = React.render(
      <Button fullscreen={true} />,
      global.document.body
    );
    const buttonElem = ReactTestUtils
      .findRenderedDOMComponentWithClass(button, 'c-btn');
    const buttonClasses = buttonElem.props.className;

    expect(buttonClasses)
      .toMatch('u-sizeFull');
  });

});

