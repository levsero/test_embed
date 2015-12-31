describe('ButtonGroup component', function() {
  let ButtonGroup;
  const buttonPath = buildSrcPath('component/Button');

  beforeEach(function() {

    resetDOM();

    mockery.enable({
      useCleanCache: true
    });

    initMockRegistry({
      'React': React,
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
    const buttonGroup = shallowRender(<ButtonGroup />);
    
    expect(buttonGroup.props.className)
      .toMatch('u-textRight');

    expect(buttonGroup.props.className)
      .not.toMatch('u-textLeft');
  });

  it('should have rtl classes when rtl prop is true', function() {
    const buttonGroup = shallowRender(<ButtonGroup rtl={true} />);

    expect(buttonGroup.props.className)
      .toMatch('u-textLeft');

    expect(buttonGroup.props.className)
      .not.toMatch('u-textRight');
  });

});

