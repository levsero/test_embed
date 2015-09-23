describe('ButtonGroup component', function() {
  let ButtonGroup;
  let mockRegistry;
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
      'component/Loading': {
        LoadingEllipses: noopReactComponent()
      },
      'utility/utils': {
        'generateConstrastColor': noop
      },
      'service/i18n': noop
    });

    mockery.registerAllowable(buttonPath);

    ButtonGroup = require(buttonPath).ButtonGroup;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should not have rtl classes when rtl prop is false', function() {
    const button = React.render(
      <ButtonGroup />,
      global.document.body
    );
    const buttonElem = ReactTestUtils
      .findRenderedDOMComponentWithClass(button, 'u-textRight');
    const buttonGroupClasses = buttonElem.props.className;

    expect(buttonGroupClasses)
      .toMatch('u-textRight');

    expect(buttonGroupClasses)
      .not.toMatch('u-textLeft');
  });

  it('should have rtl classes when rtl prop is true', function() {
    const button = React.render(
      <ButtonGroup rtl={true} />,
      global.document.body
    );
    const buttonElem = ReactTestUtils
      .findRenderedDOMComponentWithClass(button, 'u-textLeft');
    const buttonGroupClasses = buttonElem.props.className;

    expect(buttonGroupClasses)
      .toMatch('u-textLeft');

    expect(buttonGroupClasses)
      .not.toMatch('u-textRight');
  });

});

